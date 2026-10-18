import { Autocomplete, type AutocompleteProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<AutocompleteProps, 'name' | 'value' | 'onChange' | 'error'>;

/** Free-text input with a suggestions dropdown; the form value is always the typed string. */
export function AutocompleteField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: IProps<T>) {
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
    <Autocomplete
      {...rest}
      {...field}
      error={error?.message}
      value={field.value === undefined || field.value === null ? '' : field.value}
    />
  );
}

export default AutocompleteField;
