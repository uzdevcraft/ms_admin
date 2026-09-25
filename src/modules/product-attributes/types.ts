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
  sku: string;
  priceOverride?: number;
  stockQuantity: number;
}

export interface SaveVariantsRequest {
  variants: VariantInput[];
}
