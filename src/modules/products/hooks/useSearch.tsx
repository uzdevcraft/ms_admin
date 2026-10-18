import { keepPreviousData, useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";
import { MIN_SEARCH_LENGTH } from "../suggestions";

/** Backend product search (`GET /products/search?q=`), used for autocomplete. */
const useSearch = (query: string, enabled = true) => {
  const q = query.trim();

  return useQuery({
    queryKey: ["products", "search", q],
    queryFn: async () => {
      const { data } = await Api.Search({ q });
      return Mappers.List(data);
    },
    enabled: enabled && q.length >= MIN_SEARCH_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
};

export default useSearch;
