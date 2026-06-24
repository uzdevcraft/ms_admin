import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { orderSchema, type OrderFormValues } from '../../schemas';
import { useUsers } from '../../hooks/useUsers';
import type { Order, OrderStatus } from '../../types';

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface OrderFormModalProps {
  opened: boolean;
  onClose: () => void;
  order?: Order | null;
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function OrderFormModal({
  opened,
  onClose,
  order,
  onSubmit,
  isLoading,
}: OrderFormModalProps) {
  const { data: users } = useUsers();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      orderNumber: '',
      userId: '',
      userName: '',
      totalAmount: 0,
      currency: 'USD',
      status: 'pending',
      shippingCountry: '',
      shippingCity: '',
      shippingAddress: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (opened) {
      reset(
        order
          ? {
              orderNumber: order.orderNumber,
              userId: order.userId,
              userName: order.userName,
              totalAmount: order.totalAmount,
              currency: order.currency,
              status: order.status,
              shippingCountry: order.shippingCountry,
              shippingCity: order.shippingCity,
              shippingAddress: order.shippingAddress,
              notes: order.notes,
            }
          : {
              orderNumber: `MS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
              userId: '',
              userName: '',
              totalAmount: 0,
              currency: 'USD',
              status: 'pending',
              shippingCountry: '',
              shippingCity: '',
              shippingAddress: '',
              notes: '',
            },
      );
    }
  }, [opened, order, reset]);

  const userOptions = users?.map((u) => ({ value: u.id, label: u.fullName })) ?? [];

  const handleUserChange = (userId: string | null) => {
    const user = users?.find((u) => u.id === userId);
    setValue('userId', userId ?? '');
    if (user) {
      setValue('userName', user.fullName);
      setValue('shippingCountry', user.country);
      setValue('shippingCity', user.city);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={order ? 'Edit Order' : 'Create Order'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <Group grow>
            <TextInput
              label="Order number"
              error={errors.orderNumber?.message}
              {...register('orderNumber')}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Status"
                  data={STATUS_OPTIONS}
                  error={errors.status?.message}
                  value={field.value}
                  onChange={(v) => field.onChange(v as OrderStatus)}
                />
              )}
            />
          </Group>

          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Select
                label="Customer"
                data={userOptions}
                searchable
                disabled={!!order}
                error={errors.userId?.message}
                value={field.value}
                onChange={(v) => handleUserChange(v)}
              />
            )}
          />

          <Group grow>
            <Controller
              name="totalAmount"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Total amount"
                  decimalScale={2}
                  min={0}
                  error={errors.totalAmount?.message}
                  value={field.value}
                  onChange={(v) => field.onChange(Number(v) || 0)}
                />
              )}
            />
            <TextInput
              label="Currency"
              error={errors.currency?.message}
              {...register('currency')}
            />
          </Group>

          <Group grow>
            <TextInput
              label="Shipping country"
              error={errors.shippingCountry?.message}
              {...register('shippingCountry')}
            />
            <TextInput
              label="Shipping city"
              error={errors.shippingCity?.message}
              {...register('shippingCity')}
            />
          </Group>

          <TextInput
            label="Shipping address"
            error={errors.shippingAddress?.message}
            {...register('shippingAddress')}
          />

          <input type="hidden" {...register('userName')} />

          <Textarea label="Notes" minRows={2} {...register('notes')} />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} color="violet">
              {order ? 'Save changes' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
