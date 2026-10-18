import { Autocomplete, Input, MultiSelect, NumberInput, Select, Switch } from '@mantine/core';
import { useController } from 'react-hook-form';

import { productEditor } from '@/locale/uz';
import type * as Attributes from '@/modules/attributes/types';
import { Constants } from '@modules/products';
import type { CreateFormValues } from '@modules/products/forms';
import type * as Types from '@modules/products/types';

import OptionChips from './OptionChips';
import classes from './Form.module.css';

type IProps = {
  attribute: Attributes.IEntity.CategoryAttribute;
};

const EMPTY: Types.IForm.SpecValue = { optionIds: [], value: '' };

/** One category attribute, rendered according to its type and display type. */
const AttributeField = ({ attribute }: IProps) => {
  const {
    field,
    fieldState: { error }
  } = useController<CreateFormValues, `specs.${string}`>({
    name: `specs.${Constants.specKey(attribute.id)}`
  });

  const { value: rawValue, onChange, onBlur } = field;
  const spec = (rawValue as Types.IForm.SpecValue | undefined) ?? EMPTY;
  const set = (patch: Partial<Types.IForm.SpecValue>) => onChange({ ...spec, ...patch });

  const common = {
    label: attribute.nameUz,
    withAsterisk: attribute.required,
    error: error?.message
  };

  const options = attribute.options.map(option => ({ value: String(option.id), label: option.valueUz }));

  switch (attribute.attributeType) {
    case 'TEXT':
      // Known values from the backend become autocomplete suggestions.
      return (
        <Autocomplete
          {...common}
          value={spec.value}
          onChange={value => set({ value })}
          onBlur={onBlur}
          data={[...new Set(attribute.options.map(option => option.valueUz))]}
          placeholder={productEditor.textPlaceholder(attribute.options[0]?.valueUz ?? attribute.nameUz)}
        />
      );

    case 'NUMBER':
      return (
        <NumberInput
          {...common}
          value={spec.value === '' ? '' : Number(spec.value)}
          onChange={value => set({ value: value === '' ? '' : String(value) })}
          onBlur={onBlur}
          hideControls
        />
      );

    case 'BOOLEAN':
      return (
        <Input.Wrapper {...common}>
          <Switch
            className={classes.fieldBody}
            checked={spec.value === 'true'}
            onChange={event => set({ value: event.currentTarget.checked ? 'true' : 'false' })}
            label={spec.value === 'true' ? productEditor.yes : productEditor.no}
          />
        </Input.Wrapper>
      );

    case 'MULTISELECT':
      if (attribute.displayType === 'DROPDOWN') {
        return (
          <MultiSelect
            {...common}
            data={options}
            value={spec.optionIds.map(String)}
            onChange={values => set({ optionIds: values.map(Number) })}
            placeholder={spec.optionIds.length ? undefined : productEditor.choose}
            searchable
            clearable
          />
        );
      }
      return (
        <Input.Wrapper {...common}>
          <div className={classes.fieldBody}>
            <OptionChips
              multiple
              swatch={attribute.displayType === 'SWATCH'}
              options={attribute.options}
              value={spec.optionIds}
              onChange={optionIds => set({ optionIds })}
              error={Boolean(error)}
              aria-label={attribute.nameUz}
            />
          </div>
        </Input.Wrapper>
      );

    case 'SELECT':
    default:
      if (attribute.displayType === 'DROPDOWN') {
        return (
          <Select
            {...common}
            data={options}
            value={spec.optionIds[0] ? String(spec.optionIds[0]) : null}
            onChange={value => set({ optionIds: value ? [Number(value)] : [] })}
            placeholder={productEditor.choose}
            searchable={options.length > 8}
            clearable
          />
        );
      }
      return (
        <Input.Wrapper {...common}>
          <div className={classes.fieldBody}>
            <OptionChips
              swatch={attribute.displayType === 'SWATCH'}
              options={attribute.options}
              value={spec.optionIds}
              onChange={optionIds => set({ optionIds })}
              error={Boolean(error)}
              aria-label={attribute.nameUz}
            />
          </div>
        </Input.Wrapper>
      );
  }
};

export default AttributeField;
