import type { AxiosPromise } from 'axios';
import { http } from '@common/services';
import type { ProductAttributes, SaveSpecsRequest, SaveVariantsRequest } from './types';

export const GetProductAttributes = ({ productId }: { productId: number }): AxiosPromise<ProductAttributes> =>
  http.request.get(`/product-attributes/${productId}`);

export const SaveProductVariants = ({
  productId,
  request
}: {
  productId: number;
  request: SaveVariantsRequest;
}): AxiosPromise<number[]> => http.request.put(`/seller/products/variants/${productId}`, request);

/** Spec (non-variant) values; the list replaces the saved one completely. Responds 204. */
export const SaveProductSpecs = ({
  productId,
  request
}: {
  productId: number;
  request: SaveSpecsRequest;
}): AxiosPromise<void> => http.request.put(`/seller/products/specs/${productId}`, request);
