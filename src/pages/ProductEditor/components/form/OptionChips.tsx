import { UnstyledButton } from '@mantine/core';
import cx from 'clsx';

import type * as Attributes from '@/modules/attributes/types';

import classes from './Form.module.css';

type IProps = {
  options: Attributes.IEntity.AttributeOption[];
  value: number[];
  onChange: (value: number[]) => void;
  multiple?: boolean;
  /** Show the option's colour (SWATCH attributes). */
  swatch?: boolean;
  error?: boolean;
  'aria-label'?: string;
};

/** Pill-shaped option picker used for sizes, colours, materials, ... */
const OptionChips = ({ options, value, onChange, multiple = false, swatch = false, error, ...rest }: IProps) => {
  const toggle = (id: number) => {
    const selected = value.includes(id);
    if (multiple) onChange(selected ? value.filter(item => item !== id) : [...value, id]);
    else onChange(selected ? [] : [id]);
  };

  return (
    <div className={classes.chips} role="group" aria-label={rest['aria-label']}>
      {options.map(option => {
        const selected = value.includes(option.id);
        const color = option.metaJson?.colorHex;

        return (
          <UnstyledButton
            key={option.id}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={selected}
            className={cx(classes.chip, {
              [classes.chipSelected]: selected,
              [classes.chipSquare]: !swatch && option.valueUz.length <= 3,
              [classes.chipError]: error && !selected
            })}
            onClick={() => toggle(option.id)}
          >
            {swatch && color ? <span className={classes.swatch} style={{ background: color }} /> : null}
            {option.valueUz}
          </UnstyledButton>
        );
      })}
    </div>
  );
};

export default OptionChips;
