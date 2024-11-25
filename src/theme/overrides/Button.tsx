import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Button(theme: any) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeLarge: {
          height: 48,
        },
        containedInherit: {
          color: theme.palette.grey[800],
          boxShadow: "none",
          "&:hover": {
            backgroundColor: theme.palette.grey[900],
          },
        },
        containedPrimary: {
          backgroundColor: theme.palette.palette_style.button.main,
          color: theme.palette.palette_style.button.text,
          boxShadow: "none",
        },
        containedSecondary: {
          boxShadow: theme.customShadows.secondary,
        },
        outlinedPrimary: {
          color: "#54a6fb",
        },
        outlinedInherit: {
          border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
          color: "#54a6fb",

          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
        textInherit: {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
        textPrimary: {
          color: theme.palette.palette_style.primary.main,
        },
      },
    },
  };
}
