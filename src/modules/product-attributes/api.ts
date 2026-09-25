import type { AxiosPromise } from 'axios';
import { http } from '@common/services';
import type { ProductAttributes, SaveVariantsRequest } from './types';

export const GetProductAttributes = ({ productId }: { productId: number }): AxiosPromise<ProductAttributes> =>
  http.request.get(`/product-attributes/${productId}`);

export const SaveProductVariants = ({
  productId,
  request
}: {
  productId: number;
  request: SaveVariantsRequest;
}): AxiosPromise<number[]> => http.request.put(`/seller/products/variants/${productId}`, request);
