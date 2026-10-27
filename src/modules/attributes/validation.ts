import type * as Types from './types';

const HEX = /^#[0-9A-Fa-f]{6}$/;

export function validateAttribute(v: Partial<Types.IForm.AttributeDefinition>) {
  const errors: Partial<Record<keyof Types.IForm.AttributeDefinition, string>> = {};

  if (!v.code?.trim()) errors.code = 'Kod majburiy';
  else if (!/^[A-Z0-9_]+$/.test(v.code)) errors.code = 'Faqat KATTA harf, raqam va _';

  if (!v.nameUz?.trim()) errors.nameUz = 'Nomi (uz) majburiy';
  if (!v.attributeType) errors.attributeType = 'Turini tanlang';
  if (!v.displayType) errors.displayType = "Ko'rinishni tanlang";
  // Backend rule: a variant attribute must be SELECT (one option per variant).
  if (v.variant && v.attributeType && v.attributeType !== 'SELECT') {
    errors.attributeType = "Variant atribut faqat SELECT turida bo'ladi";
  }

  return errors;
}

export function validateOption(v: Partial<Types.IForm.AttributeOption>, display: Types.IEntity.AttributeDisplayType) {
  const errors: Record<string, string> = {};

  if (!v.valueUz?.trim()) errors.valueUz = 'Qiymat (uz) majburiy';
  if (display === 'SWATCH' && !HEX.test(v.colorHex ?? '')) {
    errors.colorHex = "Rang kodi #RRGGBB ko'rinishida bo'lsin";
  }

  return errors;
}
