import type * as Types from './types';

/**
 * Helpers for the category hierarchy (Bo'lim › Kategoriya › Subkategoriya).
 * The hierarchy comes from `parentId`; with a flat API every category is a
 * root, so the pickers simply show one level.
 */

export interface CategoryIndex {
  byId: Map<number, Types.IEntity.Category>;
  childrenOf: (parentId: number | null) => Types.IEntity.Category[];
}

const byOrder = (a: Types.IEntity.Category, b: Types.IEntity.Category) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);

export const buildIndex = (categories: Types.IEntity.Category[]): CategoryIndex => {
  const byId = new Map(categories.map(category => [category.id, category] as const));
  const children = new Map<number | null, Types.IEntity.Category[]>();

  categories.forEach(category => {
    // A parent that isn't in the list is treated as missing → category becomes a root.
    const parentId = category.parentId && byId.has(category.parentId) ? category.parentId : null;
    const list = children.get(parentId) ?? [];
    list.push(category);
    children.set(parentId, list);
  });

  children.forEach(list => list.sort(byOrder));

  return { byId, childrenOf: parentId => children.get(parentId) ?? [] };
};

/** Categories from the root down to (and including) `id`. */
export const pathTo = (index: CategoryIndex, id: number): Types.IEntity.Category[] => {
  const path: Types.IEntity.Category[] = [];
  const seen = new Set<number>();
  let current = index.byId.get(id);

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.unshift(current);
    current = current.parentId ? index.byId.get(current.parentId) : undefined;
  }

  return path;
};

export const pathLabel = (path: Types.IEntity.Category[], separator = ' › ') =>
  path.map(category => category.name).join(separator);

export const isLeaf = (index: CategoryIndex, id: number) => index.childrenOf(id).length === 0;

/** Deepest level used by the data (1 for a flat list). */
export const depth = (index: CategoryIndex): number => {
  const walk = (parentId: number | null): number => {
    const children = index.childrenOf(parentId);
    return children.length ? 1 + Math.max(...children.map(child => walk(child.id))) : 0;
  };
  return Math.max(1, walk(null));
};

export interface CategorySearchResult {
  category: Types.IEntity.Category;
  path: Types.IEntity.Category[];
  label: string;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase();

/**
 * Finds categories whose name (UZ/RU/main) matches the query. Leaf categories
 * and name-prefix matches are ranked first, so typing "ko'ylak" lands on the
 * subcategory you'd actually assign a product to.
 */
export const search = (index: CategoryIndex, query: string, limit = 8): CategorySearchResult[] => {
  const q = normalize(query);
  if (!q) return [];

  const results: (CategorySearchResult & { score: number })[] = [];

  index.byId.forEach(category => {
    const names = [category.name, category.nameUz, category.nameRu].filter(Boolean).map(normalize);
    const matchIndex = Math.min(...names.map(name => (name.includes(q) ? name.indexOf(q) : Infinity)));
    if (matchIndex === Infinity) return;

    const path = pathTo(index, category.id);
    const score = (isLeaf(index, category.id) ? 0 : 10) + (matchIndex === 0 ? 0 : 5) + path.length * 0.1;
    results.push({ category, path, label: pathLabel(path), score });
  });

  return results
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map(({ category, path, label }) => ({ category, path, label }));
};
