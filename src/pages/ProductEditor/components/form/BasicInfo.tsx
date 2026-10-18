import { useMemo, useState } from 'react';
import { Accordion, Alert, Group, Loader, Stack, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useFormContext, useWatch } from 'react-hook-form';

import { formatPrice } from '@common/utils';
import * as Fields from '@/containers/Fields';
import { forms, productEditor, productSuggestions } from '@/locale/uz';
import { Suggestions } from '@modules/products';
import type { CreateFormValues } from '@modules/products/forms';
import type * as Types from '@modules/products/types';

import SimilarProducts from './SimilarProducts';
import classes from './Form.module.css';

type IProps = {
  isCreate: boolean;
  suggestions: {
    similar: Types.IEntity.Product[];
    exactMatch: Types.IEntity.Product | null;
    isSearching: boolean;
  };
  onCopy: (product: Types.IEntity.Product) => void;
};

const TRANSLATIONS = 'translations';

const BasicInfo = ({ isCreate, suggestions, onCopy }: IProps) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<CreateFormValues>();
  const [name = '', description = ''] = useWatch({ control, name: ['name', 'description'] });

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

  const { exactMatch } = suggestions;
  const translationErrors = Boolean(errors.nameUz || errors.nameRu || errors.descriptionUz || errors.descriptionRu);
  const [translationsOpen, setTranslationsOpen] = useState<string | null>(null);

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Fields.Autocomplete
          name="name"
          label={productEditor.name}
          withAsterisk
          placeholder={productEditor.namePlaceholder}
          data={nameOptions.map(product => product.name)}
          // Results are already filtered by the backend search.
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
                    {[product.categoryName, product.price ? formatPrice(product.price) : null]
                      .filter(Boolean)
                      .join(' · ')}
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

        {isCreate && (
          <SimilarProducts
            products={exactMatch ? [exactMatch] : suggestions.similar}
            limit={exactMatch ? 1 : 4}
            onCopy={onCopy}
          />
        )}
      </Stack>

      <Fields.Textarea
        name="description"
        label={
          <>
            {productEditor.description}
            <span className={classes.labelHint}>{productEditor.optional}</span>
          </>
        }
        placeholder={productEditor.descriptionPlaceholder}
        autosize
        minRows={3}
      />

      <Accordion
        variant="contained"
        value={translationErrors ? TRANSLATIONS : translationsOpen}
        onChange={setTranslationsOpen}
      >
        <Accordion.Item value={TRANSLATIONS}>
          <Accordion.Control>
            <Text size="sm" c={translationErrors ? 'red' : undefined}>
              {productEditor.translations}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="sm">
              <Text size="xs" c="dimmed">
                {productEditor.translationsHint}
              </Text>
              <Group grow align="flex-start">
                {/* Empty UZ fields fall back to the main name/description when saving. */}
                <Fields.Text name="nameUz" label={forms.nameUz} placeholder={name || forms.nameUz} />
                <Fields.Text name="nameRu" label={forms.nameRu} placeholder={forms.nameRu} withAsterisk />
              </Group>
              <Fields.Textarea
                name="descriptionUz"
                label={forms.descriptionUz}
                placeholder={description || forms.descriptionUz}
                autosize
                minRows={2}
              />
              <Fields.Textarea
                name="descriptionRu"
                label={forms.descriptionRu}
                placeholder={forms.descriptionRu}
                autosize
                minRows={2}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default BasicInfo;
