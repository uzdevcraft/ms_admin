import {
  Group,
  NumberInput,
  Stack,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { CategoryFormValues } from './schema';

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryFormValues>;
  control: Control<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
}

export function CategoryFormFields({ register, control, errors }: CategoryFormFieldsProps) {
  return (
    <Stack gap="sm">
      <Group grow>
        <TextInput label="Name" error={errors.name?.message} {...register('name')} />
        <TextInput label="Name (UZ)" error={errors.nameUz?.message} {...register('nameUz')} />
        <TextInput label="Name (RU)" error={errors.nameRu?.message} {...register('nameRu')} />
      </Group>

      <Textarea
        label="Description"
        minRows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      <TextInput label="Image URL" error={errors.imageUrl?.message} {...register('imageUrl')} />

      <Controller
        name="sortOrder"
        control={control}
        render={({ field }) => (
          <NumberInput
            label="Sort order"
            min={0}
            error={errors.sortOrder?.message}
            value={field.value}
            onChange={(value) => field.onChange(Number(value) || 0)}
          />
        )}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <Switch
            label="Active (visible in store)"
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
    </Stack>
  );
}
