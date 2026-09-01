import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

import { useAuthStore } from "../store";

const useUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data } = useQuery({
    queryKey: ["user", accessToken],
    enabled: !!accessToken,
    queryFn: async () => {
      const { data } = await Api.User();
      return Mappers.User(data);
    },
  });

  // Mirror the fetched user into the store so non-hook callers
  // (interceptors, guards) can read it too.
  useEffect(() => {
    if (data) setUser(data);
  }, [data, setUser]);

  return data || null;
};

export default useUser;
