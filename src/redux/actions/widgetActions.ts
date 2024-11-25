export const setIdItem = (idItem: string) => ({
  type: 'SET_ID_ITEM',
  payload: idItem
});

export const setIsAddOption = (isAddOption: boolean) => ({
  type: 'SET_IS_ADD_OPTION',
  payload: isAddOption
});

export const setIsWidget = (isWidget: any) => ({
  type: 'SET_IS_WIDGET',
  payload: isWidget
});

export const setInputLabel = (label: string) => ({
  type: 'SET_INPUT_LABEL',
  payload: label
});

export const setInputColor = (color: string) => ({
  type: 'SET_INPUT_COLOR',
  payload: color
});

export const setInputSize = (size: string) => ({
  type: 'SET_INPUT_SIZE',
  payload: size
});

export const setInputVariant = (variant: string) => ({
  type: 'SET_INPUT_VARIANT',
  payload: variant
});

export const setInputMargin = (margin: string) => ({
  type: 'SET_INPUT_MARGIN',
  payload: margin
});

export const setInputIsHideField = (isHideField: boolean) => ({
  type: 'SET_INPUT_ISHIDEFIELD',
  payload: isHideField
});

export const setInputFocused = (focused: boolean) => ({
  type: 'SET_INPUT_FOCUSED',
  payload: focused
});

export const setButtonText = (text: string) => ({
  type: 'SET_BUTTON_TEXT',
  payload: text
});

export const setButtonColor = (color: string) => ({
  type: 'SET_BUTTON_COLOR',
  payload: color
});

export const setButtonSize = (size: string) => ({
  type: 'SET_BUTTON_SIZE',
  payload: size
});

export const setButtonVariant = (variant: string) => ({
  type: 'SET_BUTTON_VARIANT',
  payload: variant
});

export const setButtonAlignment = (alignment: string) => ({
  type: 'SET_BUTTON_ALIGNMENT',
  payload: alignment
});

export const setRadioHide = (hide: boolean) => ({
  type: 'SET_RADIO_HIDE',
  payload: hide
});

export const setRadioTitle = (title: string) => ({
  type: 'SET_RADIO_TITLE',
  payload: title
});

export const setRadioRow = (row: boolean) => ({
  type: 'SET_RADIO_ROW',
  payload: row
});

export const setRadioColor = (color: string) => ({
  type: 'SET_RADIO_COLOR',
  payload: color
});

export const addRadioItem = (item: any) => ({
  type: 'ADD_RADIO_ITEMS',
  payload: item
});

export const updateRadioSettings = () => ({
  type: 'UPDATE_RADIO_SETTINGS'
});

export const setCheckboxHide = (hide: boolean) => ({
  type: 'SET_CHECKBOX_HIDE',
  payload: hide
});

export const setCheckboxTitle = (title: string) => ({
  type: 'SET_CHECKBOX_TITLE',
  payload: title
});

export const setCheckboxRow = (row: boolean) => ({
  type: 'SET_CHECKBOX_ROW',
  payload: row
});

export const setCheckboxColor = (color: string) => ({
  type: 'SET_CHECKBOX_COLOR',
  payload: color
});

export const addCheckboxItem = (item: any) => ({
  type: 'ADD_CHECKBOX_ITEMS',
  payload: item
});

export const updateCheckboxSettings = () => ({
  type: 'UPDATE_CHECKBOX_SETTINGS'
});

export const setSwitchLabel = (label: string) => ({
  type: 'SET_SWITCH_LABEL',
  payload: label
});

export const setSwitchColor = (color: string) => ({
  type: 'SET_SWITCH_COLOR',
  payload: color
});

export const setSwitchSize = (size: string) => ({
  type: 'SET_SWITCH_SIZE',
  payload: size
});

export const setSwitchIsHideField = (isHideField: boolean) => ({
  type: 'SET_SWITCH_ISHIDEFIELD',
  payload: isHideField
});

export const setSwitchAlignment = (alignment: string) => ({
  type: 'SET_SWITCH_ALIGNMENT',
  payload: alignment
});

export const setRadioItemIsChecked = (setting: any) => ({
  type: 'SET_RADIO_ITEM_ISCHECKED',
  payload: setting
});

export const removeRadioItem = (itemId: string) => ({
  type: 'REMOVE_RADIO_ITEM',
  payload: itemId
});

export const setCheckboxItemIsChecked = (setting: any) => ({
  type: 'SET_CHECKBOX_ITEM_ISCHECKED',
  payload: setting
});

export const removeCheckboxItem = (itemId: string) => ({
  type: 'REMOVE_CHECKBOX_ITEM',
  payload: itemId
});