import { ILoggedInUser } from "./user";
import {QueryFunction, QueryKey} from "@tanstack/react-query";

// export type TAuthContext = {
//   token: string;
//   storeToken: (token: string) => void;
//   storeRefreshToken: (refreshToken: string) => void;
//   serverCallUpload: (params: TServerCall) => any;
//   serverCallGetFile: (params: TServerCall) => any;
//   serverCall: (params: TServerCall) => any;
//   getRequest: ({ queryKey }: { queryKey: QueryFunction<unknown, QueryKey, any> }) => any;
//   serverCallV2: (params: TServerCall) => any;
//   getRequestV2: ({ queryKey }: { queryKey: QueryFunction<unknown, QueryKey, any> }) => any;
//   getRequestDownloadFile: ({ queryKey }: { queryKey: QueryFunction<unknown, QueryKey, any> }) => any;
//   isUserLoggedIn: boolean;
//   logout: () => void;
//   refreshToken: () => void;
//   setUserInfo: (ILoggedInUser) => void;
//   setContract: (first_name:any, last_name:any, fatherName:any, nationalCode:any,projectKey:any, previous_price:any, betaja_price:any, h_price:any, confirmChoiceDate:any, member_id: any, contract_number: any, master?: boolean, confirmSelection?: boolean, finalityOrder?: boolean, systemStep?: string) => void;
//   isContractSet: () => boolean;
//   userInfo: ILoggedInUser;
//   // userAccess: any;
// };
export interface TAuthContext {
  token: string | null;
  userInfo: {
    id: number;
    telegram_id: number;
    username?: string;
    first_name : string;
    last_name?: string;
    photo_url?: string;
  } | null;
  isUserLoggedIn: boolean;
  authLoading: boolean;
  authError: string | null;
  storeToken: (t: string) => void;
  setUserInfo: (u: any) => void;
  serverCall: (params: TServerCall) => Promise<any>;
  serverCallUpload: (params: TServerCall) => Promise<any>;
  serverCallGetFile: (params: TServerCall) => Promise<any>;
  getRequest: (params: { queryKey: string | Array<string | number> }) => Promise<any>;
  getRequestDownloadFile: (params: { queryKey: string | Array<string | number> }) => Promise<any>;
  logout: () => void;
}

export type TServerCall = {
  entity: string | number | Array<string | number>;
  data?: any;
  method: THttpMethods;
  headers?:any;
  // method: AXIOS
};

export type THttpMethods = "get" | "post" | "delete" | "put";
