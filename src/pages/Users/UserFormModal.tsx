import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userSchema, type UserFormValues } from '../../schemas';
import type { User } from '../../types';

interface UserFormModalProps {
  opened: boolean;
  onClose: () => void;
  user?: User | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function UserFormModal({
  opened,
  onClose,
  user,
  onSubmit,
  isLoading,
}: UserFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
    },
  });

  useEffect(() => {
    if (opened) {
      reset(
        user
          ? {
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
              country: user.country,
              city: user.city,
            }
          : { fullName: '', email: '', phone: '', country: '', city: '' },
      );
    }
  }, [opened, user, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={user ? 'Edit Customer' : 'Add Customer'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Full name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <TextInput label="Email" error={errors.email?.message} {...register('email')} />
          <TextInput label="Phone" error={errors.phone?.message} {...register('phone')} />
          <TextInput label="Country" error={errors.country?.message} {...register('country')} />
          <TextInput label="City" error={errors.city?.message} {...register('city')} />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} color="violet">
              {user ? 'Save changes' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
