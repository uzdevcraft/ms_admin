import { Radio as MantineRadio, type RadioGroupProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<RadioGroupProps, 'name' | 'value' | 'onChange' | 'error'>;

export function RadioGroup<T extends FieldValues>({ control, name, rules, children, defaultValue, ...rest }: IProps<T>) {
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
    <MantineRadio.Group {...rest} {...field} error={error?.message}>
      {children}
    </MantineRadio.Group>
  );
}

export default RadioGroup;
