export type AttributeDisplayType = 'DROPDOWN' | 'SWATCH' | 'BUTTON';

export interface AttributeOption {
  id: number;
  valueUz: string;
  valueRu: string;
  metaJson: Record<string, unknown>;
}

export interface ProductAttributeGroup {
  attributeDefinitionId: number;
  code: string;
  nameUz: string;
  displayType: AttributeDisplayType;
  options: AttributeOption[];
  /** TEXT / NUMBER / BOOLEAN spec values come here instead of `options`. */
  textValue: string | null;
}

export interface ProductVariant {
  variantId: number;
  sku: string;
  effectivePrice: number;
  stockQuantity: number;
  active: boolean;
  selectedOptions: Record<number, number>;
}

export interface ProductAttributes {
  variantGroups: ProductAttributeGroup[];
  specGroups: ProductAttributeGroup[];
  variants: ProductVariant[];
}

export interface VariantInput {
  variantId?: number;
  selectedOptions: Record<number, number>;
  /** `null` → the backend generates the SKU. */
  sku: string | null;
  priceOverride?: number;
  stockQuantity: number;
}

export interface SaveVariantsRequest {
  variants: VariantInput[];
}

/** One spec (non-variant) value: `optionIds` for SELECT / MULTISELECT, `textValue` otherwise. */
export interface SpecInput {
  attributeDefinitionId: number;
  optionIds?: number[];
  textValue?: string;
}

/** `PUT /seller/products/specs/{productId}` — replaces the product's specs completely. */
export interface SaveSpecsRequest {
  values: SpecInput[];
}
