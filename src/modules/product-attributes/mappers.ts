import { get } from 'radash';
import type * as Types from './types';

export const AttributeOption = (src: unknown): Types.AttributeOption => ({
  id: get(src, 'id', 0),
  valueUz: get(src, 'valueUz', ''),
  valueRu: get(src, 'valueRu', ''),
  metaJson: get(src, 'metaJson', {}) as Record<string, unknown>
});

export const ProductAttributeGroup = (src: unknown): Types.ProductAttributeGroup => ({
  attributeDefinitionId: get(src, 'attributeDefinitionId', 0),
  code: get(src, 'code', ''),
  nameUz: get(src, 'nameUz', ''),
  displayType: get(src, 'displayType', 'DROPDOWN') as Types.AttributeDisplayType,
  options: (get(src, 'options', []) as unknown[]).map(AttributeOption),
  textValue: get(src, 'textValue', null) as string | null
});

export const ProductVariant = (src: unknown): Types.ProductVariant => ({
  variantId: get(src, 'variantId', 0),
  sku: get(src, 'sku', ''),
  effectivePrice: get(src, 'effectivePrice', 0),
  stockQuantity: get(src, 'stockQuantity', 0),
  active: get(src, 'active', false),
  selectedOptions: get(src, 'selectedOptions', {}) as Record<number, number>
});

export const ProductAttributes = (src: unknown): Types.ProductAttributes => ({
  variantGroups: (get(src, 'variantGroups', []) as unknown[]).map(ProductAttributeGroup),
  specGroups: (get(src, 'specGroups', []) as unknown[]).map(ProductAttributeGroup),
  variants: (get(src, 'variants', []) as unknown[]).map(ProductVariant)
});

export const SaveVariantsRequest = (variants: Types.VariantInput[]): Types.SaveVariantsRequest => ({ variants });

export const SaveSpecsRequest = (values: Types.SpecInput[]): Types.SaveSpecsRequest => ({ values });
