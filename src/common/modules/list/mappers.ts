import { get } from 'radash';
import config from '@/config';
import * as Types from './types';

export const Meta = (item?: Types.IApi.Response<any>): Types.IEntity.Meta => ({
  current: get(item, 'page') || 1,
  perPage: get(item, 'results.length') || config.list.perPage,
  totalItems: get(item, 'total_results') || 0,
  totalPages: get(item, 'total_pages') || 0
});

export const Params = (params?: any): Types.IEntity.Params => ({
  page: get(params, 'page') || 1,
  language: get(params, 'language') || 'en-US',
  region: get(params, 'region')
});

export const Request = (params?: Types.IEntity.Params): Types.IApi.Request => ({
  page: params?.page || 1,
  language: params?.language || 'en-US',
  region: params?.region
});

// Har bir movie item'ini normalize qilish
export const Item = (item: any) => ({
  id: item.id,
  title: item.title || item.name,
  overview: item.overview,
  posterPath: item.poster_path,
  releaseDate: item.release_date || item.first_air_date,
  voteAverage: item.vote_average
});
