import { useMemo, useRef, useState } from 'react';
import { Autocomplete, Badge, Button, Group, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconSearch, IconSparkles } from '@tabler/icons-react';
import { useFormContext, useWatch } from 'react-hook-form';

import { productEditor, productSuggestions } from '@/locale/uz';
import { Tree } from '@modules/categories';
import type { CategoryIndex } from '@modules/categories/tree';
import type { CreateFormValues } from '@modules/products/forms';
import type { CategoryRecommendation } from '@modules/products/suggestions';

import classes from './Form.module.css';

type IProps = {
  index: CategoryIndex;
  onChange: (categoryId: number) => void;
  /** Names of the category's variant axes, e.g. ["O'lcham", "Rang"]. */
  variantNames: string[];
  recommended: CategoryRecommendation | null;
};

const LEVEL_LABELS = [productEditor.level1, productEditor.level2, productEditor.level3];

const CategoryPicker = ({ index, onChange, variantNames, recommended }: IProps) => {
  const {
    control,
    formState: { errors }
  } = useFormContext<CreateFormValues>();
  const categoryId = useWatch({ control, name: 'categoryId' }) ?? 0;

  // Products attach only to subcategories. Picking a department / category is
  // kept as a local draft (it only opens the next level) and clears the value.
  const [draftId, setDraftId] = useState(0);
  const select = (id: number) => {
    if (id && Tree.isSelectable(index, id)) {
      onChange(id);
    } else {
      setDraftId(id);
      onChange(0);
    }
  };

  // ---- search: free text over subcategories, cleared after one is picked
  const [query, setQuery] = useState('');
  const justPicked = useRef(false);
  const results = useMemo(
    () => Tree.search(index, query, 8, category => Tree.isSelectable(index, category.id)),
    [index, query]
  );

  // ---- cascade: one select per level, derived from the selected (or draft) category's path
  const focusId = categoryId || draftId;
  const path = useMemo(() => Tree.pathTo(index, focusId), [index, focusId]);
  const levels = Math.min(3, Tree.depth(index));
  const current = categoryId ? path[path.length - 1] : undefined;
  const tier = current ? (path.findLast(item => item.commissionTier)?.commissionTier ?? '') : '';
  const needsDeeper = !categoryId && path.length > 0;

  const levelSelects = Array.from({ length: levels }, (_, level) => {
    const parentId = level === 0 ? null : path[level - 1]?.id;
    const options = parentId === undefined ? [] : index.childrenOf(parentId);
    return { level, parentId, options, value: path[level]?.id ?? null };
  });

  const error = errors.categoryId?.message;

  return (
    <Stack gap="md">
      <Autocomplete
        label={
          <>
            {productEditor.category}
            <span className={classes.labelHint}>{productEditor.categoryHint}</span>
          </>
        }
        withAsterisk
        value={query}
        onChange={value => {
          if (justPicked.current) {
            justPicked.current = false;
            setQuery('');
            return;
          }
          setQuery(value);
        }}
        onOptionSubmit={value => {
          justPicked.current = true;
          select(Number(value));
        }}
        data={results.map(result => ({ value: String(result.category.id), label: result.label }))}
        filter={({ options }) => options}
        leftSection={<IconSearch size={18} />}
        placeholder={productEditor.categorySearchPlaceholder}
      />

      <SimpleGrid cols={{ base: 1, sm: levels }} spacing="md">
        {levelSelects.map(({ level, parentId, options, value }) => (
          <Select
            key={level}
            label={levels === 1 ? productEditor.level2 : LEVEL_LABELS[level]}
            placeholder={productEditor.choose}
            data={options.map(option => ({ value: String(option.id), label: option.name }))}
            value={value ? String(value) : null}
            onChange={next => select(next ? Number(next) : (parentId ?? 0))}
            disabled={!options.length}
            searchable={options.length > 8}
            clearable={level > 0}
            nothingFoundMessage={productEditor.categoryNothingFound}
            error={!categoryId && level === Math.min(path.length, levels - 1) ? error : undefined}
          />
        ))}
      </SimpleGrid>

      {current && (path.length > 1 || variantNames.length > 0 || tier) && (
        <div className={classes.path}>
          {path.map((item, position) => (
            <span key={item.id} className={position === path.length - 1 ? classes.pathCurrent : undefined}>
              {position > 0 && '› '}
              {item.name}
            </span>
          ))}
          {variantNames.length > 0 && (
            <Badge color="blue" variant="light" radius="sm" tt="none">
              {productEditor.variantChip(variantNames.join(' + '))}
            </Badge>
          )}
          {tier && (
            <Badge color="gray" variant="outline" radius="sm" tt="none">
              {tier}
            </Badge>
          )}
        </div>
      )}

      {needsDeeper && (
        <Text size="xs" c="blue">
          {productEditor.chooseDeeper}
        </Text>
      )}

      {recommended && recommended.categoryId !== categoryId && Tree.isSelectable(index, recommended.categoryId) && (
        <Group gap={6} className={classes.hint}>
          <IconSparkles size={14} />
          <Text size="xs" c="dimmed">
            {productSuggestions.recommendedCategory}
          </Text>
          <Button size="compact-xs" variant="light" onClick={() => select(recommended.categoryId)}>
            {Tree.pathLabel(Tree.pathTo(index, recommended.categoryId))}
          </Button>
          <Text size="xs" c="dimmed">
            ({productSuggestions.recommendedCategoryCount(recommended.count, recommended.total)})
          </Text>
        </Group>
      )}
    </Stack>
  );
};

export default CategoryPicker;
