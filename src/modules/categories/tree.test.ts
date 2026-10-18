import assert from 'node:assert/strict';
import test from 'node:test';

import * as Tree from './tree.ts';
import type * as Types from './types.ts';

const category = (patch: Partial<Types.IEntity.Category>): Types.IEntity.Category => ({
  id: 1,
  parentId: null,
  commissionPercent: null,
  commissionTier: '',
  name: '',
  nameUz: '',
  nameRu: '',
  description: '',
  imageUrl: '',
  isActive: true,
  sortOrder: 0,
  createdAt: '',
  ...patch
});

const categories = [
  category({ id: 1, name: 'Kiyim, poyabzal va aksessuarlar' }),
  category({ id: 2, parentId: 1, name: 'Kiyim' }),
  category({ id: 3, parentId: 2, name: "Ko'ylak-liboslar", nameRu: 'Платья' }),
  category({ id: 4, parentId: 2, name: 'Shimlar' }),
  category({ id: 5, name: 'Elektronika' }),
  category({ id: 6, parentId: 99, name: 'Orphan' })
];

test('builds the tree; unknown parents become roots', () => {
  const index = Tree.buildIndex(categories);

  assert.deepEqual(
    index.childrenOf(null).map(item => item.id),
    [5, 1, 6].sort((a, b) => index.byId.get(a)!.name.localeCompare(index.byId.get(b)!.name))
  );
  assert.deepEqual(
    index.childrenOf(2).map(item => item.id),
    [3, 4]
  );
  assert.equal(Tree.depth(index), 3);
  assert.equal(Tree.depth(Tree.buildIndex([category({ id: 1 })])), 1);
});

test('path and label from root to category', () => {
  const index = Tree.buildIndex(categories);

  assert.deepEqual(
    Tree.pathTo(index, 3).map(item => item.id),
    [1, 2, 3]
  );
  assert.equal(Tree.pathLabel(Tree.pathTo(index, 3)), "Kiyim, poyabzal va aksessuarlar › Kiyim › Ko'ylak-liboslar");
  assert.equal(Tree.isLeaf(index, 3), true);
  assert.equal(Tree.isLeaf(index, 2), false);
});

test('search ranks leaf categories first and matches RU names', () => {
  const index = Tree.buildIndex(categories);

  // "lar" hits the root and two leaves → leaves come first.
  assert.deepEqual(
    Tree.search(index, 'lar').map(result => result.category.id),
    [3, 4, 1]
  );
  assert.equal(Tree.search(index, 'плат')[0].category.id, 3);
  assert.equal(Tree.search(index, "ko'ylak")[0].label, "Kiyim, poyabzal va aksessuarlar › Kiyim › Ko'ylak-liboslar");
  assert.deepEqual(Tree.search(index, ''), []);
});
