/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

export declare namespace IApi {
  export namespace List {
    export type Response = IEntity.Category[];
  }

  export namespace Single {
    export type Response = IEntity.Category;
  }

  export namespace Create {
    export interface Request {
      name: string;
      nameUz: string;
      nameRu: string;
      description: string;
      imageUrl: string;
      isActive: boolean;
      sortOrder: number;
    }

    export type Response = number;
  }

  export namespace Update {
    export interface Request extends Partial<IApi.Create.Request> {
      id: number;
      newId?: number;
    }

    export type Response = unknown;
  }
}

export declare namespace IEntity {
  export interface Category {
    id: number;
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
  }

  export interface Update extends Create {
    id: number;
  }
}
