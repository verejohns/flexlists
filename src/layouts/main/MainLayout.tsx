import { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import MainNavbar from "./MainNavbar";
import { TranslationText } from "src/models/SharedModels";
import ChatPopover from "../ChatPopover";
import { AuthValidate } from "src/models/AuthValidate";
import { connect } from "react-redux";

const APP_BAR_MOBILE = 4;
const APP_BAR_DESKTOP = 32;

const StyledRoot = styled("div")({
  // display: 'flex',
  // minHeight: '100%',
  // overflow: 'hidden',
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "hidden",
  minHeight: "100%",
  backgroundColor:theme.palette.palette_style.background.default,
  // paddingTop: APP_BAR_MOBILE + 24,
  // paddingBottom: theme.spacing(10),
  position: "relative",
  [theme.breakpoints.up("lg")]: {
    // paddingTop: APP_BAR_DESKTOP + 24,
  },
}));

type MainLayoutProps = {
  children: ReactNode;
  translations: TranslationText[];
  authValidate: AuthValidate;
};

const MainLayout = ({
  children,
  translations,
  authValidate
}: MainLayoutProps) => {
  return (
    <StyledRoot>
      <MainNavbar translations={translations} />
      <Main>
        <div>{children}</div>
      </Main>
      {!authValidate?.isUserValidated && <ChatPopover translations={translations} />}
    </StyledRoot>
  );
};

const mapStateToProps = (state: any) => ({
  authValidate: state.admin.authValidate,
});

export default connect(mapStateToProps)(MainLayout);
