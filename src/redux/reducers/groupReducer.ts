// Define the initial state
const initialState = {
  groups:[]
};
const groupReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_GROUPS':
        return { ...state, groups: action.payload }
      default:
        return state;
    }
  };
  export default groupReducer