export enum Ecolor {
  primary = "primary",
  secondary = "secondary",
  success = "success",
  error = "error",
  warning = "warning",
}

export interface IRadioSettings {
  label: string;
  value: string;
  id: string;
  isChecked: boolean;
}

export interface ICheckboxSettings {
  label: string;
  value: string;
  id: string;
  isChecked: boolean;
}

export interface IInputSettingState {
  [key: string | number]: {
    label: string;
    color: Ecolor;
    size: string;
    variant: string;
    margin: string;
    isHideField: boolean;
    focused: boolean;
  };
}

export interface IButtonSettingState {
  [key: string | number]: {
    text: string;
    color: Ecolor;
    size: string;
    variant: string;
    alignment: string;
  };
}

export interface IRadioSettingState {
  [key: string | number]: {
    info: {
      title: string;
      isHideField: boolean;
      isRow: boolean;
      color: Ecolor;
    };
    items: IRadioSettings[];
  };
}

export interface ICheckboxSettingState {
  [key: string | number]: {
    info: {
      title: string;
      isHideField: boolean;
      isRow: boolean;
      color: Ecolor;
    };
    items: ICheckboxSettings[];
  };
}

export interface ISwitchSettingState {
  [key: string | number]: {
    color: Ecolor;
    isHideField: boolean;
    label: string;
    size: string;
    alignment: string;
  };
}

const initialState = {
  openWidget: false,
  idItem: "0",
  isAddOption: false,
  isWidget: {
    isWidgetInput: false,
    isWidgetButton: false,
    isWidgetTextArea: false,
    isWidgetRadio: false,
    isWidgetCheckbox: false,
    isWidgetSlider: false,
    isWidgetSwitch: false,
  },
  input: {
    [0]: {
      label: "secondary",
      color: "primary",
      size: "medium",
      variant: "outlined",
      margin: "none",
      isHideField: false,
      focused: true,
    }
  } as IInputSettingState,
  button: {
    [0]: {
      text: "Submit",
      color: "primary",
      size: "medium",
      variant: "contained",
      alignment: "flex-end"
    }
  } as IButtonSettingState,
  radio: {
    [0]: {
      info: {
        title: "Type a question",
        isHideField: false,
        isRow: false,
        color: "primary",
      },
      items: [
        {
          id: "01",
          value: "female",
          label: "Female",
          isChecked: true,
        },
        {
          id: "02",
          value: "male",
          label: "Male",
          isChecked: false,
        },
        {
          id: "03",
          value: "other",
          label: "Other",
          isChecked: false,
        },
      ]
    }
  } as IRadioSettingState,
  checkbox: {
    [0]: {
      info: {
        title: "Type a question",
        isHideField: false,
        isRow: false,
        color: "primary",
      },
      items: [
        {
          id: "01",
          value: "female",
          label: "Female",
          isChecked: true,
        },
        {
          id: "02",
          value: "male",
          label: "Male",
          isChecked: true,
        },
        {
          id: "03",
          value: "other",
          label: "Other",
          isChecked: false,
        },
      ],
    }
  } as ICheckboxSettingState,
  switch: {
    [0]: {
      label: "Label",
      color: "primary",
      size: "small",
      isHideField: false,
      alignment: "flex-start",
    }
  } as ISwitchSettingState
};

const widgetReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_ID_ITEM':
      return { ...state, idItem: action.payload };
    case 'SET_IS_ADD_OPTION':
      return { ...state, isAddOption: action.payload };
    case 'SET_IS_WIDGET':
      return { ...state, isWidget: action.payload };
    case 'SET_INPUT_LABEL':
      return { ...state, input: {...state.input, [state.idItem || 0]: {
        ...state.input[0],
        ...state.input[state.idItem],
        label: action.payload,
      }} };
    case 'SET_INPUT_COLOR':
      return { ...state, input: {...state.input, [state.idItem || 0]: {
        ...state.input[0],
        ...state.input[state.idItem],
        color: action.payload,
      }} };
    case 'SET_INPUT_SIZE':
      return { ...state, input: {...state.input, [state.idItem || 0]: {
        ...state.input[0],
        ...state.input[state.idItem],
        size: action.payload,
      }} };
    case 'SET_INPUT_VARIANT':
      return { ...state, input: {...state.input, [state.idItem || 0]: {
        ...state.input[0],
        ...state.input[state.idItem],
        variant: action.payload,
      }} };
    case 'SET_INPUT_MARGIN':
      return { ...state, input: {...state.input, [state.idItem || 0]: {
        ...state.input[0],
        ...state.input[state.idItem],
        margin: action.payload,
      }} };
    case 'SET_INPUT_ISHIDEFIELD':
      return { ...state, input: {...state.input, [state.idItem || 0]: {
        ...state.input[0],
        ...state.input[state.idItem],
        isHideField: action.payload,
      }} };
    case 'SET_INPUT_FOCUSED':
      return { ...state, input: {...state.input, [state.idItem || 0]: {
        ...state.input[0],
        ...state.input[state.idItem],
        focused: action.payload,
      }} };
    case 'SET_BUTTON_TEXT':
      return { ...state, button: {...state.button, [state.idItem || 0]: {
        ...state.button[0],
        ...state.button[state.idItem],
        text: action.payload,
      }} };
    case 'SET_BUTTON_COLOR':
      return { ...state, button: {...state.button, [state.idItem || 0]: {
        ...state.button[0],
        ...state.button[state.idItem],
        color: action.payload,
      }} };
    case 'SET_BUTTON_SIZE':
      return { ...state, button: {...state.button, [state.idItem || 0]: {
        ...state.button[0],
        ...state.button[state.idItem],
        size: action.payload,
      }} };
    case 'SET_BUTTON_VARIANT':
      return { ...state, button: {...state.button, [state.idItem || 0]: {
        ...state.button[0],
        ...state.button[state.idItem],
        variant: action.payload,
      }} };
    case 'SET_BUTTON_ALIGNMENT':
      return { ...state, button: {...state.button, [state.idItem || 0]: {
        ...state.button[0],
        ...state.button[state.idItem],
        alignment: action.payload,
      }} };
    case 'SET_RADIO_HIDE':
      return { ...state, radio: {...state.radio, [state.idItem || 0]: {
        ...state.radio[0],
        ...state.radio[state.idItem],
        info: {
          ...state.radio[state.idItem || 0].info,
          isHideField: action.payload
        }
      }} };
    case 'SET_RADIO_TITLE':
      return { ...state, radio: {...state.radio, [state.idItem || 0]: {
        ...state.radio[0],
        ...state.radio[state.idItem],
        info: {
          ...state.radio[state.idItem || 0].info,
          title: action.payload
        }
      }} };
    case 'SET_RADIO_ROW':
      return { ...state, radio: {...state.radio, [state.idItem || 0]: {
        ...state.radio[0],
        ...state.radio[state.idItem],
        info: {
          ...state.radio[state.idItem || 0].info,
          isRow: action.payload
        }
      }} };
    case 'SET_RADIO_COLOR':
      return { ...state, radio: {...state.radio, [state.idItem || 0]: {
        ...state.radio[0],
        ...state.radio[state.idItem],
        info: {
          ...state.radio[state.idItem || 0].info,
          color: action.payload
        }
      }} };
    case 'ADD_RADIO_ITEMS':
      return { ...state, radio: {...state.radio, [state.idItem || 0]: {
        ...state.radio[0],
        ...state.radio[state.idItem],
        items: [...state.radio[state.idItem || 0].items, action.payload]
      }} };
    case 'UPDATE_RADIO_SETTINGS':
      return { ...state, radio: {...state.radio, [state.idItem]: {
        info: state.radio[0].info,
        items: state.radio[0].items,
      }} };
    case 'SET_CHECKBOX_HIDE':
      return { ...state, checkbox: {...state.checkbox, [state.idItem || 0]: {
        ...state.checkbox[0],
        ...state.checkbox[state.idItem],
        info: {
          ...state.checkbox[state.idItem || 0].info,
          isHideField: action.payload
        }
      }} };
    case 'SET_CHECKBOX_TITLE':
      return { ...state, checkbox: {...state.checkbox, [state.idItem || 0]: {
        ...state.checkbox[0],
        ...state.checkbox[state.idItem],
        info: {
          ...state.checkbox[state.idItem || 0].info,
          title: action.payload
        }
      }} };
    case 'SET_CHECKBOX_ROW':
      return { ...state, checkbox: {...state.checkbox, [state.idItem || 0]: {
        ...state.checkbox[0],
        ...state.checkbox[state.idItem],
        info: {
          ...state.checkbox[state.idItem || 0].info,
          isRow: action.payload
        }
      }} };
    case 'SET_CHECKBOX_COLOR':
      return { ...state, checkbox: {...state.checkbox, [state.idItem || 0]: {
        ...state.checkbox[0],
        ...state.checkbox[state.idItem],
        info: {
          ...state.checkbox[state.idItem || 0].info,
          color: action.payload
        }
      }} };
    case 'ADD_CHECKBOX_ITEMS':
      return { ...state, checkbox: {...state.checkbox, [state.idItem || 0]: {
        ...state.checkbox[0],
        ...state.checkbox[state.idItem],
        items: [...state.checkbox[state.idItem || 0].items, action.payload]
      }} };
    case 'UPDATE_CHECKBOX_SETTINGS':
      return { ...state, checkbox: {...state.checkbox, [state.idItem]: {
        info: state.checkbox[0].info,
        items: state.checkbox[0].items,
      }} };
    case 'SET_SWITCH_LABEL':
      return { ...state, switch: {...state.switch, [state.idItem || 0]: {
        ...state.switch[0],
        ...state.switch[state.idItem],
        label: action.payload,
      }} };
    case 'SET_SWITCH_COLOR':
      return { ...state, switch: {...state.switch, [state.idItem || 0]: {
        ...state.switch[0],
        ...state.switch[state.idItem],
        color: action.payload,
      }} };
    case 'SET_SWITCH_SIZE':
      return { ...state, switch: {...state.switch, [state.idItem || 0]: {
        ...state.switch[0],
        ...state.switch[state.idItem],
        size: action.payload,
      }} };
    case 'SET_SWITCH_ISHIDEFIELD':
      return { ...state, switch: {...state.switch, [state.idItem || 0]: {
        ...state.switch[0],
        ...state.switch[state.idItem],
        isHideField: action.payload,
      }} };
    case 'SET_SWITCH_ALIGNMENT':
      return { ...state, switch: {...state.switch, [state.idItem || 0]: {
        ...state.switch[0],
        ...state.switch[state.idItem],
        alignment: action.payload,
      }} };
    case 'SET_RADIO_ITEM_ISCHECKED':
      return { ...state, radio: {...state.radio, [state.idItem]: {
        ...state.radio[state.idItem],
        items: [
          ...state.radio[state.idItem].items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  isChecked: action.payload.isChecked,
                }
              : { ...item, isChecked: false }
          ),
        ]
      }} };
    case 'REMOVE_RADIO_ITEM':
      return { ...state, radio: {...state.radio, [state.idItem]: {
        ...state.radio[state.idItem],
        items: [
          ...state.radio[state.idItem].items.filter(
            (item) => item.id !== action.payload
          ),
        ]
      }} };
    case 'SET_CHECKBOX_ITEM_ISCHECKED':
      return { ...state, checkbox: {...state.checkbox, [state.idItem]: {
        ...state.checkbox[state.idItem],
        items: [
          ...state.checkbox[state.idItem].items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  isChecked: action.payload.isChecked,
                }
              : item
          ),
        ]
      }} };
    case 'REMOVE_CHECKBOX_ITEM':
      return { ...state, checkbox: {...state.checkbox, [state.idItem]: {
        ...state.checkbox[state.idItem],
        items: [
          ...state.checkbox[state.idItem].items.filter(
            (item) => item.id !== action.payload
          ),
        ]
      }} };

    default:
      return state;
  }
};

export default widgetReducer;