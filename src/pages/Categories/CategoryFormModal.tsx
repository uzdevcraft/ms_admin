import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { categorySchema, type CategoryFormValues } from '../../schemas';
import { slugify } from '../../utils/format';
import type { Category } from '../../types';

interface CategoryFormModalProps {
  opened: boolean;
  onClose: () => void;
  category?: Category | null;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryFormModal({
  opened,
  onClose,
  category,
  onSubmit,
  isLoading,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
    defaultValues: { name: '', slug: '', description: '' },
  });

  const name = watch('name');

  useEffect(() => {
    if (!category && name) {
      setValue('slug', slugify(name));
    }
  }, [name, category, setValue]);

  useEffect(() => {
    if (opened) {
      reset(
        category
          ? { name: category.name, slug: category.slug, description: category.description }
          : { name: '', slug: '', description: '' },
      );
    }
  }, [opened, category, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput label="Name" error={errors.name?.message} {...register('name')} />
          <TextInput label="Slug" error={errors.slug?.message} {...register('slug')} />
          <Textarea
            label="Description"
            minRows={3}
            error={errors.description?.message}
            {...register('description')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} color="violet">
              {category ? 'Save changes' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
