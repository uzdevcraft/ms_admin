import { keepPreviousData, useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

const useMyOrders = () =>
  useQuery({
    queryKey: ["orders", "my-orders"],
    queryFn: async () => {
      const { data } = await Api.MyOrders();
      return Mappers.List(data);
    },
    placeholderData: keepPreviousData,
  });

export default useMyOrders;
