import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

/** Products of one category (`GET /products/category/{id}`). */
const useByCategory = (categoryId: number, enabled = true) =>
  useQuery({
    queryKey: ["products", "category", categoryId],
    queryFn: async () => {
      const { data } = await Api.ByCategory({ categoryId });
      return Mappers.List(data);
    },
    enabled: enabled && categoryId > 0,
    staleTime: 60_000,
  });

export default useByCategory;
