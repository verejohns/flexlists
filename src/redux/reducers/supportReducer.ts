import { createStore, applyMiddleware } from 'redux';

const initialState = {
  tickets: []
};

const supportReducer = (state = initialState, action: any) => {
    switch (action.type) { 
      case 'SET_SUPPORT_TICKETS':
        return { ...state, tickets: action.payload };

      default:
        return state;
    }
  };
export default supportReducer