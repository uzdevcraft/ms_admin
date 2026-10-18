import { get } from 'radash';

import type * as ProductAttributes from '@/modules/product-attributes/types';

import { STATUS, attributeIdFromKey, specKey } from './constants';
import type * as Types from './types';

export const Product = (src: unknown): Types.IEntity.Product => {
  const imageUrl = get(src, 'imageUrl', '') as string;
  const imageUrls = get(src, 'imageUrls', []) as string[];

  return {
    id: get(src, 'id', 0),
    categoryId: get(src, 'categoryId', 0),
    categoryName: get(src, 'categoryName', ''),
    name: get(src, 'name', ''),
    nameUz: get(src, 'nameUz', ''),
    nameRu: get(src, 'nameRu', ''),
    description: get(src, 'description', ''),
    descriptionUz: get(src, 'descriptionUz', ''),
    descriptionRu: get(src, 'descriptionRu', ''),
    price: get(src, 'price', 0),
    discountPrice: get(src, 'discountPrice', 0),
    effectivePrice: get(src, 'effectivePrice', 0),
    imageUrl,
    stockQuantity: get(src, 'stockQuantity', 0),
    isActive: get(src, 'isActive', false),
    sortOrder: get(src, 'sortOrder', 0),
    createdAt: get(src, 'createdAt', ''),
    imageUrls: imageUrls.length ? imageUrls : imageUrl ? [imageUrl] : [],
    purchasePrice: get(src, 'purchasePrice', 0),
    storePrice: get(src, 'storePrice', null) as number | null,
    onlineEnabled: get(src, 'onlineEnabled', get(src, 'isActive', true)) as boolean,
    storeEnabled: get(src, 'storeEnabled', false),
    status: get(src, 'status', '') as Types.IEntity.Product['status']
  };
};

export const List = (src: unknown): Types.IQuery.List => {
  const items = Array.isArray(src) ? src : get(src, 'content', get(src, 'data', get(src, 'results', [])));

  return {
    data: (items as unknown[]).map(Product)
  };
};

export const AttributesRequest = (specs: Types.IForm.Create['specs']): Types.IApi.Create.AttributeValue[] =>
  Object.entries(specs)
    .map(([key, spec]) => ({
      attributeDefinitionId: attributeIdFromKey(key),
      optionIds: spec?.optionIds ?? [],
      value: spec?.value?.trim() ? spec.value.trim() : null
    }))
    .filter(item => item.attributeDefinitionId && (item.optionIds.length || item.value !== null));

export const CreateRequest = (values: Types.IForm.Create): Types.IApi.Create.Request => {
  const stockQuantity = values.variants.length
    ? values.variants.reduce((sum, variant) => sum + (variant.stockQuantity || 0), 0)
    : values.stockQuantity;

  return {
    categoryId: values.categoryId,
    name: values.name.trim(),
    nameUz: values.nameUz.trim() || values.name.trim(),
    nameRu: values.nameRu.trim(),
    description: values.description.trim(),
    descriptionUz: values.descriptionUz.trim() || values.description.trim(),
    descriptionRu: values.descriptionRu.trim(),
    price: values.price,
    discountPrice: values.discountEnabled ? values.discountPrice : 0,
    imageUrl: values.imageUrls[0] ?? '',
    stockQuantity,
    // A draft is never visible; otherwise visibility follows the online channel.
    isActive: values.status !== STATUS.draft && values.onlineEnabled,
    sortOrder: values.sortOrder,
    imageUrls: values.imageUrls,
    purchasePrice: values.purchasePrice,
    storePrice: values.storePrice || null,
    onlineEnabled: values.onlineEnabled,
    storeEnabled: values.storeEnabled,
    status: values.status,
    attributes: AttributesRequest(values.specs)
  };
};

export const UpdateRequest = (id: number, values: Types.IForm.Update): Types.IApi.Update.Request => ({
  id,
  newId: values.id,
  ...CreateRequest(values)
});

/** Variants in the shape of `PUT /seller/products/variants/{productId}`. */
export const VariantsRequest = (values: Types.IForm.Create): ProductAttributes.VariantInput[] =>
  values.variants.map(variant => ({
    variantId: variant.variantId,
    selectedOptions: variant.selectedOptions,
    sku: variant.sku.trim(),
    priceOverride: variant.price ?? undefined,
    stockQuantity: variant.stockQuantity
  }));

/** Prefills the editor from a saved product and its attributes/variants. */
export const FormValues = (
  product: Types.IEntity.Product,
  attributes?: ProductAttributes.ProductAttributes
): Types.IForm.Update => {
  const groups = attributes?.variantGroups ?? [];
  const optionLabel = (groupId: number, optionId: number) =>
    groups.find(group => group.attributeDefinitionId === groupId)?.options.find(option => option.id === optionId)
      ?.valueUz ?? String(optionId);

  const variants: Types.IForm.Variant[] = (attributes?.variants ?? []).map(variant => {
    const ids = Object.keys(variant.selectedOptions)
      .map(Number)
      .sort((a, b) => a - b);
    return {
      key: ids.map(id => `${id}:${variant.selectedOptions[id]}`).join('|'),
      variantId: variant.variantId,
      selectedOptions: variant.selectedOptions,
      label: ids.map(id => optionLabel(id, variant.selectedOptions[id])).join(' / '),
      sku: variant.sku,
      price: variant.effectivePrice && variant.effectivePrice !== product.price ? variant.effectivePrice : null,
      stockQuantity: variant.stockQuantity
    };
  });

  const variantOptions: Types.IForm.Create['variantOptions'] = {};
  variants.forEach(variant =>
    Object.entries(variant.selectedOptions).forEach(([groupId, optionId]) => {
      const key = specKey(Number(groupId));
      if (!variantOptions[key]?.includes(optionId)) variantOptions[key] = [...(variantOptions[key] ?? []), optionId];
    })
  );

  const specs: Types.IForm.Create['specs'] = {};
  (attributes?.specGroups ?? []).forEach(group => {
    specs[specKey(group.attributeDefinitionId)] = { optionIds: group.options.map(option => option.id), value: '' };
  });

  const discountEnabled = product.discountPrice > 0 && product.discountPrice < product.price;

  return {
    id: product.id,
    name: product.name,
    nameUz: product.nameUz,
    nameRu: product.nameRu,
    description: product.description,
    descriptionUz: product.descriptionUz,
    descriptionRu: product.descriptionRu,
    categoryId: product.categoryId,
    specs,
    variantOptions,
    purchasePrice: product.purchasePrice,
    price: product.price,
    discountEnabled,
    discountPrice: discountEnabled ? product.discountPrice : 0,
    storePrice: product.storePrice,
    stockQuantity: variants.length ? 0 : product.stockQuantity,
    variants,
    imageUrls: product.imageUrls,
    onlineEnabled: product.onlineEnabled,
    storeEnabled: product.storeEnabled,
    status: product.status || (product.isActive ? STATUS.active : STATUS.draft),
    sortOrder: product.sortOrder
  };
};
