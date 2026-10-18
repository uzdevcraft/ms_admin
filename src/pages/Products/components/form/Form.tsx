import { useEffect, useMemo, useRef, useState } from 'react';
import { Accordion, Alert, Button, Group, Loader, Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconSparkles } from '@tabler/icons-react';
import { useFormContext, useWatch, type FieldPath, type PathValue } from 'react-hook-form';

import { formatPrice } from '@common/utils';
import { toast } from '@/common/utils/toast';
import * as Fields from '@/containers/Fields';
import { forms, productSuggestions } from '@/locale/uz';
import { Hooks as CategoryHooks } from '@modules/categories';
import { Hooks, Suggestions } from '@modules/products';
import type { CreateFormValues } from '@modules/products/forms';
import type * as Types from '@modules/products/types';

import SimilarProducts from './SimilarProducts';
import classes from './Form.module.css';

const TRANSLATIONS = 'translations';

export default function Form() {
  const {
    control,
    getValues,
    setValue,
    formState: { dirtyFields, errors, isSubmitted }
  } = useFormContext<CreateFormValues>();

  const [name = '', description = '', categoryId = 0, price = 0, id] = useWatch({
    control,
    name: ['name', 'description', 'categoryId', 'price', 'id']
  });

  // Update form always carries the product id; the create form never does.
  const isCreate = !id;

  const { data: categories } = CategoryHooks.useList();
  const categoryOptions = useMemo(
    () => categories?.data.map(category => ({ value: String(category.id), label: category.name })) ?? [],
    [categories]
  );
  const categoryName = (value: number) =>
    categoryOptions.find(option => option.value === String(value))?.label ?? '';

  const suggestions = Hooks.useSuggestions({ name, categoryId, excludeId: id || undefined });

  const apply = <K extends FieldPath<CreateFormValues>>(key: K, value: PathValue<CreateFormValues, K>) =>
    setValue(key, value, { shouldDirty: true, shouldValidate: isSubmitted });

  // ---- name autocomplete (existing product names from backend search)
  const nameOptions = useMemo(() => {
    const seen = new Set<string>();
    return suggestions.similar
      .filter(product => {
        const key = Suggestions.normalize(product.name);
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }, [suggestions.similar]);
  const productByName = useMemo(
    () => new Map(nameOptions.map(product => [product.name, product] as const)),
    [nameOptions]
  );

  // ---- copy reusable fields from a similar product
  const copyFrom = (product: Types.IEntity.Product) => {
    const fields = Suggestions.copyableFields(product);
    apply('categoryId', fields.categoryId);
    apply('description', fields.description);
    apply('descriptionUz', fields.descriptionUz);
    apply('descriptionRu', fields.descriptionRu);
    apply('nameRu', fields.nameRu);
    apply('price', fields.price);
    apply('discountPrice', fields.discountPrice);
    apply('imageUrl', fields.imageUrl);
    toast.success(productSuggestions.copied(product.name));
  };

  // ---- UZ fields mirror the main name/description until they're edited by hand
  const prevName = useRef(name);
  useEffect(() => {
    const current = getValues('nameUz');
    if (!current || current === prevName.current) {
      setValue('nameUz', name, { shouldValidate: isSubmitted });
    }
    prevName.current = name;
  }, [name, getValues, setValue, isSubmitted]);

  const prevDescription = useRef(description);
  useEffect(() => {
    const current = getValues('descriptionUz');
    if (!current || current === prevDescription.current) {
      setValue('descriptionUz', description, { shouldValidate: isSubmitted });
    }
    prevDescription.current = description;
  }, [description, getValues, setValue, isSubmitted]);

  // ---- sort order: next free number in the category, unless typed by hand
  const sortOrderTouched = Boolean(dirtyFields.sortOrder);
  useEffect(() => {
    if (isCreate && suggestions.nextSortOrder !== null && !sortOrderTouched) {
      setValue('sortOrder', suggestions.nextSortOrder);
    }
  }, [isCreate, suggestions.nextSortOrder, sortOrderTouched, setValue]);

  // ---- translations stay open while they hold validation errors
  const translationErrors = Boolean(errors.nameUz || errors.nameRu || errors.descriptionUz || errors.descriptionRu);
  const [translationsOpen, setTranslationsOpen] = useState<string | null>(null);

  const { exactMatch, recommendedCategory, priceStats } = suggestions;
  const showCategoryHint = isCreate && recommendedCategory && recommendedCategory.categoryId !== categoryId;
  const discountPresets = Suggestions.discountPresets(price || 0);

  return (
    <Stack gap="sm">
      <Fields.Autocomplete
        name="name"
        label={forms.name}
        placeholder={forms.name}
        description={isCreate ? productSuggestions.nameHint : undefined}
        data={nameOptions.map(product => product.name)}
        // Results are already filtered by the backend.
        filter={({ options }) => options}
        rightSection={
          suggestions.isSearching && name.trim().length >= Suggestions.MIN_SEARCH_LENGTH ? <Loader size="xs" /> : null
        }
        renderOption={({ option }) => {
          const product = productByName.get(option.value);
          return (
            <div className={classes.option}>
              <Text size="sm">{option.value}</Text>
              {product && (
                <Text size="xs" c="dimmed">
                  {[product.categoryName, product.price ? formatPrice(product.price) : null].filter(Boolean).join(' · ')}
                </Text>
              )}
            </div>
          );
        }}
      />

      {exactMatch && (
        <Alert
          color="yellow"
          variant="light"
          icon={<IconAlertTriangle size={18} />}
          title={productSuggestions.duplicateTitle}
          p="xs"
        >
          <Text size="xs">{productSuggestions.duplicateMessage(exactMatch.name, exactMatch.categoryName)}</Text>
        </Alert>
      )}

      {isCreate && !exactMatch && <SimilarProducts products={suggestions.similar} onCopy={copyFrom} />}
      {isCreate && exactMatch && <SimilarProducts products={[exactMatch]} onCopy={copyFrom} limit={1} />}

      <div>
        <Fields.Select
          name="categoryId"
          label={forms.category}
          data={categoryOptions}
          numeric
          searchable
          placeholder={forms.category}
        />
        {showCategoryHint && (
          <div className={classes.hint}>
            <IconSparkles size={14} />
            <Text size="xs" c="dimmed">
              {productSuggestions.recommendedCategory}
            </Text>
            <Button
              size="compact-xs"
              variant="light"
              onClick={() => apply('categoryId', recommendedCategory.categoryId)}
            >
              {recommendedCategory.categoryName || categoryName(recommendedCategory.categoryId)}
            </Button>
            <Text size="xs" c="dimmed">
              ({productSuggestions.recommendedCategoryCount(recommendedCategory.count, recommendedCategory.total)})
            </Text>
          </div>
        )}
      </div>

      <Fields.Textarea name="description" label={forms.description} minRows={2} placeholder={forms.description} />

      <div>
        <Group grow align="flex-start">
          <Fields.Number name="price" label={forms.price} decimalScale={2} min={0} placeholder={forms.price} />
          <Fields.Number
            name="discountPrice"
            label={forms.discountPrice}
            decimalScale={2}
            min={0}
            placeholder={forms.discountPrice}
          />
        </Group>
        {priceStats && (
          <div className={classes.hint}>
            <Text size="xs" c="dimmed">
              {suggestions.priceSource === 'category'
                ? productSuggestions.priceRangeCategory
                : productSuggestions.priceRangeSimilar}{' '}
              {formatPrice(priceStats.min)} – {formatPrice(priceStats.max)}, {productSuggestions.median}{' '}
              {formatPrice(priceStats.median)}
            </Text>
            {price !== priceStats.median && (
              <Button size="compact-xs" variant="subtle" onClick={() => apply('price', priceStats.median)}>
                {productSuggestions.useMedian}
              </Button>
            )}
          </div>
        )}
        {discountPresets.length > 0 && (
          <div className={classes.hint}>
            <Text size="xs" c="dimmed">
              {productSuggestions.discountPresets}
            </Text>
            {discountPresets.map(preset => (
              <Button
                key={preset.percent}
                size="compact-xs"
                variant="default"
                onClick={() => apply('discountPrice', preset.value)}
              >
                −{preset.percent}% · {formatPrice(preset.value)}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Group grow align="flex-start">
        <Fields.Number name="stockQuantity" label={forms.stock} min={0} placeholder={forms.stock} />
        <Fields.Number
          name="sortOrder"
          label={forms.sortOrder}
          min={0}
          placeholder={forms.sortOrder}
          description={
            suggestions.nextSortOrder !== null ? productSuggestions.nextSortOrder(suggestions.nextSortOrder) : undefined
          }
        />
      </Group>

      <Accordion variant="contained" value={translationErrors ? TRANSLATIONS : translationsOpen} onChange={setTranslationsOpen}>
        <Accordion.Item value={TRANSLATIONS}>
          <Accordion.Control>
            <Text size="sm" c={translationErrors ? 'red' : undefined}>
              {productSuggestions.translations}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <Text size="xs" c="dimmed">
                {productSuggestions.translationsHint}
              </Text>
              <Group grow align="flex-start">
                <Fields.Text name="nameUz" label={forms.nameUz} placeholder={forms.nameUz} />
                <Fields.Text name="nameRu" label={forms.nameRu} placeholder={forms.nameRu} />
              </Group>
              <Fields.Textarea
                name="descriptionUz"
                label={forms.descriptionUz}
                minRows={2}
                placeholder={forms.descriptionUz}
              />
              <Fields.Textarea
                name="descriptionRu"
                label={forms.descriptionRu}
                minRows={2}
                placeholder={forms.descriptionRu}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Fields.Image name="imageUrl" label={forms.imageUrl} placeholder={forms.imagePlaceholder} />
      <Fields.Switch name="isActive" label={forms.activeVisible} />
    </Stack>
  );
}
