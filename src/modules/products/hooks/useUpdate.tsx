import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";
import type * as Types from "../types";

interface UpdateVariables {
  id: number;
  values: Types.IForm.Update;
}

const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateVariables) => {
      const { data } = await Api.Update(Mappers.UpdateRequest(id, values));
      return Mappers.Product(data);
    },
    onSuccess: (_, { id, values }) => {
      queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      queryClient.invalidateQueries({ queryKey: ["products", "single", id] });
      if (values.id !== id) {
        queryClient.invalidateQueries({
          queryKey: ["products", "single", values.id],
        });
      }
    },
  });
};

export default useUpdate;
