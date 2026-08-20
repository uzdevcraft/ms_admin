import { PinInput } from '@/components/PinInput';
import { type PinInputProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<PinInputProps, 'name' | 'value' | 'onChange' | 'error'>;

export function Pin<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue
  });

  return (
    <PinInput
      {...rest}
      {...field}
      error={Boolean(error?.message)}
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default Pin;
