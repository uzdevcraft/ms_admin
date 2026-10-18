import { useMemo } from "react";
import { useDebouncedValue } from "@mantine/hooks";

import * as Suggestions from "../suggestions";
import useByCategory from "./useByCategory";
import useSearch from "./useSearch";

interface IProps {
  name: string;
  categoryId: number;
  /** Id of the product being edited, so it never "matches" itself. */
  excludeId?: number;
}

/**
 * Recommendations for the product form, built from backend data:
 * - similar products (search by name) → autocomplete + "copy from" + duplicate warning
 * - the category most similar products live in
 * - the price range of comparable products
 * - the next free sort order in the selected category
 */
const useSuggestions = ({ name, categoryId, excludeId }: IProps) => {
  const [debouncedName] = useDebouncedValue(name, 300);

  const search = useSearch(debouncedName);
  const byCategory = useByCategory(categoryId);

  return useMemo(() => {
    const hasQuery = debouncedName.trim().length >= Suggestions.MIN_SEARCH_LENGTH;
    const similar = hasQuery ? Suggestions.withoutProduct(search.data?.data ?? [], excludeId) : [];
    const inCategory = Suggestions.withoutProduct(byCategory.data?.data ?? [], excludeId);
    const similarInCategory = categoryId ? similar.filter(product => product.categoryId === categoryId) : [];

    // Prefer prices of similar products in the chosen category, then similar
    // products anywhere, then the whole category.
    const priceSource = similarInCategory.length
      ? similarInCategory
      : categoryId
        ? inCategory
        : similar;

    return {
      similar,
      exactMatch: hasQuery ? Suggestions.findExactMatch(similar, name) : null,
      recommendedCategory: Suggestions.recommendCategory(similar),
      priceStats: Suggestions.priceStats(priceSource),
      priceSource: similarInCategory.length || !categoryId ? ("similar" as const) : ("category" as const),
      nextSortOrder: byCategory.isSuccess ? Suggestions.nextSortOrder(inCategory) : null,
      isSearching: search.isFetching || name !== debouncedName,
    };
  }, [
    name,
    debouncedName,
    categoryId,
    excludeId,
    search.data,
    search.isFetching,
    byCategory.data,
    byCategory.isSuccess,
  ]);
};

export default useSuggestions;
