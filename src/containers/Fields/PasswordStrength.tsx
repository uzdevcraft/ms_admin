import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

import { PasswordStrength as PasswordStrengthInput } from '@/components/PasswordStrength';

type IProps<T extends FieldValues> = UseControllerProps<T>;

export function PasswordStrength<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
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
    <PasswordStrengthInput
      {...rest}
      {...field}
      value={field.value ?? ''}
      onChange={field.onChange}
      error={error?.message}
    />
  );
}

export default PasswordStrength;
