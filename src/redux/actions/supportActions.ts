import { SupportTicket } from "src/models/Support";
import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { isSucc } from "src/models/ApiResponse";
import { supportService } from "flexlists-api";

export const fetchSupportTickets = (): ThunkAction<
  void,
  RootState,
  null,
  any
> => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const response = await supportService.getSupportTickets();

      if (isSucc(response)) {
        dispatch(setSupportTickets(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setSupportTickets = (tickets: SupportTicket[]) => ({
  type: "SET_SUPPORT_TICKETS",
  payload: tickets,
});
