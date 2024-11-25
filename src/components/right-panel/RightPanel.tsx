import { Drawer, useTheme, Box, Button } from "@mui/material";

type RightPanelProps = {
  open: boolean;
  handleClose: () => void;
  children?: any;
  panelWidth?: string;
  panelHeight?: string;
};
export default function RightPanel({
  open,
  handleClose,
  children,
  panelWidth,
  panelHeight,
}: RightPanelProps) {
  const theme = useTheme();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", lg: panelWidth ?? "500px" },
          border: "none",
          backgroundColor: theme.palette.palette_style.background.default,
        },
      }}
    >
      {children}
    </Drawer>
  );
}
