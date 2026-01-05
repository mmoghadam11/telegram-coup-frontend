interface IServerResponseWithPagination<T> {
  content: T[];
  last: boolean;
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface IServerResponse<T> {
  code: number;
  message: string;
  result: IServerResponseWithPagination<T>;
}
