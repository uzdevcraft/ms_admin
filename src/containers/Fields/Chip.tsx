import { Chip as MantineChip, type ChipProps } from '@mantine/core';
import { useController, type FieldValues, type UseControllerProps } from 'react-hook-form';

type IProps<T extends FieldValues> = UseControllerProps<T> &
  Omit<ChipProps, 'name' | 'value' | 'onChange' | 'error'> & {
    value: number;
  };

export function Chip<T extends FieldValues>({ control, name, rules, defaultValue, value, ...rest }: IProps<T>) {
  const { field } = useController<T>({
    name,
    control,
    rules,
    defaultValue
  });

  const selectedValues: number[] = Array.isArray(field.value) ? field.value : [];

  const handleChange = (checked: boolean) => {
    const newValue = checked ? [...selectedValues, value] : selectedValues.filter(v => v !== value);

    field.onChange(newValue);
  };

  return (
    <MantineChip {...rest} checked={selectedValues.includes(value)} onChange={handleChange} value={String(value)} />
  );
}

export default Chip;
