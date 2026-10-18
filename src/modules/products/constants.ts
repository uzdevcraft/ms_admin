import type * as Types from './types';

/** Used for profit previews when the category doesn't send its own commission. */
export const DEFAULT_COMMISSION_PERCENT = 12;

export const STATUS = {
  draft: 'DRAFT',
  review: 'PENDING_REVIEW',
  active: 'ACTIVE'
} as const satisfies Record<string, Types.IEntity.Status>;

/** Form keys can't be bare numbers (react-hook-form would treat them as array indexes). */
export const specKey = (attributeDefinitionId: number) => `a${attributeDefinitionId}`;

export const attributeIdFromKey = (key: string) => Number(key.replace(/^a/, '')) || 0;
