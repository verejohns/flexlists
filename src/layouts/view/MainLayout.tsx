import { useState, ReactNode, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Header from "./header";
import Nav from "./nav";
import Footer from "./footer";
import { getAvailableFieldUiTypes } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { getLanguages, getSearchTypes } from "src/redux/actions/adminAction";
import { View } from "src/models/SharedModels";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";
import Error from "src/sections/Error";
import { fetchUserContacts } from "src/redux/actions/userActions";
import { TranslationText } from "src/models/SharedModels";
import LoadingPage from "src/pages/LoadingPage";

const APP_BAR_MOBILE = 48;
const APP_BAR_DESKTOP = 48;

const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100vh", //if everything is broken delete just letter s (100vh is correct)
  backgroundColor: theme.palette.palette_style.background.default,
  color: theme.palette.palette_style.text.primary,
  overflow: "hidden",
}));

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  paddingTop: APP_BAR_MOBILE,
  paddingBottom: 0,
  display: "flex",
  overflow: "hidden",
  height: "100%",
  [theme.breakpoints.up("md")]: {
    overflow: "hidden",
    height: "100%",
  },
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingBottom: 0,
    overflow: "hidden",
    height: "100%",
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
  translations: TranslationText[];
  children: ReactNode;
  removeFooter?: boolean;
  disableOverflow?: boolean;
  currentView: View;
  apiResponseStatus: ApiResponseStatus;
  getAvailableFieldUiTypes: () => void;
  getSearchTypes: () => void;
  fetchUserContacts: () => void;
  getLanguages: () => void;
};

const MainLayout = ({
  translations,
  children,
  removeFooter = false,
  disableOverflow = false,
  currentView,
  apiResponseStatus,
  getAvailableFieldUiTypes,
  getSearchTypes,
  fetchUserContacts,
  getLanguages,
}: MainLayoutProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      getAvailableFieldUiTypes();
      getSearchTypes();
      fetchUserContacts();
      getLanguages();
    }
  }, [router.isReady]);

  return apiResponseStatus === ApiResponseStatus.Success ? (
    <LoadingPage>
      <StyledRoot>
        <Header onOpenNav={() => setOpen(true)} translations={translations} />

        <Main sx={{ height: `${windowHeight - 40}px` }}>
          <Nav
            openNav={open}
            onCloseNav={() => setOpen(false)}
            translations={translations}
          />
          <Content theme={theme} disableOverflow={disableOverflow}>
            {children}
          </Content>
        </Main>
        {removeFooter == true && currentView && (
          <Footer translations={translations} />
        )}
      </StyledRoot>
    </LoadingPage>
  ) : (
    <>
      <Error errorStatus={apiResponseStatus} translations={translations} />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
  apiResponseStatus: state.admin.apiResponseStatus,
});

const mapDispatchToProps = {
  getAvailableFieldUiTypes,
  getSearchTypes,
  fetchUserContacts,
  getLanguages,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
