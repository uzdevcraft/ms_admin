import assert from 'node:assert/strict';
import test from 'node:test';

import * as Validation from './validation.ts';
import * as Mappers from './mappers.ts';

test('maps attribute definitions and options from the API payload', () => {
  const mapDefinition = Reflect.get(Mappers, 'AttributeDefinition') as (source: unknown) => unknown;

  assert.deepEqual(
    mapDefinition({
      id: 7,
      code: 'RANG',
      nameUz: 'Rang',
      nameRu: 'Цвет',
      attributeType: 'SELECT',
      displayType: 'SWATCH',
      variant: true,
      filterable: true
    }),
    {
      id: 7,
      code: 'RANG',
      nameUz: 'Rang',
      nameRu: 'Цвет',
      attributeType: 'SELECT',
      displayType: 'SWATCH',
      variant: true,
      filterable: true
    }
  );
});

test('validates required attribute data and swatch color value', () => {
  assert.deepEqual(Validation.validateAttribute({ code: 'rang', nameUz: 'Rang', attributeType: 'SELECT' }), {
    code: 'Faqat KATTA harf, raqam va _',
    displayType: "Ko'rinishni tanlang"
  });

  assert.deepEqual(Validation.validateOption({ valueUz: 'Qizil' }, 'SWATCH'), {
    colorHex: "Rang kodi #RRGGBB ko'rinishida bo'lsin"
  });

  assert.deepEqual(Validation.validateOption({ valueUz: 'Qizil', colorHex: '#FF0000' }, 'SWATCH'), {});
});
