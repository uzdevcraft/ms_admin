import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Api from "../api";

const useDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await Api.Delete({ id });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      queryClient.removeQueries({ queryKey: ["orders", "single", id] });
    },
  });
};

export default useDelete;
