import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import getApiError from '@common/utils/getApiError';
import useCreate from '../hooks/useCreate';
import { CategoryFormFields } from './CategoryFormFields';
import { categoryFormSchema, defaultValues, type CategoryFormValues } from './schema';

interface CreateProps {
  opened: boolean;
  onClose: () => void;
}

export function Create({ opened, onClose }: CreateProps) {
  const create = useCreate();

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

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      await create.mutateAsync(values);
      notifications.show({ message: 'Category created', color: 'green' });
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
    <Modal opened={opened} onClose={handleClose} title="Add Category" size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CategoryFormFields register={register} control={control} errors={errors} />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={create.isPending} color="violet">
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
