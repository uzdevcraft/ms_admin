import { keepPreviousData, useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

const useList = () =>
  useQuery({
    queryKey: ["products", "list"],
    queryFn: async () => {
      const { data } = await Api.List();
      return Mappers.List(data);
    },
    placeholderData: keepPreviousData,
  });

export default useList;
