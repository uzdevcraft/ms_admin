import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

/** One category with its own `attributeTemplateId` (for the edit form). */
const useSingle = (id: number, enabled = true) =>
  useQuery({
    queryKey: ["categories", "single", id],
    queryFn: async () => {
      const { data } = await Api.Single({ id });
      return Mappers.Category(data);
    },
    enabled: enabled && id > 0,
  });

export default useSingle;
