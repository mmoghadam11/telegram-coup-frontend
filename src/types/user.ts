import Gender from "./gender";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  startCreationTime: string;
  endCreationTime: string;
  personnelCode: string;
  nationalId: string;
  gender: Gender | undefined;
  branch: number | undefined;
  status: number | undefined;
  roles: number[] | undefined;
  activationDate: string;
  expireDate: string;
}

export interface IPaginationUser extends IUser {
  pageNo?: number;
  totalElements?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface ISelectedUser {
  mode: "edit" | "view" | "create";
  user?: IUser;
}

export interface ILoggedInUser {
  id:string;
  first_name: string;
  username:string;
  photo_url:string;
}

