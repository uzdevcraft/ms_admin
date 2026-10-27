import type * as Types from './types';

/**
 * Pure helpers that turn backend product data (search results, products of a
 * category) into recommendations for the product form. Kept free of React so
 * they can be unit-tested with `node --test`.
 */

export interface CategoryRecommendation {
  categoryId: number;
  categoryName: string;
  /** How many of the matched products belong to this category. */
  count: number;
  /** How many matched products had a category at all. */
  total: number;
}

export interface PriceStats {
  min: number;
  max: number;
  median: number;
  count: number;
}

export const MIN_SEARCH_LENGTH = 2;

export const DISCOUNT_PERCENTS = [5, 10, 15, 20] as const;

export const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();

/** Products other than the one being edited. */
export const withoutProduct = (products: Types.IEntity.Product[], excludeId?: number) =>
  excludeId ? products.filter(product => product.id !== excludeId) : products;

/** A product whose name (any language) is exactly the typed name, ignoring case and extra spaces. */
export const findExactMatch = (
  products: Types.IEntity.Product[],
  name: string,
  excludeId?: number
): Types.IEntity.Product | null => {
  const target = normalize(name);
  if (!target) return null;

  return (
    withoutProduct(products, excludeId).find(product =>
      [product.name, product.nameUz, product.nameRu].some(value => value && normalize(value) === target)
    ) ?? null
  );
};

/** The category most of the matched products belong to. */
export const recommendCategory = (products: Types.IEntity.Product[]): CategoryRecommendation | null => {
  const counts = new Map<number, { name: string; count: number }>();
  let total = 0;

  products.forEach(product => {
    if (!product.categoryId) return;
    total += 1;
    const current = counts.get(product.categoryId);
    counts.set(product.categoryId, {
      name: current?.name || product.categoryName,
      count: (current?.count ?? 0) + 1
    });
  });

  let best: CategoryRecommendation | null = null;

  counts.forEach(({ name, count }, categoryId) => {
    if (!best || count > best.count) {
      best = { categoryId, categoryName: name, count, total };
    }
  });

  return best;
};

export const priceStats = (products: Types.IEntity.Product[]): PriceStats | null => {
  const prices = products
    .map(product => product.price)
    .filter(price => Number.isFinite(price) && price > 0)
    .sort((a, b) => a - b);

  if (!prices.length) return null;

  const middle = Math.floor(prices.length / 2);
  const median = prices.length % 2 ? prices[middle] : (prices[middle - 1] + prices[middle]) / 2;

  return {
    min: prices[0],
    max: prices[prices.length - 1],
    median: roundPrice(median),
    count: prices.length
  };
};

/** Next free sort order inside a category. */
export const nextSortOrder = (products: Types.IEntity.Product[]) =>
  products.length ? Math.max(...products.map(product => product.sortOrder || 0)) + 1 : 1;

/** UZS-sized prices are rounded to whole hundreds, small prices to cents. */
export const roundPrice = (value: number) =>
  value >= 1000 ? Math.round(value / 100) * 100 : Math.round(value * 100) / 100;

export const discountPresets = (price: number, percents: readonly number[] = DISCOUNT_PERCENTS) =>
  price > 0 ? percents.map(percent => ({ percent, value: roundPrice(price * (1 - percent / 100)) })) : [];

/**
 * Fields worth reusing from an existing product when adding a similar one.
 * Identity- and inventory-specific fields (name, stock, variants, status)
 * are intentionally left out.
 */
export const copyableFields = (
  product: Types.IEntity.Product
): Pick<
  Types.IForm.Create,
  | 'categoryId'
  | 'description'
  | 'descriptionUz'
  | 'descriptionRu'
  | 'nameRu'
  | 'price'
  | 'discountEnabled'
  | 'discountPrice'
  | 'purchasePrice'
  | 'imageUrls'
> => {
  const discountEnabled = product.discountPrice > 0 && product.discountPrice < product.price;

  return {
    categoryId: product.categoryId,
    description: product.description,
    descriptionUz: product.descriptionUz || product.description,
    descriptionRu: product.descriptionRu,
    nameRu: product.nameRu,
    price: product.price,
    discountEnabled,
    discountPrice: discountEnabled ? product.discountPrice : 0,
    purchasePrice: product.purchasePrice,
    imageUrls: product.imageUrls
  };
};
