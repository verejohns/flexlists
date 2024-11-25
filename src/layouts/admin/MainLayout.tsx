import { useState, ReactNode, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Header from "./header";
import Nav from "./nav";
import { getAvailableFieldUiTypes } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { getSearchTypes } from "src/redux/actions/adminAction";
import { View } from "src/models/SharedModels";
import LoadingPage from "src/pages/LoadingPage";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";
import Error from "src/sections/Error";
import { UserProfile } from "src/models/UserProfile";

const APP_BAR_MOBILE = 48;
const APP_BAR_DESKTOP = 48;

const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: theme.palette.palette_style.background.default,
  color: theme.palette.palette_style.text.primary,
}));

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  paddingTop: APP_BAR_MOBILE,
  paddingBottom: 0,
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingBottom: 0,
  },
  display: "flex",
  // height: "calc(100% - 40px)",
  overflow: "hidden",
  [theme.breakpoints.up("md")]: {
    // height: "calc(100vh - 40px)",
  },
}));

const Content = styled("div")(
  ({ theme, disableOverflow }: { theme: any; disableOverflow: boolean }) => ({
    width: "100%",
    overflow: disableOverflow ? "hidden" : "auto",

    // [theme.breakpoints.up('lg')]: {
    //   paddingLeft: theme.spacing(1),
    //   paddingRight: theme.spacing(1),
    //   paddingBottom: theme.spacing(1)
    // },
    // paddingTop: theme.spacing(1)
  })
);

type MainLayoutProps = {
  children: ReactNode;
  removeFooter?: boolean;
  disableOverflow?: boolean;
  apiResponseStatus: ApiResponseStatus;
  userProfile: UserProfile | undefined;
};

const MainLayout = ({
  children,
  removeFooter = false,
  disableOverflow = false,
  apiResponseStatus,
  userProfile,
}: MainLayoutProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (router.isReady) {
      getAvailableFieldUiTypes();
      getSearchTypes();
    }
  }, [router.isReady]);
  return apiResponseStatus === ApiResponseStatus.Success ? (
    <LoadingPage>
      <StyledRoot>
        <Header onOpenNav={() => setOpen(true)} />
        <Main>
          <Nav openNav={open} onCloseNav={() => setOpen(false)} />
          {userProfile && (
            <Content theme={theme} disableOverflow={disableOverflow}>
              {children}
            </Content>
          )}
        </Main>
      </StyledRoot>
    </LoadingPage>
  ) : (
    <>
      <Error errorStatus={apiResponseStatus} translations={[]} />
    </>
  );
};
const mapStateToProps = (state: any) => ({
  apiResponseStatus: state.admin.apiResponseStatus,
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
