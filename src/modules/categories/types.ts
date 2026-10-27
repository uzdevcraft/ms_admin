/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

export declare namespace IApi {
  export namespace List {
    export type Response = IEntity.Category[];
  }

  export namespace Tree {
    /** `GET /categories/tree` — departments with nested `children`. */
    export type Response = TreeNode[];
  }

  export interface TreeNode extends Partial<IEntity.Category> {
    id: number;
    children?: TreeNode[];
  }

  export namespace Single {
    export type Response = IEntity.Category;
  }

  export namespace Create {
    export interface Request {
      name: string;
      nameUz: string;
      nameRu: string;
      description: string | null;
      imageUrl: string | null;
      isActive: boolean;
      sortOrder: number;
      /** `null` → department (root). */
      parentId: number | null;
      /** `null` → inherits the parent's attribute template. */
      attributeTemplateId: number | null;
    }

    /** Id of the created category. */
    export type Response = number;
  }

  export namespace Update {
    /**
     * For `parentId` / `attributeTemplateId`: `null` = unchanged,
     * `0` = remove (make root / unlink template), `> 0` = set.
     */
    export interface Request extends Partial<IApi.Create.Request> {
      id: number;
      newId?: number;
    }

    export type Response = unknown;
  }
}

export declare namespace IEntity {
  /** 0 — department (Departament), 1 — category, 2 — subcategory (products live here). */
  export type Level = 0 | 1 | 2;

  export interface Category {
    id: number;
    /** Parent category id; `null` for a top-level department. */
    parentId: number | null;
    categoryLevel: Level;
    /** Taxonomy code, e.g. "D01", "01", "01.01". */
    code: string;
    slug: string;
    /** Template set on this category itself (`null` → inherited from a parent). */
    attributeTemplateId: number | null;
    childCount: number;
    hasChildren: boolean;
    /** ZARO commission for products of this category, in percent (null when the API doesn't send it). */
    commissionPercent: number | null;
    /** Commission tier label, e.g. "T3". */
    commissionTier: string;
    name: string;
    nameUz: string;
    nameRu: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
  }
}

export declare namespace IQuery {
  export interface List {
    data: IEntity.Category[];
  }

  /** The whole hierarchy, flattened (parents before children, API order kept). */
  export interface Tree {
    data: IEntity.Category[];
    /** `tree` — `GET /categories/tree`; `flat` — older API without the tree endpoint. */
    source: 'tree' | 'flat';
  }

  export interface Single {
    id: number;
  }
}

export declare namespace IForm {
  export interface Create {
    name: string;
    nameUz: string;
    nameRu: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    sortOrder: number | null;
    parentId: number | null;
    attributeTemplateId: number | null;
  }

  export interface Update extends Create {
    id: number;
  }
}
