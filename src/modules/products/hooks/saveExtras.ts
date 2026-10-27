import * as ProductAttributesApi from '@/modules/product-attributes/api';
import * as ProductAttributesMappers from '@/modules/product-attributes/mappers';

import { PartialSaveError } from '../errors';
import * as Mappers from '../mappers';
import type * as Types from '../types';

export interface SavedExtras {
  /** The product already had active variants / specs (edit mode). */
  hadVariants?: boolean;
  hadSpecs?: boolean;
}

/**
 * Saves variants, then specs, after the product itself. Both lists replace the
 * saved ones, so an empty list is sent only when something existed before
 * (it deactivates the variants / clears the specs).
 */
const saveExtras = async (productId: number, values: Types.IForm.Create, saved: SavedExtras = {}) => {
  const variants = Mappers.VariantsRequest(values);
  if (variants.length || saved.hadVariants) {
    try {
      await ProductAttributesApi.SaveProductVariants({
        productId,
        request: ProductAttributesMappers.SaveVariantsRequest(variants)
      });
    } catch (error) {
      throw new PartialSaveError(productId, 'variants', error);
    }
  }

  const specs = Mappers.SpecsRequest(values);
  if (specs.length || saved.hadSpecs) {
    try {
      await ProductAttributesApi.SaveProductSpecs({
        productId,
        request: ProductAttributesMappers.SaveSpecsRequest(specs)
      });
    } catch (error) {
      throw new PartialSaveError(productId, 'specs', error);
    }
  }
};

export default saveExtras;
