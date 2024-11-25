import { createStore, applyMiddleware } from 'redux';
// Define the initial state
const initialState = {
  userProfile:undefined,
  userContacts:[],
  userSubscription:undefined
};
// Define the reducer
const userReducer = (state = initialState, action: any) => {
    switch (action.type) { 
      case 'SET_USER_PROFILE':
        return { ...state, userProfile: action.payload };
      case 'SET_USER_CONTACTS':
        return { ...state, userContacts: action.payload };
      case 'SET_USER_SUBSCRIPTION':
        return { ...state, userSubscription: action.payload };
      default:
        return state;
    }
  };
export default userReducer