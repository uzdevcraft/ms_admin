import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';
import { DateTimePicker as MantineTimePicker, type DateTimePickerProps } from '@mantine/dates';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<DateTimePickerProps, 'name' | 'value' | 'onChange' | 'error'>;

export function DateTimePicker<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    rules,
    control,
    defaultValue
  });

  return (
    <MantineTimePicker
      {...rest}
      {...field}
      error={error?.message}
      valueFormat="DD MMM YYYY hh:mm A"
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default DateTimePicker;
