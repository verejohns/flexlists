import { useState, useContext, useEffect } from "react";
import { Box } from "@mui/material";
import { ThemeContext } from "src/theme";
import { getScreenModePayLoad } from 'src/utils/cookieUtils';

export const ThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>();
  const { toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    setMode(getScreenModePayLoad());
  }, []);

  const handleMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
    toggleTheme();
  };
  
  return (
    <Box
      component="span"
      className="svg-color"
      sx={{
        width: 24,
        height: 24,
        backgroundImage:
          mode === "light"
            ? "url(/assets/icons/header/light.svg)"
            : "url(/assets/icons/header/dark.svg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        cursor: "pointer",
        transition: "top ease .25s",
        marginRight: 1
      }}
      onClick={handleMode}
    />
  );
};

export default ThemeMode;
