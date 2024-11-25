import { UserProfile } from "src/models/UserProfile";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { isSucc } from "src/models/ApiResponse";
import { accountService } from "flexlists-api";
import { User } from "src/models/SharedModels";
import { SubscriptionDto } from "src/models/SubscriptionDto";
export const fetchUserContacts = (): ThunkAction<
  void,
  RootState,
  null,
  any
> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await accountService.getUserContacts();
      if (isSucc(response)) {
        dispatch(setUserContacts(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};
export const setUserProfile = (userProfile: UserProfile | undefined) => ({
  type: "SET_USER_PROFILE",
  payload: userProfile,
});
export const setUserContacts = (userContacts: User[]) => ({
  type: "SET_USER_CONTACTS",
  payload: userContacts,
});
export const setUserSubscription = (
  subscription: SubscriptionDto | undefined
) => ({
  type: "SET_USER_SUBSCRIPTION",
  payload: subscription,
});
