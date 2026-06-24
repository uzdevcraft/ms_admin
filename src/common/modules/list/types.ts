export declare namespace IApi {
  export interface Response<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  }

  export interface Request {
    page?: number;
    language?: string;
    region?: string;
  }
}

export declare namespace IEntity {
  export interface Meta {
    current: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  }

  export interface Params {
    page?: number;
    language?: string;
    region?: string;
  }
}
