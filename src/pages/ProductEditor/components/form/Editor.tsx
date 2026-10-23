import { useEffect, useMemo } from 'react';
import { Badge } from '@mantine/core';
import { useFormContext, useWatch } from 'react-hook-form';

import { toast } from '@common/utils';
import { productEditor, productSuggestions } from '@/locale/uz';
import { Hooks as AttributeHooks } from '@modules/attributes';
import { Hooks as CategoryHooks, Tree } from '@modules/categories';
import { Constants, Hooks, Suggestions } from '@modules/products';
import type { CreateFormValues } from '@modules/products/forms';
import type * as Types from '@modules/products/types';

import BasicInfo from './BasicInfo';
import CategoryPicker from './CategoryPicker';
import Channels from './Channels';
import Images from './Images';
import Pricing from './Pricing';
import Section from './Section';
import SpecAttributes from './SpecAttributes';

/**
 * The product editor body (sections 01–05). Lives inside a products
 * Create/Update form and talks to it through react-hook-form's context.
 */
const Editor = () => {
  const {
    control,
    getValues,
    setValue,
    formState: { dirtyFields, isSubmitted }
  } = useFormContext<CreateFormValues>();

  const [name = '', categoryId = 0, id] = useWatch({ control, name: ['name', 'categoryId', 'id'] });
  const isCreate = !id;

  // ---- backend data
  const { data: categories } = CategoryHooks.useList();
  const index = useMemo(() => Tree.buildIndex(categories?.data ?? []), [categories]);
  const path = useMemo(() => Tree.pathTo(index, categoryId), [index, categoryId]);

  // Loaded once a category is chosen; the API has no per-category attribute set yet.
  const attributes = AttributeHooks.useWithOptions(categoryId > 0);
  const suggestions = Hooks.useSuggestions({ name, categoryId, excludeId: id || undefined });

  const commissionCategory = [...path].reverse().find(item => item.commissionPercent !== null);
  const commissionPercent = commissionCategory?.commissionPercent ?? Constants.DEFAULT_COMMISSION_PERCENT;
  const commissionTier = [...path].reverse().find(item => item.commissionTier)?.commissionTier ?? '';
  const variantAxes = attributes.data?.variants ?? [];

  const options = { shouldDirty: true, shouldValidate: isSubmitted };

  // ---- a new category brings a new attribute set → previous answers no longer apply
  const changeCategory = (next: number) => {
    if (next === getValues('categoryId')) return;
    setValue('categoryId', next, options);
    setValue('specs', {}, { shouldDirty: true });
    setValue('variantOptions', {}, { shouldDirty: true });
    setValue('variants', [], { shouldDirty: true });
  };

  // ---- copy reusable fields from a similar product (backend search)
  const copyFrom = (product: Types.IEntity.Product) => {
    const fields = Suggestions.copyableFields(product);
    changeCategory(fields.categoryId);
    setValue('description', fields.description, options);
    setValue('descriptionUz', fields.descriptionUz, options);
    setValue('descriptionRu', fields.descriptionRu, options);
    setValue('nameRu', fields.nameRu, options);
    setValue('price', fields.price, options);
    setValue('discountEnabled', fields.discountEnabled, options);
    setValue('discountPrice', fields.discountPrice, options);
    if (fields.purchasePrice) setValue('purchasePrice', fields.purchasePrice, options);
    if (fields.storePrice) setValue('storePrice', fields.storePrice, options);
    if (fields.imageUrls.length && !getValues('imageUrls').length) setValue('imageUrls', fields.imageUrls, options);
    toast.success(productSuggestions.copied(product.name));
  };

  // ---- sort order: next free number in the category (no manual entry needed)
  const sortOrderTouched = Boolean(dirtyFields.sortOrder);
  useEffect(() => {
    if (isCreate && suggestions.nextSortOrder !== null && !sortOrderTouched) {
      setValue('sortOrder', suggestions.nextSortOrder);
    }
  }, [isCreate, suggestions.nextSortOrder, sortOrderTouched, setValue]);

  return (
    <>
      <Section number={1} title={productEditor.basic}>
        <BasicInfo isCreate={isCreate} suggestions={suggestions} onCopy={copyFrom} />
        <CategoryPicker
          index={index}
          onChange={changeCategory}
          variantNames={variantAxes.map(axis => axis.nameUz)}
          recommended={isCreate ? suggestions.recommendedCategory : null}
        />
      </Section>

      <Section number={2} title={productEditor.specs}>
        <SpecAttributes
          categoryId={categoryId}
          data={attributes.data}
          isLoading={attributes.isLoading}
          isError={attributes.isError}
          onRetry={() => void attributes.refetch()}
        />
      </Section>

      <Section
        number={3}
        title={productEditor.pricing}
        aside={
          <Badge variant="outline" color="blue" radius="sm" size="lg" tt="none">
            {productEditor.commission(commissionPercent, commissionTier)}
          </Badge>
        }
      >
        <Pricing
          axes={variantAxes}
          commissionPercent={commissionPercent}
          priceStats={suggestions.priceStats}
          priceSource={suggestions.priceSource}
        />
      </Section>

      <Section number={4} title={productEditor.images}>
        <Images />
      </Section>

      <Section number={5} title={productEditor.channels}>
        <Channels />
      </Section>
    </>
  );
};

export default Editor;
