import { useMemo, useState } from 'react';
import { Badge, Button, Code, Group, Modal, NumberInput, Select, Stack, Switch, Text, TextInput } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { tables } from '@/locale/uz';
import { Table } from '@/components/Table';
import getApiError from '@common/utils/getApiError';
import { toast } from '@/common/utils/toast';
import { useCreate, useDelete, useList, useUpdate } from '@/modules/attributes/hooks';
import { validateAttribute } from '@/modules/attributes/validation';
import type * as Types from '@/modules/attributes/types';

const attributeTypeOptions = [
  { value: 'SELECT', label: 'SELECT' },
  { value: 'MULTISELECT', label: 'MULTISELECT' },
  { value: 'TEXT', label: 'TEXT' },
  { value: 'NUMBER', label: 'NUMBER' },
  { value: 'BOOLEAN', label: 'BOOLEAN' }
];

const displayTypeOptions = [
  { value: 'DROPDOWN', label: 'DROPDOWN' },
  { value: 'SWATCH', label: 'SWATCH' },
  { value: 'BUTTON', label: 'BUTTON' }
];

const emptyForm = (): Types.IForm.AttributeDefinition => ({
  code: '',
  nameUz: '',
  nameRu: '',
  attributeType: 'SELECT',
  displayType: 'DROPDOWN',
  variant: false,
  filterable: true
});

const Attributes = () => {
  const { data, isLoading, isError, refetch, isFetching } = useList();
  const create = useCreate();
  const update = useUpdate();
  const remove = useDelete();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [values, setValues] = useState<Types.IForm.AttributeDefinition>(emptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof Types.IForm.AttributeDefinition, string>>>({});

  const attributes = data?.data ?? [];

  const handleSubmit = async () => {
    const nextErrors = validateAttribute(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      toast.error('Formadagi maydonlarni tekshiring');
      return;
    }

    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, values });
      } else {
        await create.mutateAsync(values);
      }

      setOpened(false);
      setEditingId(null);
      setValues(emptyForm());
      setErrors({});
    } catch (error) {
      const message = getApiError(error).message || 'Xatolik yuz berdi';
      toast.error(message);
    }
  };

  const handleEdit = (attribute: Types.IEntity.AttributeDefinition) => {
    setEditingId(attribute.id);
    setValues({
      code: attribute.code,
      nameUz: attribute.nameUz,
      nameRu: attribute.nameRu ?? '',
      attributeType: attribute.attributeType,
      displayType: attribute.displayType,
      variant: attribute.variant,
      filterable: attribute.filterable
    });
    setOpened(true);
  };

  const handleDelete = (attribute: Types.IEntity.AttributeDefinition) => {
    modals.openConfirmModal({
      centered: true,
      title: "Atributni o'chirish",
      children: <Text size="sm">{attribute.nameUz} ni o&apos;chirasizmi?</Text>,
      labels: { confirm: "O'chirish", cancel: 'Bekor qilish' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await remove.mutateAsync(attribute.id);
          toast.success("Atribut o'chirildi");
        } catch (error) {
          toast.error(getApiError(error).message || 'Xatolik yuz berdi');
        }
      }
    });
  };

  const columns = useMemo(
    () => [
      {
        key: 'code',
        title: 'Kod',
        render: (row: Types.IEntity.AttributeDefinition) => <Code fw={600}>{row.code}</Code>
      },
      {
        key: 'nameUz',
        title: 'Nomi',
        render: (row: Types.IEntity.AttributeDefinition) => (
          <Text size="sm" fw={600}>
            {row.nameUz}
          </Text>
        )
      },
      {
        key: 'attributeType',
        title: 'Turi',
        render: (row: Types.IEntity.AttributeDefinition) => (
          <Badge variant="light" color="gray">
            {row.attributeType}
          </Badge>
        )
      },
      {
        key: 'displayType',
        title: "Ko'rinish",
        render: (row: Types.IEntity.AttributeDefinition) => (
          <Badge variant="light" color="gray">
            {row.displayType}
          </Badge>
        )
      },
      {
        key: 'variant',
        title: 'Variant',
        render: (row: Types.IEntity.AttributeDefinition) => (
          <Badge variant="dot" color={row.variant ? 'blue' : 'gray'}>
            {row.variant ? 'Ha' : "Yo'q"}
          </Badge>
        )
      },
      {
        key: 'filterable',
        title: 'Filtr',
        render: (row: Types.IEntity.AttributeDefinition) => (
          <Badge variant="dot" color={row.filterable ? 'teal' : 'gray'}>
            {row.filterable ? 'Ha' : "Yo'q"}
          </Badge>
        )
      },
      {
        key: 'actions',
        title: 'Amallar',
        align: 'right' as const,
        render: (row: Types.IEntity.AttributeDefinition) => (
          <Group gap={6} wrap="nowrap" justify="flex-end">
            <Button size="compact-sm" variant="light" onClick={() => (window.location.href = `/attributes/${row.id}`)}>
              Ochish
            </Button>
            <Button size="compact-sm" variant="default" onClick={() => handleEdit(row)}>
              Tahrirlash
            </Button>
            <Button size="compact-sm" color="red" variant="subtle" onClick={() => handleDelete(row)}>
              O'chirish
            </Button>
          </Group>
        )
      }
    ],
    [attributes]
  );

  return (
    <PageHeader
      title="Atributlar"
      description="Atribut turlari va qiymatlarini boshqaring"
      actions={
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditingId(null);
            setValues(emptyForm());
            setErrors({});
            setOpened(true);
          }}
        >
          Yangi atribut
        </Button>
      }
    >
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : (
        <Table
          data={attributes}
          columns={columns}
          loading={isLoading}
          rowKey={attribute => attribute.id}
          minWidth={980}
          title={tables.allAttributes}
          count={isLoading ? undefined : attributes.length}
          emptyMessage="Hali atribut yo'q"
        />
      )}

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editingId ? 'Atributni tahrirlash' : 'Yangi atribut'}
        centered
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Kod"
            value={values.code}
            onChange={event => setValues(prev => ({ ...prev, code: event.currentTarget.value }))}
            error={errors.code}
          />
          <TextInput
            label="Nomi (uz)"
            value={values.nameUz}
            onChange={event => setValues(prev => ({ ...prev, nameUz: event.currentTarget.value }))}
            error={errors.nameUz}
          />
          <TextInput
            label="Nomi (ru)"
            value={values.nameRu}
            onChange={event => setValues(prev => ({ ...prev, nameRu: event.currentTarget.value }))}
          />

          <Group grow>
            <Select
              label="Tur"
              data={attributeTypeOptions}
              value={values.attributeType}
              onChange={value =>
                setValues(prev => ({ ...prev, attributeType: (value as Types.IEntity.AttributeType) || 'SELECT' }))
              }
              error={errors.attributeType}
            />
            <Select
              label="Ko'rinish"
              data={displayTypeOptions}
              value={values.displayType}
              onChange={value =>
                setValues(prev => ({
                  ...prev,
                  displayType: (value as Types.IEntity.AttributeDisplayType) || 'DROPDOWN'
                }))
              }
              error={errors.displayType}
            />
          </Group>

          <Group grow>
            <Switch
              label="Variant"
              checked={values.variant}
              onChange={event => setValues(prev => ({ ...prev, variant: event.currentTarget.checked }))}
            />
            <Switch
              label="Filtr"
              checked={values.filterable}
              onChange={event => setValues(prev => ({ ...prev, filterable: event.currentTarget.checked }))}
            />
          </Group>

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setOpened(false)}>
              Bekor qilish
            </Button>
            <Button onClick={() => void handleSubmit()} loading={create.isPending || update.isPending}>
              Saqlash
            </Button>
          </Group>
        </Stack>
      </Modal>
    </PageHeader>
  );
};

export default Attributes;
