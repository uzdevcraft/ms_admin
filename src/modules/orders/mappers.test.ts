import assert from 'node:assert/strict';
import test from 'node:test';

import { CreateRequest, Order } from './mappers.ts';

test('maps variant details returned for an order item', () => {
  const order = Order({
    id: 1,
    items: [
      {
        id: 2,
        productId: 3,
        quantity: 1,
        productVariantId: 4,
        variantLabel: 'Rang: Qizil'
      }
    ]
  });

  assert.equal(order.items[0].productVariantId, 4);
  assert.equal(order.items[0].variantLabel, 'Rang: Qizil');
});

test('keeps productVariantId in the create-order request', () => {
  assert.deepEqual(
    CreateRequest({
      items: [{ productId: 3, productVariantId: 4, quantity: 2 }],
      deliveryAddress: 'Toshkent',
      comment: ''
    }),
    {
      items: [{ productId: 3, productVariantId: 4, quantity: 2 }],
      deliveryAddress: 'Toshkent',
      comment: ''
    }
  );
});
