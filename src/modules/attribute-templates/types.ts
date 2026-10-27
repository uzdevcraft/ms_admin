/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

export declare namespace IApi {
  export namespace List {
    export type Response = IEntity.Template[];
  }

  export namespace Single {
    export type Response = IEntity.Template;
  }

  export namespace Create {
    export interface Item {
      attributeDefinitionId: number;
      required: boolean;
      sortOrder: number;
    }

    export interface Request {
      nameUz: string;
      items: Item[];
    }

    export type Response = IEntity.Template | number;
  }

  export namespace Update {
    /** `PUT` replaces the template's items completely. */
    export interface Request extends IApi.Create.Request {
      id: number;
    }

    export type Response = IEntity.Template | number;
  }
}

export declare namespace IEntity {
  export interface TemplateItem {
    id: number;
    attributeDefinitionId: number;
    code: string;
    nameUz: string;
    nameRu: string;
    required: boolean;
    sortOrder: number;
  }

  /** A reusable set of attributes linked to categories (inherited by their children). */
  export interface Template {
    id: number;
    nameUz: string;
    items: TemplateItem[];
  }
}

export declare namespace IQuery {
  export interface List {
    data: IEntity.Template[];
  }

  export interface Single {
    id: number;
  }
}

export declare namespace IForm {
  export interface Item {
    attributeDefinitionId: number;
    required: boolean;
  }

  /** Item order in the form is the `sortOrder` sent to the API. */
  export interface Create {
    nameUz: string;
    items: Item[];
  }

  export interface Update extends Create {
    id: number;
  }
}
