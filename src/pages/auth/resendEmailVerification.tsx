import React, { useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  AlertColor,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { setMessage } from "src/redux/actions/authAction";
import { authService } from "flexlists-api";
import { FlexlistsError, isErr, isSucc } from "src/models/ApiResponse";
import { PATH_AUTH } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import LoadingPage from "../LoadingPage";

interface VerifyEmailProps {
  message: any;
  styles?: any;
  translations: TranslationText[];
  setMessage: (message: any) => void;
}

const VerifyEmail = ({
  message,
  styles,
  translations,
  setMessage,
}: VerifyEmailProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();

  const [flash, setFlash] = React.useState<
    { message: string; type: string } | undefined
  >(undefined);
  const [email, setEmail] = React.useState<string>("");

  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
  }, [message]);

  useEffect(() => {
    function routerCheck() {
      if (router.query.email) {
        setEmail(router.query.email as string);
      }
    }
    routerCheck();
  });

  const setFlashMessage = (message: string, type: string = "error") => {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  };

  const handleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  const handleResend = async () => {
    if (email) {
      const res = await authService.resendSignupEmail(email);
      if (isSucc(res)) {
        setMessage({
          message:
            "Verification code sent successfully. Please check your email.",
          type: "success",
        });
        await router.push({
          pathname: PATH_AUTH.verifyEmail,
          query: { email: email },
        });
      } else {
        if ((res as FlexlistsError).code === 509) {
          // already verified
          setMessage({
            message: "Your account has been activated, please login!",
            type: "success",
          });
          await router.push({
            pathname: PATH_AUTH.login,
            query: { email: email },
          });
        } else {
          if (isErr(res)) {
            setFlashMessage((res as FlexlistsError).message);
          } else {
            setFlashMessage("Something went wrong. Please try again.");
          }
        }
      }
    }
  };

  styles = {
    body: {
      background:
        "linear-gradient(45deg, hsl(219deg 41% 13%) 0%, hsl(213deg 41% 19%) 50%, hsl(212deg 40% 24%) 100%)",
      overflow: "hidden",
    },
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      alignItems: "center",
      justifyContent: "center",
      px: { xs: 0, sm: 0, md: 0 },
    },
    FormLogoWrapper: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 2,
    },
    FormLogo: {
      width: 60,
      height: 45,
      objectFit: "contain",
      marginTop: "2px",
    },
    textField: {
      "& .MuiInputBase-root": {
        backgroundColor:
          theme.palette.mode === "light" ? "#fcfeff" : "rgba(255,255,255,.1)",
        border: "none",
        color: theme.palette.mode === "light" ? "#111" : "#fff",
        boxShadow: "-4px 0 12px 0 rgba(0,0,0,0.1)",
      },

      "& ::placeholder": {
        color: "#ccc",
      },

      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "none",
        },
      },
    },
    button: {
      backgroundColor: theme.palette.palette_style.primary.main,
      width: "100%",
    },
  };

  return (
    <LoadingPage>
      <Box sx={styles?.body}>
        <Snackbar
          open={flash !== undefined}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={flash?.type as AlertColor}
            sx={{ width: "100%" }}
          >
            {flash?.message}
          </Alert>
        </Snackbar>
        <Container
          maxWidth="sm"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            rowSpacing={3}
            sx={{
              textAlign: "center",
              width: "100%",
              py: 4,
              px: { xs: 1, md: 4 },
              borderRadius: "4px",
              boxShadow: "0 0 64px 0 rgba(0,0,0,0.1)",
              background: theme.palette.palette_style.background.paper,
            }}
          >
            <Grid item xs={12}>
              <Box sx={styles?.FormLogoWrapper}>
                <Link href="/">
                  <Box
                    component="img"
                    sx={styles?.FormLogo}
                    alt="Logo"
                    src="/assets/logo.png"
                  />
                </Link>
              </Box>
              <Typography variant="h4" gutterBottom>
                {t("Title")}
              </Typography>
              <Typography variant="body1">{t("Description")}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder={t("Email")}
                type="email"
                required
                value={email}
                sx={styles?.textField}
                disabled
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                href="#"
                size="large"
                variant="contained"
                onClick={() => handleResend()}
                sx={styles?.button}
              >
                {t("Send Me Code")}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </LoadingPage>
  );
};

const mapStateToProps = (state: any) => ({
  message: state.auth.message,
});

const mapDispatchToProps = {
  setMessage,
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const verifyToken = await validateToken(context);

  if (verifyToken) {
    return verifyToken;
  }

  return await getTranslations("resend email verification", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
