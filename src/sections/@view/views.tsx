import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { useState, useEffect } from "react";
import ViewCard from "./ViewCard";
import { View } from "src/models/SharedModels";
import {
  FlexlistsError,
  FlexlistsSuccess,
  isSucc,
} from "src/models/ApiResponse";
import { useRouter } from "next/router";
import { PATH_MAIN } from "src/routes/paths";
import { listViewService } from "flexlists-api";
import { setCurrentView, setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { enabledViewCards } from "src/utils/flexlistHelper";

type ViewsProps = {
  translations: TranslationText[];
  isDefaultViews: boolean;
  isArchived: boolean;
  message: any;
  setMessage: (message: any) => void;
  setCurrentView: (view: View | undefined) => void;
};

const Views = ({
  translations,
  isArchived,
  message,
  setMessage,
  isDefaultViews,
  setCurrentView,
}: ViewsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState(0);
  const [visibleMask, setVisibleMask] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [views, setViews] = useState<View[]>([]);

  // error handling
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);

  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
    if (router.isReady) {
      setCurrentView(undefined);
    }
  }, [message, router.isReady]);

  const flashHandleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  const setFlashMessage = (message: string, type: string = "error") => {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  };

  useEffect(() => {
    const updateWindowDimensions = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, [router.isReady]);

  useEffect(() => {
    async function fetchData() {
      let response: FlexlistsError | FlexlistsSuccess<View[]>;
      if (isDefaultViews) {
        response = await listViewService.getDefaultListViews();
      } else {
        response = await listViewService.getViews(
          undefined,
          undefined,
          undefined,
          undefined,
          isArchived
        );
      }

      if (isSucc(response) && response.data) {
        if (response.data.length > 0) {
          if (isDefaultViews) {
            setViews(enabledViewCards(response.data));
          } else {
            setViews(
              enabledViewCards(response.data).filter(
                (view: View) => !view.isDefaultView
              )
            );
          }
        } else {
          if (!isArchived) {
            setMessage({
              message:
                "No views yet, click a template to create your first one!",
              type: "success",
            });
            await router.push(PATH_MAIN.chooseTemplate);
          }
        }
      } else {
        setFlashMessage(response?.message);
      }
    }
    fetchData();
  }, [router.isReady]);

  const maskProperties = [
    {
      left: { xs: "115px", md: "215px" },
      top: { xs: "150px", md: "150px" },
      radius: { xs: "55px", md: "65px" },
    },
    {
      left: { xs: "115px", md: "325px" },
      top: { xs: "455px", md: "455px" },
      radius: { xs: "65px", md: "65px" },
    },
    {
      left: { xs: `${windowWidth - 96}px`, md: `${windowWidth - 118}px` },
      top: { xs: "24px", md: "24px" },
      radius: { xs: "20px", md: "20px" },
    },
    {
      left: { xs: `${windowWidth - 60}px`, md: `${windowWidth - 82}px` },
      top: { xs: "24px", md: "24px" },
      radius: { xs: "20px", md: "20px" },
    },
    {
      left: { xs: `${windowWidth - 23}px`, md: `${windowWidth - 40}px` },
      top: { xs: "24px", md: "24px" },
      radius: { xs: "20px", md: "20px" },
    },
    {
      left: { xs: "124px", md: "705px" },
      top: { xs: "25px", md: "25px" },
      radius: { xs: "25px", md: "30px" },
    },
  ];

  const [maskProperty, setMaskProperty] = useState(maskProperties[0]);

  const createNewView = async () => {
    await router.push(PATH_MAIN.chooseTemplate);
  };

  const MaskedBackground = styled("div")(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(84, 166, 251, 0.5)",
    pointerEvents: "none",
    mask: `radial-gradient(circle at ${maskProperty.left.xs} ${maskProperty.top.xs}, transparent ${maskProperty.radius.xs}, black 0)`,
    zIndex: 10000,
    [theme.breakpoints.up("md")]: {
      mask: `radial-gradient(circle at ${maskProperty.left.md} ${maskProperty.top.md}, transparent ${maskProperty.radius.md}, black 0)`,
    },
  }));

  return (
    <>
      <Container
        sx={{
          py: 3,
          maxWidth: "inherit !important",
          overflow: "auto",
          overflowX: "hidden",
          // height: {xs:"calc(100svh - 177px)", md: "calc(100vh - 96px)"},
          height: `${windowHeight - 96}px`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6"></Typography>
          {isDefaultViews && (
            <Button
              size="medium"
              variant="contained"
              onClick={() => createNewView()}
            >
              {t("Create New")}
            </Button>
          )}
        </Box>
        <Grid container spacing={3} sx={{ mb: 2, mt: 0 }}>
          {views.length > 0 &&
            views.map((view, index) => {
              return (
                <Grid item xs={12} sm={6} md={2} key={index}>
                  <ViewCard
                    isViewDefault={view.isDefaultView}
                    id={view.id}
                    bgImage={`${process.env.NEXT_PUBLIC_FLEXLIST_API_URL}/api/tableView/getViewPreview?id=${view.id}`}
                    viewName={view.name}
                    viewDesc={view.description}
                  ></ViewCard>
                </Grid>
              );
            })}
        </Grid>
        <Snackbar
          open={flash !== undefined}
          autoHideDuration={6000}
          onClose={flashHandleClose}
        >
          <Alert
            onClose={flashHandleClose}
            severity={flash?.type as AlertColor}
            sx={{ width: "100%" }}
          >
            {flash?.message}
          </Alert>
        </Snackbar>
      </Container>
      {visibleMask && <MaskedBackground />}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  message: state.view.message,
});

const mapDispatchToProps = {
  setMessage,
  setCurrentView,
};

export default connect(mapStateToProps, mapDispatchToProps)(Views);
