import { Container, Grid, Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Errors, FlexlistsError, isSucc } from "src/models/ApiResponse";
import { PATH_AUTH, PATH_MAIN } from "src/routes/paths";
import { authService } from "flexlists-api";
import { motion } from "framer-motion";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { GetServerSideProps } from "next";
import {
  setApiResponseStatus,
  setReturnUrl,
} from "src/redux/actions/adminAction";
import { connect } from "react-redux";
import { AuthValidate } from "src/models/AuthValidate";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";
import Error from "src/sections/Error";

type ContentProps = {
  translations: TranslationText[];
  setReturnUrl: (returnUrl: any) => void;
  authValidate: AuthValidate | undefined;
  setFlashMessage: (message: FlashMessageModel) => void;
  apiResponseStatus: ApiResponseStatus;
  setApiResponseStatus: (status: ApiResponseStatus) => void;
};

function VerifyKey({
  translations,
  setReturnUrl,
  authValidate,
  setFlashMessage,
  apiResponseStatus,
  setApiResponseStatus,
}: ContentProps) {
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [verifyResult, setVerifyResult] = useState<string>("Verifying");

  useEffect(() => {
    async function verifyKey() {
      try {
        let verifyKeyResponse = await authService.validateAccessKey(
          encodeURIComponent(router.query.key as string)
        );
        if (
          isSucc(verifyKeyResponse) &&
          verifyKeyResponse.data &&
          verifyKeyResponse.data.viewId
        ) {
          await router.push(
            `${PATH_MAIN.views}/${verifyKeyResponse.data.viewId}`
          );
          return;
        } else if (
          (verifyKeyResponse as FlexlistsError).code === Errors.RedirectKey
        ) {
          setFlashMessage({
            type: "error",
            message: (verifyKeyResponse as FlexlistsError).message,
          });
          window.location.href = (
            verifyKeyResponse as FlexlistsError
          ).data?.redirect;
          return;
        } else if (
          (verifyKeyResponse as FlexlistsError).code === Errors.SignInOrRegister
        ) {
          setApiResponseStatus(ApiResponseStatus.Unauthorized);
          return;
        } else {
          setVerifyResult(verifyKeyResponse.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (router.query.key) {
      verifyKey();
    }
  }, [router.query.key]);
  const gotoLogin = async () => {
    setReturnUrl({ pathname: router.pathname, query: router.query });
    await router.push({ pathname: PATH_AUTH.login });
  };
  const gotoRegister = async () => {
    setReturnUrl({ pathname: router.pathname, query: router.query });
    await router.push({ pathname: PATH_AUTH.register });
  };
  const gotoHompage = async () => {
    await router.push({ pathname: "/" });
  };
  return apiResponseStatus === ApiResponseStatus.Success ? (
    <>
      {verifyResult === "Verifying" && (
        <Box
          sx={{
            position: "relative",
            display: "grid",
            placeContent: "center",
            minHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.div}
            animate={{
              width: ["200px", "8000px"],
              height: ["200px", "8000px"],
            }}
            transition={{ duration: 10 }}
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              background: "#54a6fb",
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography
              component={motion.div}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              variant="h3"
              color={"#fff"}
            >
              {verifyResult}
            </Typography>
            <Typography variant="body1" color={"#fff"}>
              {t("Please wait...")}
            </Typography>
          </Box>
        </Box>
      )}
      {verifyResult !== "Verifying" && (
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: "calc(100vh - 96px)",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 1, md: 3 },
              }}
            >
              <Box sx={{ border: "1px solid #54a6fb", borderRadius: 500 }}>
                <KeyOffIcon sx={{ fontSize: 96, color: "#54a6fb", m: 4 }} />
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {t("Invalid key")}
              </Typography>
              <Typography variant="body1" gutterBottom textAlign={"center"}>
                {t(`Unfortunately, we could not validate this key. If you believe this is a mistake, please ask the sharer 
                of the key to share it again or try the key again. Make sure to check for any typos.`)}
              </Typography>
              {(!authValidate || !authValidate.isUserValidated) && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() => gotoLogin()}
                  >
                    {t("Login")}
                  </Button>
                  <Button
                    size="large"
                    variant="outlined"
                    onClick={() => gotoRegister()}
                  >
                    {t("Register")}
                  </Button>
                </Box>
              )}

              <Button size="large" variant="text" onClick={() => gotoHompage()}>
                {t("Back to homepage")}
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  ) : (
    <>
      <Error errorStatus={apiResponseStatus} translations={translations} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("auth key", context);
};

const mapStateToProps = (state: any) => ({
  authValidate: state.admin.authValidate,
  apiResponseStatus: state.admin.apiResponseStatus,
});

const mapDispatchToProps = {
  setReturnUrl,
  setFlashMessage,
  setApiResponseStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyKey);
