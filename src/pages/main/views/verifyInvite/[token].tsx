import { Box, Stack, Typography, Button, Grid, Container } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { type } from "os";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { PATH_MAIN, PATH_AUTH } from "src/routes/paths";
import { listViewService } from "flexlists-api";
import Error from "src/sections/Error";
import { GetServerSideProps } from "next";
import { getTranslation, getTranslations } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { motion } from "framer-motion";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import { AuthValidate } from "src/models/AuthValidate";
import { setReturnUrl } from "src/redux/actions/adminAction";
import { el } from "date-fns/locale";

type VerifyInviteTokenProps = {
  apiResponseStatus: ApiResponseStatus;
  translations: TranslationText[];
  authValidate: AuthValidate | undefined;
  setReturnUrl: (returnUrl: any) => void;
};
const VerifyInviteToken = ({
  apiResponseStatus,
  translations,
  authValidate,
  setReturnUrl,
}: VerifyInviteTokenProps) => {
  const router = useRouter();
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
  const [verifyResult, setVerifyResult] = useState<string>("Verifying");
  const [verifyCode, setVerifyCode] = useState<number>(0);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  useEffect(() => {
    async function verifyEmailInvite() {
      try {
        let acceptInviteTokenResponse = await listViewService.acceptInvite(
          router.query.token as string
        );

        if (
          isSucc(acceptInviteTokenResponse) &&
          acceptInviteTokenResponse.data &&
          acceptInviteTokenResponse.data.viewId
        ) {
          if (acceptInviteTokenResponse.data.isDefaultView) {
            await router.push(
              `${PATH_MAIN.lists}/${acceptInviteTokenResponse.data.viewId}`
            );
          } else {
            await router.push(
              `${PATH_MAIN.views}/${acceptInviteTokenResponse.data.viewId}`
            );
          }
        } else {
          setVerifyResult(acceptInviteTokenResponse.message);
          setVerifyCode((acceptInviteTokenResponse as FlexlistsError).code);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (router.query.token) {
      verifyEmailInvite();
    }
  }, [router.query.token]);
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
      {/* <Typography>{verifyResult}</Typography> */}
      {/* {
        !isValidated &&
        <Stack >
          <Box>
            Please <Link href={`/auth/login`}>Login</Link>
          </Box>
        </Stack>
      } */}
      {verifyCode === 0 && (
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
      {verifyCode !== 0 && (
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
                {t("Invalid invite key")}
              </Typography>
              {verifyCode === 507 && (
                <Typography variant="body1" gutterBottom textAlign={"center"}>
                  {t(`User already has access to this view.`)}
                </Typography>
              )}
              {verifyCode !== 507 && (
                <Typography variant="body1" gutterBottom textAlign={"center"}>
                  {t(`Unfortunately, we could not validate this invite key. If you believe this is a mistake, please ask the sharer 
              of the invite key to share it again or try the invite key again. Make sure to check for any typos.`)}
                </Typography>
              )}

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
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("verify invite token", context);
};
const mapStateToProps = (state: any) => ({
  apiResponseStatus: state.admin.apiResponseStatus,
  authValidate: state.admin.authValidate,
});

const mapDispatchToProps = {
  setReturnUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyInviteToken);
