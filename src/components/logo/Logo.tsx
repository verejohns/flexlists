import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";
import Image from "next/image";

// eslint-disable-next-line react/display-name
const Logo = React.forwardRef<any, BoxProps>(({ sx }, ref) => {
  const theme = useTheme();

  return (
    <Box ref={ref} sx={{ width: 44, height: 32, cursor: "pointer", ...sx }}>
      {theme.palette.mode === "light" ? (
      <Image src="/assets/logo.png" alt="logo" width={44} height={32} priority />
      ):(
      <Image src="/assets/logo_dark.png" alt="logo" width={44} height={32} priority />
      )}
    </Box>
  );
});

export default Logo;
