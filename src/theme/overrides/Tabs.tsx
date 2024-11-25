// ----------------------------------------------------------------------

export default function Tabs(theme: any) {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#54A6FB",
            borderColor: "#54A6FB",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#54A6FB",
        },
      },
    },
  };
}
