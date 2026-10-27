import { get } from 'radash';
import type * as Types from './types';

const level = (value: unknown): Types.IEntity.Level => (value === 1 || value === 2 ? value : 0);

export const Category = (src: unknown): Types.IEntity.Category => ({
  id: get(src, 'id', 0),
  parentId: get(src, 'parentId', null) as number | null,
  categoryLevel: level(get(src, 'categoryLevel', 0)),
  code: get(src, 'code', ''),
  slug: get(src, 'slug', ''),
  attributeTemplateId: get(src, 'attributeTemplateId', null) as number | null,
  childCount: get(src, 'childCount', 0),
  hasChildren: get(src, 'hasChildren', false),
  commissionPercent: get(src, 'commissionPercent', null) as number | null,
  commissionTier: get(src, 'commissionTier', ''),
  name: get(src, 'name', ''),
  nameUz: get(src, 'nameUz', ''),
  nameRu: get(src, 'nameRu', ''),
  description: get(src, 'description', '') ?? '',
  imageUrl: get(src, 'imageUrl', '') ?? '',
  isActive: get(src, 'isActive', true),
  sortOrder: get(src, 'sortOrder', 0) as number,
  createdAt: get(src, 'createdAt', '')
});

export const List = (src: unknown): Types.IQuery.List => {
  const items = Array.isArray(src) ? src : get(src, 'content', get(src, 'data', get(src, 'results', [])));

  return {
    data: (items as unknown[]).map(Category)
  };
};

/**
 * Flattens `GET /categories/tree` into a list (parents first). Children get
 * their `parentId` from the nesting, since the API omits null fields.
 */
export const Tree = (src: unknown): Types.IQuery.Tree => {
  const roots = (Array.isArray(src) ? src : []) as Types.IApi.TreeNode[];
  const data: Types.IEntity.Category[] = [];

  const walk = (nodes: Types.IApi.TreeNode[], parentId: number | null) => {
    nodes.forEach(node => {
      const children = node.children ?? [];
      data.push({
        ...Category(node),
        parentId: node.parentId ?? parentId,
        childCount: node.childCount ?? children.length,
        hasChildren: node.hasChildren ?? children.length > 0
      });
      walk(children, node.id);
    });
  };

  walk(roots, null);
  return { data, source: 'tree' };
};

/** Older API: a flat list; child counts (and levels, if missing) are derived from `parentId`. */
export const TreeFromList = (src: unknown): Types.IQuery.Tree => {
  const { data } = List(src);
  const byId = new Map(data.map(category => [category.id, category] as const));
  const depth = (category: Types.IEntity.Category, seen = new Set<number>()): number => {
    const parent = category.parentId ? byId.get(category.parentId) : undefined;
    if (!parent || seen.has(parent.id)) return 0;
    seen.add(category.id);
    return 1 + depth(parent, seen);
  };

  // Newer responses carry `categoryLevel`; derive it only when none is sent.
  const hasLevels = data.some(category => category.categoryLevel > 0);

  return {
    data: data.map(category => {
      const childCount = data.filter(item => item.parentId === category.id).length;
      const categoryLevel = hasLevels ? category.categoryLevel : level(depth(category));
      return { ...category, categoryLevel, childCount, hasChildren: childCount > 0 };
    }),
    source: 'flat'
  };
};

const text = (value: string) => (value.trim() ? value.trim() : null);

export const CreateRequest = (values: Types.IForm.Create): Types.IApi.Create.Request => ({
  name: values.name.trim(),
  nameUz: values.nameUz.trim() || values.name.trim(),
  nameRu: values.nameRu.trim(),
  description: text(values.description),
  imageUrl: text(values.imageUrl),
  isActive: values.isActive,
  sortOrder: values.sortOrder ?? 0,
  parentId: values.parentId || null,
  attributeTemplateId: values.attributeTemplateId || null
});

/**
 * `PUT /categories/{id}`: for parent / template `null` = keep, `0` = remove, `> 0` = set.
 * With `initial`, untouched values are sent as `null`, so an inherited template
 * (not in the form) is never unlinked by accident.
 */
const relation = (value: number | null, initial: number | null | undefined) => {
  if (initial !== undefined && (value || null) === (initial || null)) return null;
  return value || 0;
};

export const UpdateRequest = (
  id: number,
  values: Types.IForm.Update,
  initial?: Types.IForm.Update
): Types.IApi.Update.Request => ({
  id,
  newId: values.id,
  ...CreateRequest(values),
  parentId: relation(values.parentId, initial?.parentId),
  attributeTemplateId: relation(values.attributeTemplateId, initial?.attributeTemplateId)
});

export const FormValues = (category: Types.IEntity.Category): Types.IForm.Update => ({
  id: category.id,
  name: category.name,
  nameUz: category.nameUz,
  nameRu: category.nameRu,
  description: category.description,
  imageUrl: category.imageUrl,
  isActive: category.isActive,
  sortOrder: category.sortOrder,
  parentId: category.parentId,
  attributeTemplateId: category.attributeTemplateId
});
