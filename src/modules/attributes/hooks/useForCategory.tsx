import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { categoryAttributesKey } from '../constants';
import * as Mappers from '../mappers';

/**
 * Attributes of the category's template — `GET /categories/{categoryId}/attributes`.
 * Spec attributes and variant axes come split, in template order, with `required`.
 */
const useForCategory = (categoryId: number, enabled = true) =>
  useQuery({
    queryKey: categoryAttributesKey(categoryId),
    queryFn: async () => {
      const { data } = await Api.ForCategory({ categoryId });
      return Mappers.ForCategory(data);
    },
    enabled: enabled && categoryId > 0,
    staleTime: 5 * 60_000
  });

export default useForCategory;
