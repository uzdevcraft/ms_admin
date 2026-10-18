import { useQuery } from '@tanstack/react-query';
import { get } from 'radash';

import * as Api from '../api';
import * as Mappers from '../mappers';

/** Status codes meaning "the per-category endpoint doesn't exist yet". */
const NOT_AVAILABLE = [404, 405, 501];

/**
 * Attributes to show for a category: specs (section 02) and variant axes
 * (section 03). Uses `GET /categories/{id}/attributes`; until the backend
 * ships it, falls back to every attribute definition + its options.
 */
const useForCategory = (categoryId: number) =>
  useQuery({
    queryKey: ['attributes', 'category', categoryId],
    queryFn: async () => {
      try {
        const { data } = await Api.ForCategory({ categoryId });
        const items = (Array.isArray(data) ? data : get(data, 'data', [])) as unknown[];
        return Mappers.CategoryAttributes(items.map(Mappers.CategoryAttribute), 'category');
      } catch (error) {
        if (!NOT_AVAILABLE.includes(get(error, 'response.status', 0))) throw error;
      }

      const { data } = await Api.List();
      const definitions = Mappers.List(data).data;
      const withOptions = await Promise.all(
        definitions.map(async definition => {
          const needsOptions = definition.attributeType !== 'NUMBER' && definition.attributeType !== 'BOOLEAN';
          const options = needsOptions
            ? Mappers.OptionList((await Api.ListOptions({ attributeDefinitionId: definition.id })).data)
            : [];
          return { ...definition, required: false, options };
        })
      );

      return Mappers.CategoryAttributes(withOptions, 'global');
    },
    enabled: categoryId > 0,
    staleTime: 5 * 60_000
  });

export default useForCategory;
