import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

// SETUP COLORS
const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
};

const PRIMARY = {
  lighter: "#EDF6FE",
  light: "#76B0F1",
  main: "#54A6FB",
  dark: "#103996",
  darker: "#0A121C",
  contrastText: "#fff",
};

const SECONDARY = {
  lighter: "#D6E4FF",
  light: "#84A9FF",
  main: "#3366FF",
  dark: "#1939B7",
  darker: "#091A7A",
  contrastText: "#fff",
};

const INFO = {
  lighter: "#D0F2FF",
  light: "#74CAFF",
  main: "#1890FF",
  dark: "#0C53B7",
  darker: "#04297A",
  contrastText: "#fff",
};

const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#54D62C",
  dark: "#229A16",
  darker: "#08660D",
  contrastText: GREY[800],
};

const WARNING = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FFC107",
  dark: "#B78103",
  darker: "#7A4F01",
  contrastText: GREY[800],
};

const ERROR = {
  lighter: "#FFE7D9",
  light: "#FFA48D",
  main: "#FF4842",
  dark: "#B72136",
  darker: "#7A0C2E",
  contrastText: "#fff",
};

export const palette_dark = {
  common: { black: "#000", white: "#fff" },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: "#fafafa",
    secondary: GREY[600],
    disabled: GREY[500],
    selected: "#54A6FB",
    white: "#fff",
    black: "#111",
    renderFieldLabel: "rgba(255, 255, 255, 0.7)",
  },
  button: {
    main: PRIMARY.main,
    text: "#fff",
  },
  background: {
    paper: "#0b1621",
    default: "#112233",
    neutral: GREY[200],
    gap: "#f5f5f5",
    table_header_footer: "#0b1621",
    table_body: "#112233",
    add_view_btn: PRIMARY.main,
    add_view_btn_icon: "#fff",
    nav_icon: alpha(GREY[500], 0.08),
    selected: "#EEF7FF",
    calendarItem: "#54A6FB",
    cta_section: "#0b1621",
    mapPin: "#C92929",
  },
  border: {
    default: "rgba(255, 255, 255, 0.05)",
    HTMLeditor: "rgba(255, 255, 255, 0.23)",
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export const palette_light = {
  common: { black: "#000", white: "#fff" },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: "#666",
    secondary: GREY[600],
    disabled: GREY[500],
    selected: "#54A6FB",
    white: "#fff",
    black: "#111",
    renderFieldLabel: "rgba(0, 0, 0, 0.6)",
  },
  button: {
    main: PRIMARY.main,
  },
  background: {
    paper: "#fff",
    default: "#fff",
    neutral: GREY[200],
    gap: "#f5f5f5",
    table_header_footer: "#EDF2F5",
    table_body: "#fff",
    selected: "#EEF7FF",
    add_view_btn: PRIMARY.lighter,
    add_view_btn_icon: PRIMARY.main,
    nav_icon: PRIMARY.lighter,
    calendarItem: "#54A6FB",
    cta_section: PRIMARY.main,
    mapPin: "#C92929",
  },
  border: {
    default: "rgba(158, 158, 158, 0.32)",
    HTMLeditor: "#ccc",
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export const palette = {
  primary: "#000",
};
