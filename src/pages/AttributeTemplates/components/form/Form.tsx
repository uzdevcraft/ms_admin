import { useMemo } from 'react';
import { ActionIcon, Badge, Group, Input, Select, Stack, Text, Tooltip } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconX } from '@tabler/icons-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import * as Fields from '@/containers/Fields';
import { attributeTemplates as locale } from '@/locale/uz';
import { Hooks as AttributeHooks } from '@/modules/attributes';
import type { CreateFormValues } from '@/modules/attribute-templates/forms';

import classes from './Form.module.css';

type IProps = {
  /** Update form: saving replaces the whole attribute list. */
  replaces?: boolean;
};

/** Template name and its ordered attributes (order = `sortOrder`). */
export default function Form({ replaces = false }: IProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext<CreateFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'items', keyName: '_id' });

  const definitions = AttributeHooks.useList();
  const byId = useMemo(
    () => new Map((definitions.data?.data ?? []).map(item => [item.id, item] as const)),
    [definitions.data]
  );

  const usedIds = new Set(fields.map(field => field.attributeDefinitionId));
  const available = (definitions.data?.data ?? [])
    .filter(item => !usedIds.has(item.id))
    .map(item => ({
      value: String(item.id),
      label: `${item.nameUz} (${item.code})${item.variant ? ` · ${locale.variant}` : ''}`
    }));

  return (
    <Stack>
      <Fields.Text name="nameUz" label={locale.name} placeholder={locale.namePlaceholder} withAsterisk />

      <Input.Wrapper label={locale.attributes} error={errors.items?.message ?? errors.items?.root?.message}>
        <Stack gap="sm" mt={6}>
          <Select
            placeholder={available.length || definitions.isLoading ? locale.addAttributePlaceholder : locale.allAdded}
            data={available}
            value={null}
            onChange={value => value && append({ attributeDefinitionId: Number(value), required: false })}
            searchable
            disabled={!available.length}
            nothingFoundMessage={locale.allAdded}
            aria-label={locale.addAttribute}
          />

          {fields.length ? (
            <div className={classes.items}>
              {fields.map((field, index) => {
                const definition = byId.get(field.attributeDefinitionId);
                return (
                  <div key={field._id} className={classes.item}>
                    <span className={classes.order}>{index + 1}</span>
                    <div className={classes.itemName}>
                      <Group gap={6} wrap="nowrap">
                        <Text size="sm" fw={500} truncate>
                          {definition?.nameUz ?? `#${field.attributeDefinitionId}`}
                        </Text>
                        {definition?.variant && (
                          <Badge size="xs" variant="light" color="blue" radius="sm" tt="none">
                            {locale.variant}
                          </Badge>
                        )}
                      </Group>
                      {definition?.code && (
                        <Text size="xs" c="dimmed">
                          {definition.code}
                        </Text>
                      )}
                    </div>
                    <Fields.Checkbox name={`items.${index}.required`} size="xs" label={locale.required} />
                    <Group gap={2} wrap="nowrap">
                      <Tooltip label={locale.moveUp}>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          aria-label={locale.moveUp}
                          disabled={index === 0}
                          onClick={() => move(index, index - 1)}
                        >
                          <IconArrowUp size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={locale.moveDown}>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          aria-label={locale.moveDown}
                          disabled={index === fields.length - 1}
                          onClick={() => move(index, index + 1)}
                        >
                          <IconArrowDown size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={locale.remove}>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          aria-label={locale.remove}
                          onClick={() => remove(index)}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={classes.empty}>{locale.noItems}</div>
          )}

          {replaces && (
            <Text size="xs" c="dimmed">
              {locale.replaceNote}
            </Text>
          )}
        </Stack>
      </Input.Wrapper>
    </Stack>
  );
}
