import { styled } from "@mui/material/styles";
import { TableCell, tableCellClasses } from "@mui/material";
import Paper from "@mui/material/Paper";
import { drawerWidthLeft, drawerWidthRight } from "src/constants/widget";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
export const ItemBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 20,
  textAlign: "center",
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "openLeft" && prop !== "openRight",
})<{
  openLeft?: boolean;
  openRight?: boolean;
}>(({ theme, openLeft, openRight }) => ({
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `${drawerWidthLeft}px`,
  marginRight: `${drawerWidthRight}px`,

  ...(openRight && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),

  ...(openLeft && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
