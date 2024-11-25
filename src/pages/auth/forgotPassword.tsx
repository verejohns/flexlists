import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Link,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import { connect } from "react-redux";
import { setMessage } from "src/redux/actions/authAction";
import { validateEmail } from "src/utils/validateUtils";
import { authService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { useRouter } from "next/router";
import { PATH_AUTH } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import LoadingPage from "../LoadingPage";

interface ForgotPasswordProps {
  message: any;
  styles?: any;
  translations: TranslationText[];
  setMessage: (message: any) => void;
}

const ForgotPassword = ({
  message,
  translations,
  styles,
  setMessage,
}: ForgotPasswordProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const router = useRouter();

  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
  }, [message]);

  const setError = (message: string) => {
    setFlashMessage(message);
  };

  const setFlashMessage = (message: string, type: string = "error") => {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  };

  const handleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  useEffect(() => {
    function routerCheck() {
      if (router.query.email) {
        setEmail(router.query.email as string);
      }
    }
    routerCheck();
  });

  async function handleSubmit(event: any) {
    if (!validateEmail(email)) {
      setFlashMessage("Invalid email address");
      return;
    }
    try {
      const result = await authService.forgotPassword(email);
      if (isSucc(result)) {
        setMessage({
          message:
            "Email with instructions was sent to the email address provided",
          type: "success",
        });
        await router.push({
          pathname: PATH_AUTH.forgotPasswordVerificationManual,
          query: { email: email },
        });
        return;
      } else {
        setFlashMessage((result as FlexlistsError).message);
        return;
      }
    } catch (error: any) {
      setFlashMessage(error.message);
    }
  }

  styles = {
    body: {
      background:
        "linear-gradient(45deg, hsl(219deg 41% 13%) 0%, hsl(213deg 41% 19%) 50%, hsl(212deg 40% 24%) 100%)",
      overflow: "hidden",
    },
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
        <Container maxWidth="sm" sx={styles?.container}>
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
          <Grid
            container
            rowSpacing={4}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              px: { xs: 1, md: 4 },
              borderRadius: "4px",
              boxShadow: "0 0 64px 0 rgba(0,0,0,0.1)",
              backgroundColor: theme.palette.palette_style.background.paper,
            }}
          >
            <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <Link href="/">
                  <Box
                    component="img"
                    sx={styles?.FormLogo}
                    alt="Logo"
                    src="/assets/logo.png"
                  />
                </Link>
              </Box>
              <Typography
                variant="h4"
                textAlign="center"
                color={
                  theme.palette.mode === "light"
                    ? theme.palette.palette_style.text.black
                    : theme.palette.palette_style.text.white
                }
              >
                {t("Password Reset")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                fullWidth
                placeholder={t("Email")}
                type="email"
                sx={styles?.textField}
                required
              ></TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={handleSubmit}
                href="#"
                size="large"
                variant="contained"
                sx={styles?.button}
              >
                {t("Send Recovery Email")}
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

  return await getTranslations("forgot password", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
