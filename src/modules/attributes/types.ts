/* eslint-disable @typescript-eslint/no-namespace -- module architecture uses IApi/IEntity/IQuery/IForm namespaces */

export declare namespace IApi {
  export namespace List {
    export type Response = IEntity.AttributeDefinition[];
  }

  export namespace Single {
    export type Response = IEntity.AttributeDefinition;
  }

  export namespace Create {
    export interface Request {
      code: string;
      nameUz: string;
      nameRu: string | null;
      attributeType: IEntity.AttributeType;
      displayType: IEntity.AttributeDisplayType;
      variant: boolean;
      filterable: boolean;
    }

    export type Response = IEntity.AttributeDefinition;
  }

  export namespace Update {
    export interface Request extends IApi.Create.Request {
      id: number;
    }

    export type Response = IEntity.AttributeDefinition;
  }

  export namespace ForCategory {
    /** Attribute set of a category, each definition with its options inline. */
    export type Response = (IEntity.AttributeDefinition & {
      required?: boolean;
      options?: IEntity.AttributeOption[];
    })[];
  }

  export namespace OptionList {
    export type Response = IEntity.AttributeOption[];
  }

  export namespace OptionCreate {
    export interface Request {
      valueUz: string;
      valueRu: string | null;
      sortOrder: number;
      metaJson: { colorHex?: string; iconUrl?: string } | null;
    }

    export type Response = IEntity.AttributeOption;
  }

  export namespace OptionUpdate {
    export interface Request extends IApi.OptionCreate.Request {
      id: number;
    }

    export type Response = IEntity.AttributeOption;
  }
}

export declare namespace IEntity {
  export type AttributeType = 'SELECT' | 'MULTISELECT' | 'TEXT' | 'NUMBER' | 'BOOLEAN';
  export type AttributeDisplayType = 'DROPDOWN' | 'SWATCH' | 'BUTTON';

  export interface AttributeDefinition {
    id: number;
    code: string;
    nameUz: string;
    nameRu: string | null;
    attributeType: AttributeType;
    displayType: AttributeDisplayType;
    variant: boolean;
    filterable: boolean;
  }

  /** Attribute definition with its options, as used by the product editor. */
  export interface CategoryAttribute extends AttributeDefinition {
    required: boolean;
    options: AttributeOption[];
  }

  export interface AttributeOption {
    id: number;
    attributeDefinitionId: number;
    valueUz: string;
    valueRu: string | null;
    sortOrder: number;
    metaJson: { colorHex?: string; iconUrl?: string } | null;
  }
}

export declare namespace IQuery {
  export interface List {
    data: IEntity.AttributeDefinition[];
  }

  export interface Single {
    id: number;
  }

  export interface OptionList {
    attributeDefinitionId: number;
  }

  export interface ForCategory {
    categoryId: number;
  }

  export interface CategoryAttributes {
    /** Attributes describing the product (Brend, Material, ...). */
    specs: IEntity.CategoryAttribute[];
    /** Attributes that form variants (O'lcham, Rang, ...). */
    variants: IEntity.CategoryAttribute[];
    /**
     * `category` — the category's own attribute set from the backend;
     * `global` — the endpoint isn't available yet, so every attribute is offered.
     */
    source: 'category' | 'global';
  }
}

export declare namespace IForm {
  export interface AttributeDefinition {
    code: string;
    nameUz: string;
    nameRu: string;
    attributeType: IEntity.AttributeType;
    displayType: IEntity.AttributeDisplayType;
    variant: boolean;
    filterable: boolean;
  }

  export interface AttributeOption {
    valueUz: string;
    valueRu: string;
    sortOrder: number;
    colorHex: string;
  }
}
