/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

export declare namespace IApi {
  export namespace List {
    export type Response = IEntity.Product[];
  }

  export namespace Single {
    export type Response = IEntity.Product;
  }

  export namespace Create {
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
  export interface Create {
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
  }

  export interface Update extends Create {
    id: number;
  }
}
