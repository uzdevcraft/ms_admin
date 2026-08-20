import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Api from "../api";
import type * as Types from "../types";

interface UpdateStatusVariables {
  id: number;
  status: Types.OrderStatus;
}

const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateStatusVariables) => {
      const { data } = await Api.UpdateStatus({ id, status });
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "single", id] });
    },
  });
};

export default useUpdateStatus;
