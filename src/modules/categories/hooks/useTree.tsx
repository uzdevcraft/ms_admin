import { useQuery } from "@tanstack/react-query";
import { get } from "radash";

import * as Api from "../api";
import * as Mappers from "../mappers";

/**
 * Any HTTP error except auth means "no tree endpoint on this API version":
 * without it `/categories/tree` falls into `/categories/{id}` and answers
 * 400/404/500 depending on the backend. Network errors are rethrown.
 */
const treeUnavailable = (error: unknown) => {
  const status = get(error, "response.status", 0) as number;
  return status > 0 && status !== 401 && status !== 403;
};

/**
 * The whole category hierarchy, flattened (see `Tree` helpers for parent/child
 * lookups). Uses `GET /categories/tree`; on an API without it, falls back to
 * `GET /categories` and derives the hierarchy from `parentId`.
 */
const useTree = (enabled = true) =>
  useQuery({
    queryKey: ["categories", "tree"],
    queryFn: async () => {
      try {
        const { data } = await Api.Tree();
        return Mappers.Tree(data);
      } catch (error) {
        if (!treeUnavailable(error)) throw error;
      }

      const { data } = await Api.List();
      return Mappers.TreeFromList(data);
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });

export default useTree;
