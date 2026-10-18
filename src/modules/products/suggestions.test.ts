import assert from 'node:assert/strict';
import test from 'node:test';

import * as Suggestions from './suggestions.ts';
import type * as Types from './types.ts';

const product = (patch: Partial<Types.IEntity.Product>): Types.IEntity.Product => ({
  id: 1,
  categoryId: 0,
  categoryName: '',
  name: '',
  nameUz: '',
  nameRu: '',
  description: '',
  descriptionUz: '',
  descriptionRu: '',
  price: 0,
  discountPrice: 0,
  effectivePrice: 0,
  imageUrl: '',
  stockQuantity: 0,
  isActive: true,
  sortOrder: 0,
  createdAt: '',
  imageUrls: [],
  purchasePrice: 0,
  storePrice: null,
  onlineEnabled: true,
  storeEnabled: false,
  status: '',
  ...patch
});

test('finds an exact name match ignoring case/spaces and the edited product', () => {
  const items = [
    product({ id: 1, name: 'iPhone 15 Pro' }),
    product({ id: 2, name: 'Galaxy S24', nameRu: 'Галакси S24' })
  ];

  assert.equal(Suggestions.findExactMatch(items, '  iphone   15 pro ')?.id, 1);
  assert.equal(Suggestions.findExactMatch(items, 'галакси s24')?.id, 2);
  assert.equal(Suggestions.findExactMatch(items, 'iPhone 15 Pro', 1), null);
  assert.equal(Suggestions.findExactMatch(items, ''), null);
});

test('recommends the most common category among matches', () => {
  const items = [
    product({ id: 1, categoryId: 3, categoryName: 'Phones' }),
    product({ id: 2, categoryId: 3, categoryName: 'Phones' }),
    product({ id: 3, categoryId: 5, categoryName: 'Cases' }),
    product({ id: 4, categoryId: 0 })
  ];

  assert.deepEqual(Suggestions.recommendCategory(items), {
    categoryId: 3,
    categoryName: 'Phones',
    count: 2,
    total: 3
  });
  assert.equal(Suggestions.recommendCategory([]), null);
});

test('computes price stats with a median, ignoring empty prices', () => {
  const items = [100000, 0, 300000, 200000, 250000].map((price, id) => product({ id, price }));

  assert.deepEqual(Suggestions.priceStats(items), { min: 100000, max: 300000, median: 225000, count: 4 });
  assert.equal(Suggestions.priceStats([product({ price: 0 })]), null);
});

test('next sort order is max + 1, or 1 for an empty category', () => {
  assert.equal(Suggestions.nextSortOrder([product({ sortOrder: 4 }), product({ sortOrder: 9 })]), 10);
  assert.equal(Suggestions.nextSortOrder([]), 1);
});

test('discount presets are rounded to sensible prices', () => {
  assert.deepEqual(Suggestions.discountPresets(129900, [10]), [{ percent: 10, value: 116900 }]);
  assert.deepEqual(Suggestions.discountPresets(19.99, [10]), [{ percent: 10, value: 17.99 }]);
  assert.deepEqual(Suggestions.discountPresets(0), []);
});

test('copyable fields skip identity and inventory data', () => {
  const copied = Suggestions.copyableFields(
    product({ id: 7, name: 'A', categoryId: 2, description: 'Desc', price: 10, stockQuantity: 5, sortOrder: 3 })
  );

  assert.equal(copied.categoryId, 2);
  assert.equal(copied.descriptionUz, 'Desc');
  assert.equal('stockQuantity' in copied, false);
  assert.equal('name' in copied, false);
});
