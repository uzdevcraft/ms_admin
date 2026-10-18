/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

export declare namespace IApi {
  export namespace List {
    export type Response = IEntity.Product[];
  }

  export namespace Single {
    export type Response = IEntity.Product;
  }

  export namespace Create {
    export interface AttributeValue {
      attributeDefinitionId: number;
      optionIds: number[];
      value: string | null;
    }

    export interface Request {
      categoryId: number;
      name: string;
      nameUz: string;
      nameRu: string;
      description: string;
      descriptionUz: string;
      descriptionRu: string;
      price: number;
      discountPrice: number;
      imageUrl: string;
      stockQuantity: number;
      isActive: boolean;
      sortOrder: number;

      // ---- Fields from the product editor design. The current API ignores
      // them; see docs/product-editor-api.md for the backend contract.
      imageUrls: string[];
      purchasePrice: number;
      storePrice: number | null;
      onlineEnabled: boolean;
      storeEnabled: boolean;
      status: IEntity.Status;
      attributes: AttributeValue[];
    }

    export type Response = IEntity.Product;
  }

  export namespace Update {
    export interface Request extends Partial<IApi.Create.Request> {
      id: number;
      newId?: number;
    }

    export type Response = IEntity.Product;
  }

  export namespace Search {
    export interface Request {
      q?: string;
    }

    export type Response = IEntity.Product[];
  }
}

export declare namespace IEntity {
  /** DRAFT — saved, not visible; PENDING_REVIEW — waits for admin approval; ACTIVE — live. */
  export type Status = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE';

  export interface Product {
    id: number;
    categoryId: number;
    categoryName: string;
    name: string;
    nameUz: string;
    nameRu: string;
    description: string;
    descriptionUz: string;
    descriptionRu: string;
    price: number;
    discountPrice: number;
    effectivePrice: number;
    imageUrl: string;
    stockQuantity: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;

    // Optional until the backend returns them (see docs/product-editor-api.md).
    imageUrls: string[];
    purchasePrice: number;
    storePrice: number | null;
    onlineEnabled: boolean;
    storeEnabled: boolean;
    status: Status | '';
  }
}

export declare namespace IQuery {
  export interface List {
    data: IEntity.Product[];
  }

  export interface Single {
    id: number;
  }

  export interface ByCategory {
    categoryId: number;
  }
}

export declare namespace IForm {
  /** Value of one category attribute (section 02). */
  export interface SpecValue {
    /** Chosen option ids — SELECT (one) / MULTISELECT (many). */
    optionIds: number[];
    /** Free value — TEXT / NUMBER / BOOLEAN ("true" | "false"). */
    value: string;
  }

  /** One generated variant (size × colour × ...). */
  export interface Variant {
    /** Stable key built from the selected options, e.g. "3:11|4:20". */
    key: string;
    variantId?: number;
    /** attributeDefinitionId → optionId */
    selectedOptions: Record<number, number>;
    label: string;
    sku: string;
    /** Empty → the variant uses the product's online price. */
    price: number | null;
    stockQuantity: number;
  }

  export interface Create {
    // 01 — basic info
    name: string;
    nameUz: string;
    nameRu: string;
    description: string;
    descriptionUz: string;
    descriptionRu: string;
    categoryId: number;

    // 02 — category attributes, keyed by `specKey(attributeDefinitionId)`
    specs: Record<string, SpecValue>;

    // 03 — prices and variants
    /** Variant axis → chosen option ids, keyed by `specKey(attributeDefinitionId)`. */
    variantOptions: Record<string, number[]>;
    purchasePrice: number;
    price: number;
    discountEnabled: boolean;
    discountPrice: number;
    storePrice: number | null;
    /** Default stock for new variants, or the product stock without variants. */
    stockQuantity: number;
    variants: Variant[];

    // 04 — images (first one is the main image)
    imageUrls: string[];

    // 05 — sales channels
    onlineEnabled: boolean;
    storeEnabled: boolean;

    status: IEntity.Status;
    sortOrder: number;
  }

  export interface Update extends Create {
    id: number;
  }
}
