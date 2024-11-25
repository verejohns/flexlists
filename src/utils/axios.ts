import axios from "axios";
import {
  setApiResponseStatus,
  setApiUrlsLoading,
  setLoading,
} from "src/redux/actions/adminAction";
import store from "src/redux/store";
import { PATH_ADMIN_API, PATH_API, PATH_AUTH_API } from "src/routes/paths";
import { FlexlistsError, Errors, isErr } from "./responses";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";

import { axios as axiosExtern } from "flexlists-api";

export function init() {
  // console.log("------------------init axios------------------");
  axiosExtern.initAxios(
    process.env.NEXT_PUBLIC_FLEXLIST_API_URL,
    process.env.NEXT_PUBLIC_FLEXLIST_API_URL_SSR ??
      process.env.NEXT_PUBLIC_FLEXLIST_API_URL,
    process.env.NEXT_PUBLIC_FLEXLIST_NOT_REDIRECT_500_ERROR,
    store,
    setLoading,
    setApiLoading,
    setApiResponseStatus,
    true
  );
}
export function setApiLoading(url: string, isLoading: boolean) {
  let state = store.getState();
  let apiUrlsLoading = state.admin.apiUrlsLoading;
  const expireTime = new Date();
  expireTime.setSeconds(expireTime.getSeconds() + 5);
  if (isLoading) {
    let existingApiUrl = apiUrlsLoading.find((x: any) => x.url === url);
    if (!existingApiUrl) {
      apiUrlsLoading.push({
        url: url,
        expireTime: expireTime,
      });
    } else {
      existingApiUrl.expireTime = expireTime;
    }
  } else {
    apiUrlsLoading = apiUrlsLoading.filter((x: any) => x.url !== url);
  }
  store.dispatch(
    setApiUrlsLoading(
      apiUrlsLoading.filter((x: any) => x.expireTime > new Date())
    )
  );
}

// // ----------------------------------------------------------------------
// const ignore = [
//   PATH_AUTH_API.verifyToken,
//   PATH_AUTH_API.resendSignupEmail,
//   PATH_AUTH_API.verifySignup,
//   PATH_AUTH_API.verifyPasswordChange,
//   PATH_AUTH_API.forgotPassword,
//   PATH_AUTH_API.resetPassword,
//   PATH_AUTH_API.registerExisting,
//   PATH_AUTH_API.loginExisting,
//   PATH_ADMIN_API.getLanguages,
//   PATH_ADMIN_API.getSearchTypes,
// ];
// const loadingApisIgnore = [
//   PATH_API.getViewChat,
//   PATH_API.getContentChat,
//   PATH_API.getSupportTicket,
//   PATH_API.getSupportOnlinestatus,
// ];
// const loadingIgnore = ["/"];
// const axiosInstance = axios.create({
//   withCredentials: true,
//   baseURL: process.env.NEXT_PUBLIC_FLEXLIST_API_URL,
// });
// const axiosSSRInstance = axios.create({
//   withCredentials: true,
//   baseURL:
//     process.env.NEXT_PUBLIC_FLEXLIST_API_URL_SSR ??
//     process.env.NEXT_PUBLIC_FLEXLIST_API_URL,
// });

// const onServer = typeof window === "undefined";

// axiosInstance.interceptors.request.use(function (config) {
//   const url = config.url;
//   if (
//     !onServer &&
//     !loadingIgnore.some((path: string) => window.location?.pathname === path) &&
//     url &&
//     !loadingApisIgnore.some((path: string) => url.indexOf(path) > -1)
//   ) {
//     store.dispatch(setLoading(true));
//   }

//   return config;
// });
// axiosInstance.interceptors.response.use(
//   async (response) => {
//     if (!onServer) store.dispatch(setLoading(false));
//     // if(!onServer && response && response.data && isErr(response.data))
//     // {
//     //   new FlexlistsError(`Error code - ${response.data.code},message:${response.data?.message},error : ${response.data ? JSON.stringify(response.data,null,2):''}`, response.data.code)
//     // }
//     if (response && response.data && response.data.code === 999) {
//       response.data.message = "Unknown Error, please try again.";
//     }
//     if (!onServer && response && response.data && response.data.code === 401) {
//       const url = response?.config?.url;
//       if (url && !ignore.some((path: string) => url.indexOf(path) > -1)) {
//         // window.location.href = PATH_AUTH.login
//         store.dispatch(setApiResponseStatus(ApiResponseStatus.Unauthorized));
//       }
//     }
//     if (!onServer && response && response.data && response.data.code === 500) {
//       const url = response?.config?.url;
//       if (url && !ignore.some((path: string) => url.indexOf(path) > -1)) {
//         window.location.href = `/500?key=${response?.data?.errorKey ?? ""}`;
//         // new FlexlistsError('Unknown Error, please try again.', Errors.UnknownError, response.data.data)
//         return response;
//       }
//     }
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (!onServer) store.dispatch(setLoading(false));
//     // if(!onServer && error && error.response)
//     // {
//     //   new FlexlistsError(`Unknown Error-${error?.response?.status},error : ${error?.response?.data ? JSON.stringify(error?.response?.data,null,2):error?.response?.statusText}`, Errors.UnknownError, error)
//     // }
//     if (
//       !onServer &&
//       (!error.response ||
//         (error.response.status === 500 &&
//           !ignore.some(
//             (path: string) => originalRequest.url?.indexOf(path) > -1
//           )))
//     ) {
//       window.location.href = `/500?key=${
//         error?.response?.data?.errorKey ?? ""
//       }`;
//       // new FlexlistsError('Unknown Error, please try again.', Errors.UnknownError, error.response?.data)
//       return await Promise.reject(error);
//     }
//     if (
//       !onServer &&
//       error.response.status === 401 &&
//       !ignore.some((path: string) => originalRequest.url?.indexOf(path) > -1)
//     ) {
//       store.dispatch(setApiResponseStatus(ApiResponseStatus.Unauthorized));
//       // window.location.href = PATH_AUTH.login//'/auth/login';
//       return await Promise.reject(error);
//     }
//     if (
//       !onServer &&
//       error.response &&
//       error.response.status !== 500 &&
//       error.response.status !== 401 &&
//       error.response.status !== 200
//     ) {
//       return await Promise.resolve({
//         data: {
//           isSuccess: false,
//           code: error.response.data?.code ?? error.response.status,
//           message:
//             error.response.data?.message ??
//             `Unknown Error(${error.response.status}), please try again.`,
//           data: error.response.data?.data,
//         },
//       });
//     }
//     return await Promise.resolve(error.response);
//     //return Promise.reject((error.response && error.response.data) || 'Something went wrong')
//   }
// );

// axiosSSRInstance.interceptors.request.use(function (config) {
//   if (
//     !onServer &&
//     !loadingIgnore.some((path: string) => window.location?.pathname === path)
//   ) {
//     store.dispatch(setLoading(true));
//   }

//   return config;
// });
// axiosSSRInstance.interceptors.response.use(
//   async (response) => {
//     if (!onServer) store.dispatch(setLoading(false));
//     if (response && response.data && response.data.code === 999) {
//       response.data.message = "Unknown Error, please try again.";
//     }
//     if (!onServer && response && response.data && response.data.code === 401) {
//       const url = response?.config?.url;
//       if (url && !ignore.some((path: string) => url.indexOf(path) > -1)) {
//         // window.location.href = PATH_AUTH.login
//         store.dispatch(setApiResponseStatus(ApiResponseStatus.Unauthorized));
//       }
//     }
//     if (!onServer && response && response.data && response.data.code === 500) {
//       const url = response?.config?.url;
//       if (url && !ignore.some((path: string) => url.indexOf(path) > -1)) {
//         window.location.href = "/500";
//         new FlexlistsError(
//           "Unknown Error, please try again.",
//           Errors.UnknownError,
//           response.data.data
//         );
//         return response;
//       }
//     }
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (!onServer) store.dispatch(setLoading(false));
//     if (
//       !onServer &&
//       (!error.response ||
//         (error.response.status === 500 &&
//           !ignore.some(
//             (path: string) => originalRequest.url?.indexOf(path) > -1
//           )))
//     ) {
//       window.location.href = "/500";
//       new FlexlistsError(
//         "Unknown Error, please try again.",
//         Errors.UnknownError,
//         error.response?.data
//       );
//       return await Promise.reject(error);
//     }
//     if (
//       !onServer &&
//       error.response.status === 401 &&
//       !ignore.some((path: string) => originalRequest.url?.indexOf(path) > -1)
//     ) {
//       // window.location.href = PATH_AUTH.login//'/auth/login';
//       store.dispatch(setApiResponseStatus(ApiResponseStatus.Unauthorized));
//       return await Promise.reject(error);
//     }

//     return await Promise.resolve(error.response);
//     //return Promise.reject((error.response && error.response.data) || 'Something went wrong')
//   }
// );

// async function get<T>(url: string, params?: any, ssr = false) {
//   try {
//     return await (ssr ? axiosSSRInstance : axiosInstance).get<T>(url, params);
//   } catch (e: any) {
//     if (!onServer) store.dispatch(setLoading(false));
//     // console.log(e)
//     return {
//       data: {
//         code: e.code ?? 999,
//         isSuccess: e.isSuccess ?? false,
//         message: e.message ?? "Unknown Error, please try again.",
//         data: e.data ?? e,
//       },
//     };
//   }
// }

// async function post<T>(url: string, data?: any, config?: any, ssr = false) {
//   try {
//     return await (ssr ? axiosSSRInstance : axiosInstance).post<T>(
//       url,
//       data,
//       config
//     );
//   } catch (e: any) {
//     if (!onServer) store.dispatch(setLoading(false));
//     // console.log(e)
//     return {
//       data: {
//         code: e.code ?? 999,
//         isSuccess: e.isSuccess ?? false,
//         message: e.message ?? "Unknown Error, please try again.",
//         data: e.data ?? e,
//       },
//     };
//   }
// }

// async function axiosDelete<T>(url: string, params?: any, ssr = false) {
//   try {
//     return await (ssr ? axiosSSRInstance : axiosInstance).delete<T>(url, {
//       params,
//     });
//   } catch (e: any) {
//     if (!onServer) store.dispatch(setLoading(false));
//     return {
//       data: {
//         code: e.code ?? 999,
//         isSuccess: e.isSuccess ?? false,
//         message: e.message ?? "Unknown Error, please try again.",
//         data: e.data ?? e,
//       },
//     };
//   }
// }

export default {
  get: axiosExtern.default.get,
  post: axiosExtern.default.post,
  delete: axiosExtern.default.delete,
};
