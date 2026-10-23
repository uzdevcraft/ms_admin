import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { WITH_OPTIONS_QUERY_KEY } from '../constants';
import * as Mappers from '../mappers';

/**
 * Every attribute definition with its options, split into spec attributes
 * (section 02 of the product editor) and variant axes (section 03).
 *
 * `GET /attribute-definition` + `GET /attribute-options/{attributeDefinitionId}`.
 * The API has no per-category attribute set yet, so all definitions are offered.
 */
const useWithOptions = (enabled = true) =>
  useQuery({
    queryKey: WITH_OPTIONS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await Api.List();
      const definitions = Mappers.List(data).data;

      const withOptions = await Promise.all(
        definitions.map(async definition => {
          const hasOptions = definition.attributeType !== 'NUMBER' && definition.attributeType !== 'BOOLEAN';
          const options = hasOptions
            ? Mappers.OptionList((await Api.ListOptions({ attributeDefinitionId: definition.id })).data)
            : [];
          return { ...definition, required: false, options };
        })
      );

      return Mappers.CategoryAttributes(withOptions);
    },
    enabled,
    staleTime: 5 * 60_000
  });

export default useWithOptions;
