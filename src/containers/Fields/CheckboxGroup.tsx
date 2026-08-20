import { Checkbox as MantineCheckbox, type CheckboxGroupProps } from '@mantine/core';
import {
  useController,
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions
} from 'react-hook-form';

type FixedCheckboxGroupProps = Omit<CheckboxGroupProps, 'value' | 'onChange' | 'error' | 'name' | 'defaultValue'> & {
  defaultValue?: string[] | null;
};

interface IProps<T extends FieldValues> extends FixedCheckboxGroupProps {
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function CheckboxGroup<T extends FieldValues>({
  name,
  rules,
  defaultValue = [],
  children,
  ...rest
}: IProps<T>) {
  const { control } = useFormContext<T>();

  const {
    field: { value, onChange, ...field },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules,
    defaultValue: defaultValue as never
  });

  return (
    <MantineCheckbox.Group
      {...rest}
      {...field}
      value={(value ?? []) as string[]}
      onChange={onChange}
      error={error?.message}
    >
      {children}
    </MantineCheckbox.Group>
  );
}

export default CheckboxGroup;
