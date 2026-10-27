import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";
import type * as Types from "../types";

interface UpdateVariables {
  id: number;
  values: Types.IForm.Update;
  /** Values the form started from — unchanged parent / template are sent as `null` (keep). */
  initial?: Types.IForm.Update;
}

const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values, initial }: UpdateVariables) => {
      const { data } = await Api.Update(Mappers.UpdateRequest(id, values, initial));
      return Mappers.Category(typeof data === "object" && data ? data : { ...values, id });
    },
    onSuccess: () => {
      // Tree, list, single and every category's resolved attributes may change.
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["attributes", "category"] });
    },
  });
};

export default useUpdate;
