import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Api from "../api";

const useDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await Api.Delete({ id });
    },
    onSuccess: (_, id) => {
      // Tree, list, single and every category's resolved attributes may change.
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["attributes", "category"] });
      queryClient.removeQueries({ queryKey: ["categories", "single", id] });
    },
  });
};

export default useDelete;
