import assert from 'node:assert/strict';
import test from 'node:test';

import * as Calculations from './calculations.ts';

test('profit: commission, payout and profits', () => {
  assert.deepEqual(
    Calculations.profit({
      price: 150000,
      discountEnabled: false,
      discountPrice: 0,
      purchasePrice: 90000,
      commissionPercent: 12
    }),
    { salePrice: 150000, commission: 18000, payout: 132000, onlineProfit: 42000 }
  );
});

test('profit: discount price is used only when enabled and lower than the price', () => {
  const base = { price: 100000, discountPrice: 80000, purchasePrice: 0, commissionPercent: 10 };

  assert.equal(Calculations.profit({ ...base, discountEnabled: true }).salePrice, 80000);
  assert.equal(Calculations.profit({ ...base, discountEnabled: false }).salePrice, 100000);
  assert.equal(Calculations.profit({ ...base, discountEnabled: true, discountPrice: 120000 }).salePrice, 100000);
  assert.equal(Calculations.profit({ ...base, price: 0, discountEnabled: false }).onlineProfit, 0);
});

test('generates the cartesian product and keeps edited rows', () => {
  const axes = [
    {
      attributeDefinitionId: 1,
      name: "O'lcham",
      options: [
        { id: 10, label: 'S' },
        { id: 11, label: 'M' },
        { id: 12, label: 'L' }
      ]
    },
    {
      attributeDefinitionId: 2,
      name: 'Rang',
      options: [
        { id: 20, label: 'Qizil' },
        { id: 21, label: "Ko'k" }
      ]
    }
  ];

  const first = Calculations.generateVariants(axes, { 1: [10, 11], 2: [20, 21] }, [], {
    name: "Ko'ylak",
    stockQuantity: 10
  });

  assert.equal(first.length, 4);
  assert.deepEqual(first[0], {
    key: '1:10|2:20',
    variantId: undefined,
    selectedOptions: { 1: 10, 2: 20 },
    label: 'S / Qizil',
    sku: '',
    price: null,
    stockQuantity: 10
  });

  const edited = first.map(row => (row.key === '1:10|2:20' ? { ...row, sku: 'CUSTOM', stockQuantity: 3 } : row));
  const second = Calculations.generateVariants(axes, { 1: [10], 2: [20] }, edited, { name: 'X', stockQuantity: 1 });

  assert.equal(second.length, 1);
  assert.equal(second[0].sku, 'CUSTOM');
  assert.equal(second[0].stockQuantity, 3);
});

test('no selected options → no variants; unselected axes are skipped', () => {
  const axes = [
    { attributeDefinitionId: 1, name: 'Size', options: [{ id: 10, label: 'S' }] },
    { attributeDefinitionId: 2, name: 'Colour', options: [{ id: 20, label: 'Red' }] }
  ];

  assert.deepEqual(Calculations.generateVariants(axes, {}, [], { name: 'A', stockQuantity: 0 }), []);
  assert.equal(Calculations.generateVariants(axes, { 1: [10] }, [], { name: 'A', stockQuantity: 0 })[0].label, 'S');
});
