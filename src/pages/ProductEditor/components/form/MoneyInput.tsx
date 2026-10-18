import { NumberInput, Text, type NumberInputProps } from '@mantine/core';
import { useController, type FieldPath } from 'react-hook-form';

import { productEditor } from '@/locale/uz';
import type { CreateFormValues } from '@modules/products/forms';

type IProps = Omit<NumberInputProps, 'name' | 'value' | 'onChange' | 'error'> & {
  name: FieldPath<CreateFormValues>;
  /** Unit shown on the right; defaults to "so'm". */
  unit?: string;
  /** Empty input stores `null` instead of `undefined` (optional prices). */
  nullable?: boolean;
  /** Show 0 as "0" (stock) instead of the placeholder (prices). */
  keepZero?: boolean;
};

/** Number field with a thousands separator and a unit, e.g. "150 000 | so'm". */
const MoneyInput = ({ name, unit = productEditor.currency, nullable, keepZero, ...rest }: IProps) => {
  const {
    field,
    fieldState: { error }
  } = useController<CreateFormValues>({ name });

  const value = typeof field.value === 'number' && (field.value !== 0 || keepZero) ? field.value : '';

  return (
    <NumberInput
      {...rest}
      {...field}
      value={value}
      onChange={next => field.onChange(next === '' ? (nullable ? null : 0) : Number(next))}
      error={error?.message}
      thousandSeparator=" "
      hideControls
      min={0}
      allowNegative={false}
      rightSectionWidth={unit.length * 9 + 28}
      rightSection={
        <Text size="sm" c="dimmed" pr="sm">
          {unit}
        </Text>
      }
    />
  );
};

export default MoneyInput;
