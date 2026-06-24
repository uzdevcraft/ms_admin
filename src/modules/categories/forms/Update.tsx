import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import getApiError from '@common/utils/getApiError';
import type * as Types from '../types';
import useUpdate from '../hooks/useUpdate';
import { CategoryFormFields } from './CategoryFormFields';
import { categoryFormSchema, defaultValues, type CategoryFormValues } from './schema';

interface UpdateProps {
  opened: boolean;
  onClose: () => void;
  category: Types.IEntity.Category | null;
}

const toFormValues = (category: Types.IEntity.Category): CategoryFormValues => ({
  name: category.name,
  nameUz: category.nameUz,
  nameRu: category.nameRu,
  description: category.description,
  imageUrl: category.imageUrl,
  isActive: category.isActive,
  sortOrder: category.sortOrder,
});

export function Update({ opened, onClose, category }: UpdateProps) {
  const update = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (opened && category) {
      reset(toFormValues(category));
    }
  }, [opened, category, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: CategoryFormValues) => {
    if (!category) return;

    try {
      await update.mutateAsync({ id: category.id, values });
      notifications.show({ message: 'Category updated', color: 'green' });
      handleClose();
    } catch (error) {
      const apiError = getApiError(error);
      notifications.show({
        message: apiError.message || 'Something went wrong',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Edit Category" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CategoryFormFields register={register} control={control} errors={errors} />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={update.isPending} color="violet">
            Save changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
