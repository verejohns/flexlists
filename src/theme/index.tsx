import { useMemo, useState, useEffect, createContext } from "react";
import { CssBaseline, Box } from "@mui/material";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  StyledEngineProvider
} from "@mui/material/styles";
import { palette_dark, palette_light } from "./palette";
import shadows from "./shadows";
import typography from "./typography";
import GlobalStyles from "./globalStyles";
import customShadows from "./customShadows";
import componentsOverride from "./overrides";
import { useRouter } from "next/router";
import {
  getAuthValidatePayLoad,
  getScreenModePayLoad,
  setCookieScreenMode,
} from "src/utils/cookieUtils";
import { getIsExistingFlow } from "src/utils/localStorage";

type ThemeProviderProps = {
  children: any;
};

type ThemeContextType = {
  enableThemeMode: (enable:boolean) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  enableThemeMode: (enable: boolean) => {},
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const router = useRouter();
  const [mode, setMode] = useState("light");
  const [windowWidth, setWindowWidth] = useState(0);
  const [isEnableThemeMode, setIsEnableThemeMode] = useState(true);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    setMode(getScreenModePayLoad());
  }, [router.pathname]);

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
    setCookieScreenMode(mode === "dark" ? "light" : "dark", {}, {});
  };

  const enableThemeMode = (enable: boolean) => {
    setIsEnableThemeMode(enable);
  };

  const themeOptions: any = useMemo(
    () => ({
      palette: {
        mode: mode,
        palette_style: mode === "light" ? palette_light : palette_dark,
      },
      shape: { borderRadius: 6 },
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
    }),
    [mode]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <ThemeContext.Provider value={{enableThemeMode, toggleTheme }}>
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
