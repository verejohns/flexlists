const initialState = {
  selectedId: 0,
  openPanel: false,
  openWidget: false,
  tab: 3,
  views: [],
  keys: [],
  roles: [],
  menus: [],
  layoutConfig: {
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    i: 0,
  },
  layoutDialog: false,
  breakpoint: "768px"
};

const applicationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_SELECTED_ID':
      localStorage.setItem('SELECTED_ID', action.payload);
      return { ...state, selectedId: action.payload };
    case 'SET_OPEN_PANEL':
      return { ...state, openPanel: action.payload };
    case 'TOGGLE_OPEN_WIDGET':
      return { ...state, openWidget: !state.openWidget };
    case 'SET_TAB':
      return { ...state, tab: action.payload };
    case 'SET_APPLICATION_VIEWS':
      return { ...state, views: action.payload };
    case 'SET_APPLICATION_KEYS':
      return { ...state, keys: action.payload };
    case 'SET_APPLICATION_ROLES':
      return { ...state, roles: action.payload };
    case 'SET_APPLICATION_MENUS':
      return { ...state, menus: action.payload };
    case 'SET_LAYOUT_CONFIG':
      return { ...state, layoutConfig: action.payload };
    case 'SET_LAYOUT_DIALOG':
      return { ...state, layoutDialog: action.payload };
    case 'SET_BREAKPOINT':
      return { ...state, breakpoint: action.payload };

    default:
      return state;
  }
};

export default applicationReducer;