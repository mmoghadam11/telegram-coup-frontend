import {useCallback, useState} from "react";
import axios from "axios";
import {useErrorHandler} from "hooks/useErrorHandler";
import {paramsType, requestType} from "./types/useHttpRequestTypes";
import {useSnackbar} from "./useSnackbar";
import useSessionStorageState from "./useSessionStorage";

/**
 * @param {String} method Method type. GET, POST, PATCH, DELETE, PUT
 * @param {String} endpoint API endpoint
 * @param {Object} query Request pagination
 * @param {Object} data Request body. For post and patch request
 * @param {Object} headers request header
 * @param {Boolean} pagination request has a pagination
 */

export function useAxios() {
    const {setNotification} = useErrorHandler();
    const snackbar = useSnackbar();
    const [token, setToken] = useSessionStorageState("token");
    const [runningRequests, setRunningRequests] = useState([]);

    // @ts-ignore
    const removeRunningRequests = ({endpoint, method}) => {
        const runningRequestsArray = runningRequests.filter(
            item => item !== endpoint && item !== method,
        );
        setRunningRequests([...runningRequestsArray]);
    };

    const defaultSuccessFunction = (
        response: any,
        successFunction: any,
        method: string,
    ) => {
        if (successFunction) {
            successFunction(response.data);
        } else {
            if (method === "post")
                snackbar("داده با موفقیت ثبت شد.", "success");
            else if (method === "put")
                snackbar("داده با موفقیت ویرایش شد.", "success");
            else if (method === "delete")
                snackbar("داده با موفقیت حذف شد.", "success");
        }
    };

    const defaultErrorFunction = (error: any, errorFunction: any) => {
        if (errorFunction) {
            errorFunction(error);
        } else {
            if (error.response) {
                setNotification(error.response.status, error.response.message);
            } else {
                setNotification("failed", null);
            }
        }
        setRunningRequests([]);
    };
    let source = axios.CancelToken.source();

    const sendRequest = useCallback(
        async ({
                   method = "get",
                   endpoint,
                   query = null,
                   data = null,
                   headers = {},
                   successFunction = null,
                   errorFunction = null,
                   pagination = false,
                   CancelToken,
               }: {
            method: string;
            endpoint: string;
            query?: null | {
                page?: number | string;
                size?: number | string;
                sort?: string;
            };
            data?: null | {};
            headers: {};
            successFunction: any;
            errorFunction: any;
            pagination: boolean;
            CancelToken: any;
        }) => {
            const Authorization: boolean | string =
                endpoint === "login"
                    ? false
                    : `Bearer ${token}`;

            const requestHeader: {} = Authorization
                ? {
                    Authorization,
                    "Content-Type": "application/json",
                    ...headers,
                }
                : {
                    "Content-Type": "application/json",
                };

            const params: paramsType = {
                ...(pagination && {
                    page: query && query.page != null ? query.page : 1,
                    size: query && query.size != null ? query.size : 15,
                    sort: query && query.sort == null ? query.sort : "id",
                }),
                ...query,
            };

            const endpointUrl = (endpoint.startsWith('http') || endpoint.startsWith('https')) &&
            !endpoint.startsWith('/') ? endpoint : `${process.env.REACT_APP_BASE_URL}/api/${endpoint}`;

            const requestBody: requestType = {
                method: method,
                url: endpointUrl,
                headers: requestHeader,
                token: true,
                data: data,
                params,
                timeout: parseInt(process.env.REACT_APP_REQUEST_TIMEOUT as string),
                cancelToken: source.token,
            };

            // if (CancelToken) requestBody.cancelToken = source.token;

            // @ts-ignore
            setRunningRequests(preState => [
                ...preState,
                {
                    endpoint: endpoint.split("?")[0],
                    method: method,
                },
            ]);

            await axios(requestBody)
                .then(response => {
                    defaultSuccessFunction(response, successFunction, method);

                    // @ts-ignore
                    removeRunningRequests(endpoint, method);
                })
                .catch(error => {
                    defaultErrorFunction(error, errorFunction);
                });

            // source.cancel("canceled");
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [runningRequests],
    );

    return {sendRequest, runningRequests, source};
}
