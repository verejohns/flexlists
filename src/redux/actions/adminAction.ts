import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import store, { RootState } from "../store";
import { isSucc } from "src/models/ApiResponse";
import { fieldService } from "flexlists-api";
import { configService } from "flexlists-api";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";
// Define the actions

export const getSearchTypes = (): ThunkAction<void, RootState, null, any> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      var state = store.getState();
      if (state.admin.searchTypes.length == 0) {
        const cachedSearchTypes = localStorage.getItem("searchTypes");
        if (cachedSearchTypes) {
          const _cachedSearchTypes = JSON.parse(cachedSearchTypes);
          if (
            new Date().getTime() -
              new Date(_cachedSearchTypes.created).getTime() <
            1000 * 60 * 60 * 24 // is enough? can be more even...
          ) {
            dispatch(setSearchTypes(_cachedSearchTypes.data as any));
            return;
          }
        }
        const response = await configService.getSearchTypes();
        if (isSucc(response) && response.data) {
          localStorage.setItem(
            "searchTypes",
            JSON.stringify({
              created: new Date(),
              data: response.data,
            })
          );
          dispatch(setSearchTypes(response.data));
        }
      }
    } catch (error) {
      console.log("Error in redux", window, error);
    }
  };
};
export const getLanguages = (): ThunkAction<void, RootState, null, any> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      var state = store.getState();
      if (state.admin.languages.length == 0) {
        // get this from localstorage; if not there, then get it from api
        const cachedLanguages = localStorage.getItem("getLanguages");
        if (cachedLanguages) {
          const _cachedLanguages = JSON.parse(cachedLanguages);
          if (
            new Date().getTime() -
              new Date(_cachedLanguages.created).getTime() <
            1000 * 60 * 60 * 24 // is enough? can be more even...
          ) {
            dispatch(setLanguages(_cachedLanguages.data as any));
            return;
          }
        }
        const response = await configService.getLanguages();
        if (isSucc(response) && response.data) {
          localStorage.setItem(
            "getLanguages",
            JSON.stringify({
              created: new Date(),
              data: response.data,
            })
          );
          dispatch(setLanguages(response.data));
        }
      }
    } catch (error) {
      console.log("Error in redux", window, error);
    }
  };
};
export const setSearchTypes = (searchTypes: any) => ({
  type: "SET_SEARCH_TYPES",
  payload: searchTypes,
});
export const setLoading = (isLoading: boolean) => ({
  type: "SET_LOADING",
  payload: isLoading,
});
export const setApiUrlsLoading = (
  payload: {
    url: string;
    expireTime: Date;
  }[]
) => ({
  type: "SET_API_URLS_LOADING",
  payload: payload,
});
export const setAuthValidate = (authValidate: any) => ({
  type: "SET_AUTH_VALIDATE",
  payload: authValidate,
});
export const setLanguages = (languages: any) => ({
  type: "SET_LANGUAGES",
  payload: languages,
});
export const setApiResponseStatus = (apiResponseStatus: ApiResponseStatus) => ({
  type: "SET_API_RESPONSE_STATUS",
  payload: apiResponseStatus,
});
export const setReturnUrl = (returnUrl: any) => ({
  type: "SET_RETURN_URL",
  payload: returnUrl,
});
