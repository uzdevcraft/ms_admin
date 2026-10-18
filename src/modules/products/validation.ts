import type { FieldPath } from 'react-hook-form';

import type * as Attributes from '@/modules/attributes/types';
import { validation } from '@/locale/uz';

import { specKey } from './constants';
import type * as Types from './types';

export interface ExtraError {
  name: FieldPath<Types.IForm.Create>;
  message: string;
}

const isEmpty = (spec?: Types.IForm.SpecValue) => !spec || (!spec.optionIds?.length && !spec.value?.trim());

/**
 * Checks that depend on server data and so can't live in the static yup
 * schema: required category attributes and generated variants.
 */
export const validateExtras = (
  values: Types.IForm.Create,
  attributes?: Attributes.IQuery.CategoryAttributes
): ExtraError[] => {
  if (!attributes) return [];

  const errors: ExtraError[] = attributes.specs
    .filter(attribute => attribute.required && isEmpty(values.specs[specKey(attribute.id)]))
    .map(attribute => ({
      name: `specs.${specKey(attribute.id)}`,
      message: validation.attributeRequired(attribute.nameUz)
    }));

  const requiredAxes = attributes.variants.filter(attribute => attribute.required);
  const missingAxes = requiredAxes.filter(attribute => !values.variantOptions[specKey(attribute.id)]?.length);

  if (missingAxes.length) {
    errors.push({
      name: 'variants',
      message: validation.chooseVariantOptions(missingAxes.map(attribute => attribute.nameUz).join(', '))
    });
  } else {
    const hasChosenOptions = Object.values(values.variantOptions).some(ids => ids?.length);
    if (hasChosenOptions && !values.variants.length) {
      errors.push({ name: 'variants', message: validation.generateVariants });
    }
  }

  return errors;
};
