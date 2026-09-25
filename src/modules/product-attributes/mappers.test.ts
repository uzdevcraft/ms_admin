import assert from 'node:assert/strict';
import test from 'node:test';

import * as Mappers from './mappers.ts';
import * as Validation from './validation.ts';

test('maps Swagger product attributes response including groups and variants', () => {
  const mapProductAttributes = Reflect.get(Mappers, 'ProductAttributes') as (source: unknown) => unknown;

  assert.deepEqual(
    mapProductAttributes({
      variantGroups: [
        {
          attributeDefinitionId: 7,
          code: 'color',
          nameUz: 'Rang',
          displayType: 'SWATCH',
          options: [{ id: 11, valueUz: 'Qizil', valueRu: 'Красный', metaJson: { hex: '#f00' } }]
        }
      ],
      specGroups: [],
      variants: [
        {
          variantId: 42,
          sku: 'RED-42',
          effectivePrice: 125000,
          stockQuantity: 3,
          active: true,
          selectedOptions: { 7: 11 }
        }
      ]
    }),
    {
      variantGroups: [
        {
          attributeDefinitionId: 7,
          code: 'color',
          nameUz: 'Rang',
          displayType: 'SWATCH',
          options: [{ id: 11, valueUz: 'Qizil', valueRu: 'Красный', metaJson: { hex: '#f00' } }]
        }
      ],
      specGroups: [],
      variants: [
        {
          variantId: 42,
          sku: 'RED-42',
          effectivePrice: 125000,
          stockQuantity: 3,
          active: true,
          selectedOptions: { 7: 11 }
        }
      ]
    }
  );
});

test('creates the save-variants request envelope', () => {
  const createSaveRequest = Reflect.get(Mappers, 'SaveVariantsRequest') as (source: unknown) => unknown;

  assert.deepEqual(
    createSaveRequest([
      {
        variantId: 42,
        selectedOptions: { 7: 11 },
        sku: 'RED-42',
        priceOverride: 120000,
        stockQuantity: 5
      }
    ]),
    {
      variants: [
        {
          variantId: 42,
          selectedOptions: { 7: 11 },
          sku: 'RED-42',
          priceOverride: 120000,
          stockQuantity: 5
        }
      ]
    }
  );
});

test('rejects multiple variants when the product has no variant groups', () => {
  const validateVariants = Reflect.get(Validation, 'validateVariants') as (groups: unknown[], variants: unknown[]) => string | null;

  assert.equal(
    validateVariants([], [
      { selectedOptions: {}, sku: 'qora', stockQuantity: 4 },
      { selectedOptions: {}, sku: 'oq', stockQuantity: 4 }
    ]),
    "Variant xususiyatlari sozlanmagan mahsulot uchun faqat bitta variant saqlash mumkin"
  );
});

test('rejects duplicate selected option combinations', () => {
  const validateVariants = Reflect.get(Validation, 'validateVariants') as (groups: unknown[], variants: unknown[]) => string | null;
  const groups = [{ attributeDefinitionId: 7 }];

  assert.equal(
    validateVariants(groups, [
      { selectedOptions: { 7: 11 }, sku: 'qora-1', stockQuantity: 4 },
      { selectedOptions: { 7: 11 }, sku: 'qora-2', stockQuantity: 4 }
    ]),
    '2-variant kombinatsiyasi takrorlangan'
  );
});
