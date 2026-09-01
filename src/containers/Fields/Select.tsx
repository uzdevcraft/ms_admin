import { Select, type SelectProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<SelectProps, 'name' | 'value' | 'onChange' | 'error'> & {
    // Mantine works with string values only; `numeric` keeps the form value a number.
    numeric?: boolean;
  };

export function SelectField<T extends FieldValues>({
  control,
  name,
  rules,
  defaultValue,
  numeric,
  ...rest
}: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    rules,
    control,
    defaultValue
  });

  if (numeric) {
    return (
      <Select
        {...rest}
        {...field}
        error={error?.message}
        value={field.value ? String(field.value) : null}
        onChange={value => field.onChange(Number(value) || 0)}
      />
    );
  }

  return <Select {...rest} {...field} error={error?.message} />;
}

export default SelectField;
