import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import formatPrice from '@common/utils/formatPrice';
import getApiError from '@common/utils/getApiError';
import type * as Types from '../types';
import useUpdateStatus from '../hooks/useUpdateStatus';
import { UpdateStatusFormFields } from './UpdateStatusFormFields';
import {
  updateStatusDefaultValues,
  updateStatusSchema,
  type UpdateStatusFormValues,
} from './schema';

interface UpdateStatusProps {
  opened: boolean;
  onClose: () => void;
  order: Types.IEntity.Order | null;
}

export function UpdateStatus({ opened, onClose, order }: UpdateStatusProps) {
  const updateStatus = useUpdateStatus();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateStatusFormValues>({
    resolver: yupResolver(updateStatusSchema),
    defaultValues: updateStatusDefaultValues,
  });

  useEffect(() => {
    if (opened && order) {
      reset({ status: order.status });
    }
  }, [opened, order, reset]);

  const handleClose = () => {
    reset(updateStatusDefaultValues);
    onClose();
  };

  const onSubmit = async (values: UpdateStatusFormValues) => {
    if (!order) return;

    try {
      await updateStatus.mutateAsync({ id: order.id, status: values.status });
      notifications.show({ message: 'Order status updated', color: 'green' });
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
    <Modal opened={opened} onClose={handleClose} title="Update Order Status" size="md">
      {order && (
        <Stack gap="sm" mb="md">
          <Text size="sm">
            Order <strong>#{order.id}</strong> — {order.userFullName}
          </Text>
          <Text size="sm" c="dimmed">
            Total: {formatPrice(order.totalAmount)}
          </Text>
        </Stack>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <UpdateStatusFormFields control={control} errors={errors} />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={updateStatus.isPending} color="violet">
            Save changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
