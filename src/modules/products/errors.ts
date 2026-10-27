/** Which follow-up request failed after the product itself was saved. */
export type SaveStage = 'variants' | 'specs';

/**
 * The product was saved, but `PUT /seller/products/variants/{id}` or
 * `PUT /seller/products/specs/{id}` failed. Carries the product id so the page
 * can open the saved product instead of letting the user create it again.
 */
export class PartialSaveError extends Error {
  readonly productId: number;
  readonly stage: SaveStage;

  constructor(productId: number, stage: SaveStage, cause: unknown) {
    super(`Product saved, ${stage} were not`, { cause });
    this.name = 'PartialSaveError';
    this.productId = productId;
    this.stage = stage;
  }
}

export const isPartialSaveError = (error: unknown): error is PartialSaveError => error instanceof PartialSaveError;
