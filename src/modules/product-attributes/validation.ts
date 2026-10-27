import type { ProductAttributeGroup, VariantInput } from './types';

export const validateVariants = (groups: ProductAttributeGroup[], variants: VariantInput[]): string | null => {
  if (!variants.length) return 'Kamida bitta variant kiriting';

  if (!groups.length && variants.length > 1) {
    return "Variant xususiyatlari sozlanmagan mahsulot uchun faqat bitta variant saqlash mumkin";
  }

  const combinations = new Set<string>();

  for (const [index, variant] of variants.entries()) {
    if (!variant.sku?.trim()) return `${index + 1}-variant uchun SKU kiriting`;

    if (groups.some(group => !variant.selectedOptions[group.attributeDefinitionId])) {
      return `${index + 1}-variant uchun barcha variant xususiyatlarini tanlang`;
    }

    const combination = groups
      .map(group => `${group.attributeDefinitionId}:${variant.selectedOptions[group.attributeDefinitionId]}`)
      .sort()
      .join('|');

    if (combinations.has(combination)) return `${index + 1}-variant kombinatsiyasi takrorlangan`;
    combinations.add(combination);
  }

  return null;
};
