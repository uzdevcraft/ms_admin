import type * as Types from './types';

/**
 * Pure helpers behind section 03 of the product editor: profit preview and
 * variant generation. No React, so they run under `node --test`.
 */

const round = (value: number) => Math.round(value);

export interface ProfitInput {
  price: number;
  discountEnabled: boolean;
  discountPrice: number;
  purchasePrice: number;
  storePrice: number | null;
  commissionPercent: number;
}

export interface ProfitBreakdown {
  /** What the customer pays online (discount price when the discount is on). */
  salePrice: number;
  commission: number;
  /** Online sale price minus ZARO commission. */
  payout: number;
  /** Payout minus purchase price. */
  onlineProfit: number;
  /** Store price minus purchase price (no commission in store). */
  storeProfit: number;
}

export const profit = ({
  price,
  discountEnabled,
  discountPrice,
  purchasePrice,
  storePrice,
  commissionPercent
}: ProfitInput): ProfitBreakdown => {
  const base = Math.max(0, price || 0);
  const salePrice = discountEnabled && discountPrice > 0 && discountPrice < base ? discountPrice : base;
  const commission = round((salePrice * Math.max(0, commissionPercent)) / 100);
  const payout = salePrice - commission;
  const cost = Math.max(0, purchasePrice || 0);

  return {
    salePrice,
    commission,
    payout,
    onlineProfit: salePrice ? payout - cost : 0,
    storeProfit: storePrice ? storePrice - cost : 0
  };
};

export interface VariantAxis {
  attributeDefinitionId: number;
  name: string;
  options: { id: number; label: string }[];
}

export const variantKey = (selectedOptions: Record<number, number>) =>
  Object.keys(selectedOptions)
    .map(Number)
    .sort((a, b) => a - b)
    .map(id => `${id}:${selectedOptions[id]}`)
    .join('|');

const LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'j',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'x',
  ц: 's',
  ч: 'ch',
  ш: 'sh',
  щ: 'sh',
  ы: 'i',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ў: 'o',
  қ: 'q',
  ғ: 'g',
  ҳ: 'h'
};

const code = (value: string, max: number) =>
  value
    .toLocaleLowerCase()
    .split('')
    .map(char => LATIN[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '')
    .toUpperCase()
    .slice(0, max);

/** "Ayollar yozgi ko'ylagi" → "AYO-YOZ-KOY" */
export const skuPrefix = (name: string) =>
  name
    .split(/\s+/)
    .map(word => code(word, 3))
    .filter(Boolean)
    .slice(0, 3)
    .join('-') || 'SKU';

export const variantSku = (prefix: string, labels: string[]) =>
  [prefix, ...labels.map(label => code(label, 4))].filter(Boolean).join('-');

const cartesian = <T>(lists: T[][]): T[][] =>
  lists.reduce<T[][]>((acc, list) => acc.flatMap(combo => list.map(item => [...combo, item])), [[]]);

/**
 * Every combination of the chosen options (e.g. S/M/L × Qizil/Ko'k → 6 rows).
 * Rows that already exist keep what the user typed (SKU, price, stock).
 */
export const generateVariants = (
  axes: VariantAxis[],
  selected: Record<number, number[]>,
  existing: Types.IForm.Variant[],
  defaults: { name: string; stockQuantity: number }
): Types.IForm.Variant[] => {
  const used = axes
    .map(axis => ({
      ...axis,
      options: axis.options.filter(option => selected[axis.attributeDefinitionId]?.includes(option.id))
    }))
    .filter(axis => axis.options.length > 0);

  if (!used.length) return [];

  const byKey = new Map(existing.map(variant => [variant.key, variant] as const));
  const prefix = skuPrefix(defaults.name);

  return cartesian(used.map(axis => axis.options.map(option => ({ axis, option })))).map(combo => {
    const selectedOptions = Object.fromEntries(
      combo.map(({ axis, option }) => [axis.attributeDefinitionId, option.id])
    ) as Record<number, number>;
    const key = variantKey(selectedOptions);
    const labels = combo.map(({ option }) => option.label);
    const previous = byKey.get(key);

    return {
      key,
      variantId: previous?.variantId,
      selectedOptions,
      label: labels.join(' / '),
      sku: previous?.sku || variantSku(prefix, labels),
      price: previous?.price ?? null,
      stockQuantity: previous?.stockQuantity ?? defaults.stockQuantity
    };
  });
};
