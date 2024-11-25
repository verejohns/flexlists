// Define the initial state
const initialState = {
  currentView: undefined,
  users: [],
  allUsers: [],
  viewGroups: [],
  columns: [],
  // page:undefined,
  // limit:undefined,
  // filters: [
  // ],
  // sorts: [
  // ],
  rows: [],
  count: 0,
  availableFieldUiTypes: [],
  message: {},
  viewTemplate: {},
  defaultPreset: {},
  readContents: [],
  currentListViews: [],
  filterChanged: false,
  sortChanged: false,
  queryChanged: false,
  fieldChanged: false,
  limitChanged: false,
};
const viewReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_CURRENT_VIEW":
      return { ...state, currentView: action.payload };
    case "SET_VIEW_USERS":
      return { ...state, users: action.payload };
    case "SET_ALL_VIEW_USERS":
      return { ...state, allUsers: action.payload };
    case "SET_VIEW_GROUPS":
      return { ...state, viewGroups: action.payload };
    case "SET_COLUMNS":
      return { ...state, columns: action.payload };
    // case 'SET_FILTERS':
    //   return { ...state, filters: action.payload };
    // case 'SET_SORTS':
    //   return { ...state, sorts: action.payload };
    case "SET_ROWS":
      return { ...state, rows: action.payload };
    // case 'SET_PAGE':
    //   return { ...state, page: action.payload };
    // case 'SET_LIMIT':
    //   return { ...state, limit: action.payload };
    case "SET_COUNT":
      return { ...state, count: action.payload };
    case "SET_AVAILABLE_FIELD_UI_TYPES":
      return { ...state, availableFieldUiTypes: action.payload };
    case "SET_MESSAGE":
      //console.log('message', action.payload, state)
      return { ...state, message: action.payload };
    case "SET_VIEW_TEMPLATE":
      return { ...state, viewTemplate: action.payload };
    case "SET_DEFAULT_PRESET":
      return { ...state, defaultPreset: action.payload };
    case "SET_READ_CONTENTS":
      return { ...state, readContents: action.payload };
    case "SET_CURRENT_LIST_VIEWS":
      return { ...state, currentListViews: action.payload };
    case "SET_FILTER_CHANGED":
      return { ...state, filterChanged: action.payload };
    case "SET_SORT_CHANGED":
      return { ...state, sortChanged: action.payload };
    case "SET_QUERY_CHANGED":
      return { ...state, queryChanged: action.payload };
    case "SET_FIELD_CHANGED":
      return { ...state, fieldChanged: action.payload };
    case "SET_LIMIT_CHANGED":
      return { ...state, limitChanged: action.payload };
    default:
      return state;
  }
};
export default viewReducer;
