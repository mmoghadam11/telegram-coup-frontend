import axios from "axios";

// export const BASE_URL = "http://192.168.1.149:8085/api/" || process.env.REACT_APP_API_URL;
export const BASE_URL = process.env.REACT_APP_API_URL || "https://coup-backend.mahdiyar-moghadam11.workers.dev";
export const BASE_URL_V2 = process.env.REACT_APP_API_URL || "https://coup-backend.mahdiyar-moghadam11.workers.dev" ;

export const api = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

export const apiV2 = axios.create({
  baseURL: BASE_URL_V2,
  headers: {
    "Content-Type": "application/json",
  },
});
export const apiUpload = axios.create({
  baseURL: BASE_URL,
});
