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
      return Mappers.Category(data);
    },
    onSuccess: (_, { id, values }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "single", id] });
      if (values.id !== id) {
        queryClient.invalidateQueries({
          queryKey: ["categories", "single", values.id],
        });
      }
    },
  });
};

export default useUpdate;
