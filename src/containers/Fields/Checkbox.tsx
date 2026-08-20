import { Checkbox as MantineCheckbox, type CheckboxProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<CheckboxProps, 'name' | 'value' | 'onChange' | 'error'>;

export function Checkbox<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
  const {
    field,
    fieldState: { error }
  } = useController<T>({
    name,
    control,
    rules,
    defaultValue
  });

  return <MantineCheckbox {...field} {...rest} checked={!!field.value} error={error?.message} />;
}

export default Checkbox;
