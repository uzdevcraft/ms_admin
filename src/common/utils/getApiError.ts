import { get } from 'radash';

interface IError {
  code: string;
  message: string;
  validations: string[];
}

/** Backend errors come as `{ message: "..." }` or `{ message: ["...", "..."] }` (validation). */
const text = (value: unknown): string =>
  Array.isArray(value) ? value.filter(Boolean).join(', ') : String(value || '');

const getApiError = (error: unknown): IError => {
  const data = get(error, 'response.data') || {};
  const nestedError = get(data, 'error');
  const message = get(data, 'message');

  return {
    code: get(nestedError, 'code') || get(data, 'code') || '',
    message: get(nestedError, 'message') || get(data, 'errorMessage.0') || text(message) || '',
    validations: (get(data, 'errorMessage') || (Array.isArray(message) ? message : [])) as string[]
  };
};

export default getApiError;
