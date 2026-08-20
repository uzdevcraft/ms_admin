import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";
import type * as Types from "../types";

const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Types.IForm.Create) => {
      const { data } = await Api.Create(Mappers.CreateRequest(values));
      return Mappers.Category(typeof data === "object" ? data : { id: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", "list"] });
    },
  });
};

export default useCreate;
