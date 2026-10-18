import { useMutation } from '@tanstack/react-query';
import { get } from 'radash';

import * as Api from '../api';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const extractUrl = (item: unknown): string =>
  typeof item === 'string'
    ? item
    : asString(get(item, 'url')) ||
      asString(get(item, 'fileUrl')) ||
      asString(get(item, 'path')) ||
      asString(get(item, 'link'));

/** Uploads several images in one request and returns their URLs in order. */
export const useUploadMultiple = () =>
  useMutation({
    mutationFn: async (files: File[]) => {
      const { data } = await Api.UploadMultiple(files);
      const items = Array.isArray(data) ? data : (get(data, 'data', get(data, 'urls', [])) as unknown[]);
      const urls = items.map(extractUrl).filter(Boolean);
      if (!urls.length) throw new Error('Upload did not return any URL');
      return urls;
    }
  });

export default useUploadMultiple;
