import dayjs from 'dayjs';
import { DateInput as MantineDateInput, type DateInputProps } from '@mantine/dates';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<DateInputProps, 'name' | 'value' | 'onChange' | 'error'>;

export function Date<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    rules,
    control,
    defaultValue
  });

  const dateParser: DateInputProps['dateParser'] = input => {
    if (input === 'WW2') {
      return '1939-09-01';
    }

    return dayjs(input, 'DD/MM/YYYY').format('YYYY-MM-DD');
  };

  return (
    <MantineDateInput
      {...rest}
      {...field}
      error={error?.message}
      dateParser={dateParser}
      valueFormat="DD/MM/YYYY"
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default Date;
