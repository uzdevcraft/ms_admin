import type * as Types from './types';

/**
 * Helpers for the category hierarchy: Departament (level 0) › Kategoriya
 * (level 1) › Subkategoriya (level 2). The hierarchy comes from `parentId`;
 * with the older flat API every category is a root and pickers show one level.
 */

/** Products can only be attached to this level. */
export const PRODUCT_LEVEL = 2;

export interface CategoryIndex {
  byId: Map<number, Types.IEntity.Category>;
  childrenOf: (parentId: number | null) => Types.IEntity.Category[];
  /** Number of levels present in the data (1 for a flat list). */
  levels: number;
}

// Stable sort: equal sortOrder keeps the API order (backend sorts by sortOrder, then id).
const byOrder = (a: Types.IEntity.Category, b: Types.IEntity.Category) => a.sortOrder - b.sortOrder;

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

  const childrenOf = (parentId: number | null) => children.get(parentId) ?? [];
  const walk = (parentId: number | null, seen: Set<number>): number => {
    const list = childrenOf(parentId).filter(child => !seen.has(child.id));
    list.forEach(child => seen.add(child.id));
    return list.length ? 1 + Math.max(...list.map(child => walk(child.id, seen))) : 0;
  };

  return { byId, childrenOf, levels: Math.max(1, walk(null, new Set())) };
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
export const depth = (index: CategoryIndex): number => index.levels;

/**
 * Whether a product can be attached to the category: only subcategories
 * (level 2). With the older flat API (one level) every category qualifies.
 */
export const isSelectable = (index: CategoryIndex, id: number) => {
  const category = index.byId.get(id);
  if (!category) return false;
  return index.levels === 1 ? true : category.categoryLevel === PRODUCT_LEVEL;
};

/** Every category below `id` (children, grandchildren, ...). */
export const descendantIds = (index: CategoryIndex, id: number): number[] => {
  const result: number[] = [];
  const visit = (parentId: number) =>
    index.childrenOf(parentId).forEach(child => {
      if (result.includes(child.id)) return;
      result.push(child.id);
      visit(child.id);
    });
  visit(id);
  return result;
};

/**
 * Template the category uses: its own `attributeTemplateId`, or the nearest
 * parent's (same rule as `GET /categories/{id}/attributes`). `null` when the
 * data carries no template ids (e.g. `/categories/tree`) or none is set.
 */
export const templateSource = (
  index: CategoryIndex,
  id: number
): { templateId: number; sourceId: number; inherited: boolean } | null => {
  const path = pathTo(index, id);
  for (let position = path.length - 1; position >= 0; position -= 1) {
    const { attributeTemplateId, id: sourceId } = path[position];
    if (attributeTemplateId) return { templateId: attributeTemplateId, sourceId, inherited: sourceId !== id };
  }
  return null;
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
export const search = (
  index: CategoryIndex,
  query: string,
  limit = 8,
  filter?: (category: Types.IEntity.Category) => boolean
): CategorySearchResult[] => {
  const q = normalize(query);
  if (!q) return [];

  const results: (CategorySearchResult & { score: number })[] = [];

  index.byId.forEach(category => {
    if (filter && !filter(category)) return;
    const names = [category.name, category.nameUz, category.nameRu, category.code].filter(Boolean).map(normalize);
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
