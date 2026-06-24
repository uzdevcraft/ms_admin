import { Select, Stack } from '@mantine/core';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { ORDER_STATUS_OPTIONS, type UpdateStatusFormValues } from './schema';

interface UpdateStatusFormFieldsProps {
  control: Control<UpdateStatusFormValues>;
  errors: FieldErrors<UpdateStatusFormValues>;
}

export function UpdateStatusFormFields({ control, errors }: UpdateStatusFormFieldsProps) {
  return (
    <Stack gap="sm">
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            label="Status"
            data={ORDER_STATUS_OPTIONS}
            error={errors.status?.message}
            value={field.value}
            onChange={(value) => field.onChange(value)}
          />
        )}
      />
    </Stack>
  );
}
