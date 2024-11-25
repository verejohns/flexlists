import { ApiResponseStatus } from "src/enums/ApiResponseStatus";

// Define the initial state
const initialState = {
  searchTypes: [],
  isLoading: false,
  authValidate: {
    isUserValidated: false,
    isKeyValidated: false,
    user: undefined,
  },
  languages: [],
  apiResponseStatus: ApiResponseStatus.Success,
  returnUrl: undefined,
  apiUrlsLoading: [],
};
const adminReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_SEARCH_TYPES":
      return { ...state, searchTypes: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_API_URLS_LOADING":
      return { ...state, apiUrlsLoading: action.payload };
    case "SET_AUTH_VALIDATE":
      return { ...state, authValidate: action.payload };
    case "SET_LANGUAGES":
      return { ...state, languages: action.payload };
    case "SET_API_RESPONSE_STATUS":
      return { ...state, apiResponseStatus: action.payload };
    case "SET_RETURN_URL":
      return { ...state, returnUrl: action.payload };
    default:
      return state;
  }
};
export default adminReducer;
