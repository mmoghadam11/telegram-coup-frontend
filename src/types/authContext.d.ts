import { ILoggedInUser } from "./user";
import {QueryFunction, QueryKey} from "@tanstack/react-query";

export type TAuthContext = {
  token: string;
  storeToken: (token: string) => void;
  storeRefreshToken: (refreshToken: string) => void;
  serverCallUpload: (params: TServerCall) => any;
  serverCallGetFile: (params: TServerCall) => any;
  serverCall: (params: TServerCall) => any;
  getRequest: ({ queryKey }: { queryKey: QueryFunction<unknown, QueryKey, any> }) => any;
  serverCallV2: (params: TServerCall) => any;
  getRequestV2: ({ queryKey }: { queryKey: QueryFunction<unknown, QueryKey, any> }) => any;
  getRequestDownloadFile: ({ queryKey }: { queryKey: QueryFunction<unknown, QueryKey, any> }) => any;
  isUserLoggedIn: boolean;
  logout: () => void;
  refreshToken: () => void;
  setUserInfo: (ILoggedInUser) => void;
  setContract: (firstName:any, lastName:any, fatherName:any, nationalCode:any,projectKey:any, previous_price:any, betaja_price:any, h_price:any, confirmChoiceDate:any, member_id: any, contract_number: any, master?: boolean, confirmSelection?: boolean, finalityOrder?: boolean, systemStep?: string) => void;
  isContractSet: () => boolean;
  userInfo: ILoggedInUser;
  // userAccess: any;
};

export type TServerCall = {
  entity: string | number | Array<string | number>;
  data?: any;
  method: THttpMethods;
  headers?:any;
  // method: AXIOS
};

export type THttpMethods = "get" | "post" | "delete" | "put";
