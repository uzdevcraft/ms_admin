import assert from 'node:assert/strict';
import test from 'node:test';

import * as Tree from './tree.ts';
import type * as Types from './types.ts';

const category = (patch: Partial<Types.IEntity.Category>): Types.IEntity.Category => ({
  id: 1,
  parentId: null,
  categoryLevel: 0,
  code: '',
  slug: '',
  attributeTemplateId: null,
  childCount: 0,
  hasChildren: false,
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
  category({ id: 2, parentId: 1, categoryLevel: 1, name: 'Kiyim' }),
  category({ id: 3, parentId: 2, categoryLevel: 2, name: "Ko'ylak-liboslar", nameRu: 'Платья', code: '05.01' }),
  category({ id: 4, parentId: 2, categoryLevel: 2, name: 'Shimlar' }),
  category({ id: 5, name: 'Elektronika' }),
  category({ id: 6, parentId: 99, name: 'Orphan' })
];

test('builds the tree; unknown parents become roots', () => {
  const index = Tree.buildIndex(categories);

  assert.deepEqual(
    index.childrenOf(null).map(item => item.id),
    [1, 5, 6]
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

test('only subcategories are selectable; a flat list allows every category', () => {
  const index = Tree.buildIndex(categories);

  assert.equal(Tree.isSelectable(index, 3), true);
  assert.equal(Tree.isSelectable(index, 2), false);
  assert.equal(Tree.isSelectable(index, 1), false);
  assert.equal(Tree.isSelectable(Tree.buildIndex([category({ id: 9 })]), 9), true);
});

test('descendants and code search', () => {
  const index = Tree.buildIndex(categories);

  assert.deepEqual(Tree.descendantIds(index, 1).sort(), [2, 3, 4]);
  assert.deepEqual(Tree.descendantIds(index, 3), []);
  assert.equal(Tree.search(index, '05.01')[0].category.id, 3);
  assert.deepEqual(
    Tree.search(index, 'i', 10, item => Tree.isSelectable(index, item.id)).map(result => result.category.id).sort(),
    [3, 4]
  );
});

test('template comes from the category or its nearest parent', () => {
  const index = Tree.buildIndex([
    category({ id: 1, attributeTemplateId: 7 }),
    category({ id: 2, parentId: 1, categoryLevel: 1 }),
    category({ id: 3, parentId: 2, categoryLevel: 2, attributeTemplateId: 9 }),
    category({ id: 4, parentId: 2, categoryLevel: 2 }),
    category({ id: 5 })
  ]);

  assert.deepEqual(Tree.templateSource(index, 1), { templateId: 7, sourceId: 1, inherited: false });
  assert.deepEqual(Tree.templateSource(index, 4), { templateId: 7, sourceId: 1, inherited: true });
  assert.deepEqual(Tree.templateSource(index, 3), { templateId: 9, sourceId: 3, inherited: false });
  assert.equal(Tree.templateSource(index, 5), null);
});
