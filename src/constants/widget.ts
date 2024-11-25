export const WIDGETITEMS = "widgetItems";
export const WIDGETLAYOUTS = "widgetLayouts";
export const LAYOUTS = "layouts";
export const APPID = "appId";
export const TOKEN = "token";

export const drawerWidthLeft = "230";
export const drawerWidthRight = "450";

export interface IWidgetConfig {
  i?: string | undefined;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number | undefined;
  minH?: number | undefined;
}

export interface INewWidgetConfig {
  w: number;
  h: number;
  minH?: number;
}

export interface IWidget extends INewWidget {
  id: string;
  name: string;
  description?: any;
  config: IWidgetConfig;
}
export interface IWidgetModal {
  id: string;
  name: string;
  description?: any;
}
export interface INewWidget {
  name: string;
  description?: string;
  isWidget: {
    [t: string]: boolean | undefined;
  };
  config: INewWidgetConfig;
}
export const NewWidgetConfig: IWidgetConfig = {
  x: 0,
  y: 0,
  w: 1,
  h: 1,
  minW: 1,
  minH: 1,
};
export interface IWidgetConfig {
  i?: string | undefined;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number | undefined;
  minH?: number | undefined;
}
export interface IWidgetSettings {
  item: IWidget;
}

export const widgetsNew: INewWidget[] = [
  {
    name: "Input",
    isWidget: { isWidgetInput: true },
    config: {
      w: 6,
      h: 1,
    },
  },
  {
    name: "TextArea",
    isWidget: { isWidgetTextArea: true },
    config: {
      w: 6,
      h: 2,
      minH: 2,
    },
  },
  {
    name: "Radio",
    isWidget: { isWidgetRadio: true },
    config: {
      w: 6,
      h: 2.8,
    },
  },
  {
    name: "Checkbox",
    isWidget: { isWidgetCheckbox: true },
    config: {
      w: 6,
      h: 2.8,
    },
  },
  {
    name: "Slider",
    isWidget: { isWidgetSlider: true },
    config: {
      w: 6,
      h: 1,
    },
  },
  {
    name: "Switch",
    isWidget: { isWidgetSwitch: true },
    config: {
      w: 2,
      h: 1,
    },
  },
  {
    name: "Button",
    isWidget: { isWidgetButton: true },
    config: {
      w: 2,
      h: 1,
    },
  },
];