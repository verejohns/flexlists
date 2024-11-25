import {
  Alert,
  AlertColor,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isSucc } from "src/models/ApiResponse";
import { setMessage } from "src/redux/actions/authAction";
import { PATH_AUTH } from "src/routes/paths";
import { authService } from "flexlists-api";
import Iconify from "../../../components/iconify";
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { useTheme } from "@mui/material/styles"

interface VerifyEmailTokenProps {
  message: any;
  translations: TranslationText[];
  setMessage: (message: any) => void;
}

const VerifyEmailToken = ({
  message,
  translations,
  setMessage,
}: VerifyEmailTokenProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();

  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  // const [email, setEmail] = useState<string>('');
  // const [verifyResult, setVerifyResult] = useState<string>('Verifying')
  // const [isValidated, setIsValidated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const checkMessage = () => {
      if (message?.message) {
        setFlash(message);
      }
    };

    checkMessage();
  }, [message]);

  useEffect(() => {
    if (router.query.token && router.isReady) {
      //verifyEmail()
    }
  }, [router.query.token]);

  const handleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  async function handleSubmit() {
    try {
      let verifyResponse = await authService.verifyPasswordChange(
        router.query.email as string,
        router.query.token as string,
        password
      );
      if (
        isSucc(verifyResponse) &&
        verifyResponse.data &&
        verifyResponse.data.isUpdated
      ) {
        setMessage({
          message: "Your password has been changed, please login!",
          type: "success",
        });
        await router.push({ pathname: PATH_AUTH.login });
        return;
        // setVerifyResult("Verify successfully")
        // setIsValidated(true)
      } else {
        setMessage({
          message:
            "Verification failed, invalid code. Please request a new code.",
          type: "error",
        });
        await router.push({
          pathname: PATH_AUTH.forgotPassword,
          query: { email: router.query.email as string },
        });
        return;
        //setVerifyResult("Verify fail")
      }
    } catch (err) {
      setMessage({
        message:
          "Verification failed, invalid code. Please request a new code.",
        type: "error",
      });
      await router.push({
        pathname: PATH_AUTH.forgotPassword,
        query: { email: router.query.email as string },
      });
      return;
      //console.log(err)
      //setVerifyResult("Verify fail")
    }
  }

  return (
    <>
      {/* <Box
        component="img"
        sx={{
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
        }}
        alt="The house from the offer."
        src="/assets/images/background.png"
      /> */}
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
      <Box sx={{
        background:
          "linear-gradient(45deg, hsl(219deg 41% 13%) 0%, hsl(213deg 41% 19%) 50%, hsl(212deg 40% 24%) 100%)",
        overflow: "hidden",
      }}>
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
              display: "flex",
              // flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              width: "100%",
              py: 4,
              px: { xs: 2, md: 4 },
              borderRadius: "4px",
              boxShadow: "0 0 64px 0 rgba(0,0,0,0.1)",
              backgroundColor: theme.palette.palette_style.background.paper,
            }}
          >
            <Grid item xs={12}>
              <Typography
                color={
                  theme.palette.mode === "light"
                    ? theme.palette.palette_style.text.black
                    : theme.palette.palette_style.text.white
                }
                variant="h4"
                gutterBottom>
                {t("Title")}
              </Typography>
              <Typography
                variant="body1"
                color={
                  theme.palette.mode === "light"
                    ? theme.palette.palette_style.text.black
                    : theme.palette.palette_style.text.white
                }>
                {t("Description")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder={t("Password")}
                required
                value={password}
                onChange={handleChangePassword}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        <Iconify
                          icon={
                            showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                href="#"
                size="large"
                variant="contained"
                disabled={false}
                sx={{
                  textTransform: "uppercase",
                }}
                onClick={() => handleSubmit()}
              >
                {t("Submit")}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box >

    </>
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

  return await getTranslations("forgot password verification token", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailToken);
