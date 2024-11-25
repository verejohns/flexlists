import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { isSucc } from "src/models/ApiResponse";
import { groupService } from "flexlists-api";
// Define the actions

export const fetchGroups = (): ThunkAction<void, RootState, null, any> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await groupService.getUserGroups();
      if (isSucc(response)) {
        dispatch(setGroups(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setGroups = (groups: any) => ({
  type: "SET_GROUPS",
  payload: groups,
});
