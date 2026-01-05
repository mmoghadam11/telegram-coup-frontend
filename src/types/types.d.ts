import { GridSortDirection } from "@mui/x-data-grid";

export interface ISelectableItem<T> {
  mode: TCrudType;
  item?: T;
}

export type TCrudType = "CREATE" | "VIEW" | "EDIT";

// export interface IQueryParamFilter<T> extends T {}
// export interface IQueryParamFilter<T> extends T {
//   sortBy?: string; //keyof T;`${keyof T},${SortOrderEnum}`
//   sortDir?: GridSortDirection;
//   pageSize?: number;
//   currentPage?: number;
//   count?: number;
// }
export interface IQueryParamFilter<T> extends T {
  sortBy?: string; //keyof T;`${keyof T},${SortOrderEnum}`
  sortDir?: GridSortDirection;
  /**@description pageSize */
  size?: number;
  /**@description currentPage */
  page?: number;
  /**@description count */
  totalElements?: number;
}

export interface IBaseData {
  id: number;
  name: string;
  faName: string;
  enName: string;
}

export interface IQueryFilter {
  sortBy?: string;
  sortDir?: GridSortDirection;
  // pageSize?: number;
  // currentPage?: number;
  // count?: number;
  /**@description pageSize */
  size?: number;
  /**@description currentPage */
  page?: number;
  /**@description count */
  totalElements?: number;
}

export type PageableApiResponseDataType<ResponseType = any> = {
  rows: Array<ResponseType>;
  pageSize: number;
  count: number;
  currentPage: number;
  sortBy: string;
}

export type ApiResponse<ResponseType = any> = {
  data: ResponseType;
  status: number;
  message: string;
}

export type PageableApiResponse<ResponseType = any> = ApiResponse<PageableApiResponseDataType<ResponseType>>;
