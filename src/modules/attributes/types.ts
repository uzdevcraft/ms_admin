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

  export namespace OptionList {
    export type Response = IEntity.AttributeOption[];
  }

  export namespace ForCategory {
    /** `GET /categories/{categoryId}/attributes` — the resolved template of a category. */
    export interface Response {
      categoryId: number;
      templateId: number | null;
      templateName: string | null;
      /** Category the template is set on (this one or the nearest parent). */
      templateSourceCategoryId: number | null;
      attributes: (IEntity.AttributeDefinition & {
        required: boolean;
        sortOrder: number;
        options: IEntity.AttributeOption[];
      })[];
    }
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
    /** Required by the category's attribute template. */
    required: boolean;
    sortOrder: number;
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
    categoryId: number;
    /** `null` — no template on the category or any parent. */
    templateId: number | null;
    templateName: string;
    /** Category the template is inherited from (equals `categoryId` when set directly). */
    templateSourceCategoryId: number | null;
    /** Attributes describing the product (Brend, Material, ...). */
    specs: IEntity.CategoryAttribute[];
    /** Attributes that form variants (O'lcham, Rang, ...). */
    variants: IEntity.CategoryAttribute[];
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
