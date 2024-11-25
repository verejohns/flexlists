// Define the initial state
const initialState = {
  fields:[]
};
const listReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_FIELDS':
        return { ...state, fields: action.payload }
      default:
        return state;
    }
  };
  export default listReducer