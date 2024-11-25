import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { isSucc } from "src/models/ApiResponse";
import { applicationService } from "flexlists-api";

export const fetchApplicationViews = (
  applicationId: number
): ThunkAction<void, RootState, null, any> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await applicationService.getApplicationViews(
        applicationId
      );

      if (isSucc(response)) {
        dispatch(setApplicationViews(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchApplicationKeys = (
  applicationId: number
): ThunkAction<void, RootState, null, any> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await applicationService.getApplicationKeys(
        applicationId
      );

      if (isSucc(response)) {
        dispatch(setApplicationKeys(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchApplicationRoles = (
  applicationId: number
): ThunkAction<void, RootState, null, any> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await applicationService.getApplicationRoles(
        applicationId
      );

      if (isSucc(response)) {
        dispatch(setApplicationRoles(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const fetchApplicationMenus = (
  applicationId: number
): ThunkAction<void, RootState, null, any> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await applicationService.getApplicationMenuPages(
        applicationId
      );

      if (isSucc(response)) {
        dispatch(setApplicationMenus(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setSelectedId = (selectedId: number) => ({
  type: "SET_SELECTED_ID",
  payload: selectedId,
});

export const setOpenPanel = (openPanel: boolean) => ({
  type: "SET_OPEN_PANEL",
  payload: openPanel,
});

export const toggleOpenWidget = () => ({
  type: "TOGGLE_OPEN_WIDGET",
});

export const setTab = (tab: number) => ({
  type: "SET_TAB",
  payload: tab,
});

export const setApplicationViews = (views: any[]) => ({
  type: "SET_APPLICATION_VIEWS",
  payload: views,
});

export const setApplicationKeys = (keys: any[]) => ({
  type: "SET_APPLICATION_KEYS",
  payload: keys,
});

export const setApplicationRoles = (roles: any[]) => ({
  type: "SET_APPLICATION_ROLES",
  payload: roles,
});

export const setApplicationMenus = (menus: any[]) => ({
  type: "SET_APPLICATION_MENUS",
  payload: menus,
});

export const setLayoutConfig = (layoutConfig: any) => ({
  type: "SET_LAYOUT_CONFIG",
  payload: layoutConfig,
});

export const setLayoutDialog = (layoutDialog: any) => ({
  type: "SET_LAYOUT_DIALOG",
  payload: layoutDialog,
});

export const setBreakpoint = (breakpoint: string) => ({
  type: "SET_BREAKPOINT",
  payload: breakpoint,
});
