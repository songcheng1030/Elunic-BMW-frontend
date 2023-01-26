export interface BaseDto {
  id: string;
}

export interface DataResponse<T> {
  data: T;
  meta: object;
}

export interface PagingResponseMeta {
  page: number;
  count: number;
  total: number;
  pageCount: number;
}

export type Sorting = [string, 'asc' | 'desc'];

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}
