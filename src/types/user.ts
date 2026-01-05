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
  userId:string;
  firstName: string;
  lastName: string;
  nationalCode:string;
  mobileNumber:string;
}
// export interface ILoggedInUser {
//   firstName: string;
//   lastName: string;
//   fatherName: string;
//   nationalCode: string;
//   projectKey :string;
//   previous_price: string;
//   betaja_price: string;
//   h_price: string;
//   confirmChoiceDate : string | null;
//   member_id: string | null;
//   contract_number: string | null;
//   master: boolean;
//   confirmSelection?: boolean;
//   finalityOrder?: boolean;
//   systemStep: string;
// }
