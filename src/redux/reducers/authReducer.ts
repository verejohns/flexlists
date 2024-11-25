import { LegacyCredentials } from "../actions/authAction";

// Define the initial state
const initialState = {
    message: {},
    legacyCredentials: {} as LegacyCredentials,
    flashMessage: {}
};
const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_MESSAGE':
            return { ...state, message: action.payload }
        case 'SET_FLASH_MESSAGE':
            return { ...state, flashMessage: action.payload }
        case 'SET_LEGACY_CREDENTIALS':
            return { ...state, legacyCredentials: action.payload as LegacyCredentials }
        default:
            return state;
    }
};
export default authReducer