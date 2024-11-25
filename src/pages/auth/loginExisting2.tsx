import {
  Container,
  Typography,
  Link,
  Grid,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
  Box,
  Snackbar,
  AlertColor,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import SocialLogin from "../../sections/auth/SocialLoginButtons";
import LoginIcon from "@mui/icons-material/Login";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authService } from "flexlists-api";
import Iconify from "../../components/iconify";
import { FlexlistsError, isErr, isSucc } from "src/models/ApiResponse";
import { PATH_AUTH, PATH_MAIN, getRolePathDefault } from "src/routes/paths";
import {
  LegacyCredentials,
  setLegacyCredentials,
  setMessage,
} from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { styled } from "@mui/material/styles";
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import Head from "next/head";
import LoadingPage from "../LoadingPage";
import { setReturnUrl } from "src/redux/actions/adminAction";
import { setIsExistingFlow, storeLanguage } from "src/utils/localStorage";
import { LocalStorageConst } from "src/constants/StorageConsts";
import Cookies from "js-cookie";

const CustomTextField = styled(TextField)(({ theme }) => ({
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
}));

interface LoginProps {
  message: any;
  styles?: any;
  legacyCredentials: LegacyCredentials;
  translations: TranslationText[];
  setMessage: (message: any) => void;
  setLegacyCredentials: (credentials: LegacyCredentials) => void;
  returnUrl: any;
  setReturnUrl: (returnUrl: any) => void;
}

const Login = ({
  styles,
  message,
  legacyCredentials,
  translations,
  setMessage,
  setLegacyCredentials,
  returnUrl,
  setReturnUrl,
}: LoginProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);

  useEffect(() => {
    async function initialize() {
      await authService.logout();
    }
    if (router.isReady) {
      initialize();
    }
  }, [router.isReady]);

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

  const handleSubmit = async () => {
    try {
      if (!userName) {
        setError(t("User Name required"));
        return;
      }
      if (!password) {
        setError(t("Password required"));
        return;
      }
      var response = await authService.loginExisting(userName, password);
      if (isSucc(response)) {
        //if not migrated yet, then go to register page
        if (
          !response.data.user &&
          response.data.legacyUser &&
          !response.data.legacyUser.wasMigrated
        ) {
          setLegacyCredentials({
            lists: response.data.legacyUser.lists,
            username: userName,
            password: password,
            legacyId: response.data.legacyUser.user?.userId,
            session: response.data.legacyUser.session,
            email: response.data.legacyUser.user?.email,
          });
          setMessage({
            message: "Login successful, please sign up for the new Flexlists!",
            type: "success",
          });
          await router.push({ pathname: PATH_AUTH.loginExisting3 });
          return;
        }
        //if migrated, then go to main/lists page
        if (
          response.data.user &&
          (!response.data.legacyUser || response.data.legacyUser.wasMigrated)
        ) {
          setMessage({
            message: "Login successful, going to your Dashboard!",
            type: "success",
          });
          if (response.data.language) {
            Cookies.set(LocalStorageConst.Language, response.data.language);
            storeLanguage(response.data.language);
          }
          setIsExistingFlow(false);
          if (returnUrl) {
            setReturnUrl(undefined);
            await router.push(returnUrl);
            return;
          } else {
            await router.push({
              pathname: getRolePathDefault(response.data.user.systemRole),
            });
          }
          return;
        }
        //if legacy user are migrating, then go to migrate lists page
        if (
          response.data.user &&
          response.data.legacyUser &&
          !response.data.legacyUser.wasMigrated
        ) {
          setMessage({
            message:
              "Your lists are still migrating, please wait for this process to complete.",
            type: "warning",
          });
          await router.push({ pathname: PATH_MAIN.migratedLists });
          return;
        }
      }
      if (
        isErr(response) &&
        (response as FlexlistsError).code === 512 &&
        (response as FlexlistsError).data?.email
      ) {
        setMessage({
          message:
            "Your account is not activated. Please check your email for an activation link or request a new one.",
          type: "error",
        });
        await router.push({
          pathname: PATH_AUTH.resendEmailVerification,
          query: { email: (response as FlexlistsError).data.email },
        });
        return;
      }
      setError(
        "Invalid username or password. Please try again or request a new password."
      );
    } catch (error: any) {
      console.log(error);
      setError("Unknown error. Please try again.");
    }
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
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
      flexDirection: { xs: "column-reverse", md: "row" },
      alignItems: "center",
      justifyContent: "center",
      px: { xs: 0, sm: 0, md: 0 },
    },
    leftBox: {
      width: { xs: "100%", md: "50%" },
      position: "relative",
      minHeight: { md: "100vh" },
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: { xs: "center", md: "left" },
      px: { xs: 0, md: 4 },
    },

    leftBoxGrid: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      pr: { xs: 0, md: 4 },
      py: { xs: 4, md: 0 },
      zIndex: 5,
    },
    circleEffect: {
      width: 400,
      height: 400,
      borderRadius: 400,
      background: "linear-gradient(#9bf8f4, #ffeda0, #fa9372)",
      position: "absolute",
      top: "40px",
      left: { xs: "100px", md: "400px" },
      opacity: theme.palette.mode === "light" ? 0.2 : 0.1,
      zIndex: 1,
      filter: "blur(100px)",
      transform: "translate3d(0, 0, 0)",
    },
    logoWrapper: {
      display: "flex",
      justifyContent: "center",
      my: { xs: 2, md: 0 },
      position: { xs: "relative", md: "absolute" },
      top: { xs: 0, md: 48 },
      left: 0,
    },
    logoImg: {
      width: 60,
      height: 45,
      objectFit: "contain",
    },
    link: {
      color: theme.palette.palette_style.text.selected,
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
    rightBox: {
      width: { xs: "100%", md: "50%" },
      minHeight: { md: "100vh" },
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      textAlign: "center",
      position: "relative",
      backgroundColor: theme.palette.palette_style.background.paper,
      "&::after": {
        position: "absolute",
        content: '" "',
        height: "100%",
        width: "250px",
        right: 0,
        backgroundColor: theme.palette.palette_style.background.paper,
        transform: "translateX(250px)",
        display: { xs: "none", md: "block" },
      },
    },
    rightBoxGrid: {
      py: 4,
      px: { xs: 1, md: 4 },
      boxShadow: "none !important",
      marginTop: 0,
      overflow: "auto",
      zIndex: 2,
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
    formActionsWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    checkbox: {
      color: theme.palette.palette_style.primary.main,
      "&.Mui-checked": { color: theme.palette.palette_style.primary.main },
    },
    forgotPassword: {
      color: theme.palette.palette_style.primary.main,
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
    button: {
      backgroundColor: theme.palette.palette_style.primary.main,
      width: "100%",
    },
    signUpWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <LoadingPage>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
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
      <Box sx={styles?.body} onKeyDown={handleKeyDown}>
        <Container maxWidth="xl" sx={styles?.container}>
          <Box sx={styles?.leftBox}>
            <Grid container sx={styles?.leftBoxGrid}>
              <Box
                sx={{
                  ...styles?.circleEffect,
                  ...{
                    top: { xs: "100px", md: "820px" },
                    left: { xs: "-100px", md: "0" },
                    background: "#103783",
                  },
                }}
              ></Box>
              {/* <Box sx={styles?.logoWrapper}>
                <Link href="/">
                  <Box
                    component="img"
                    sx={styles?.logoImg}
                    alt="Logo"
                    src="/assets/logo_dark.png"
                  />
                </Link>
              </Box> */}
              <Box
                sx={{
                  zIndex: 5,
                }}
              >
                <Typography variant="body1" color={"white"}>
                  {t("Title")}{" "}
                  <Link sx={styles?.link} href="/auth/login">
                    {t("Here")}
                  </Link>
                  .
                </Typography>
                <br />
                <br />
                <Typography variant="body1" color={"white"}>
                  {t("Description")}
                </Typography>
              </Box>
            </Grid>
          </Box>

          <Box sx={styles?.rightBox}>
            <Box sx={styles?.circleEffect}></Box>
            <Grid container rowSpacing={3} sx={styles?.rightBoxGrid}>
              <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
                <Box sx={styles?.FormLogoWrapper}>
                  <Link href="/existing">
                    <Box
                      component="img"
                      sx={styles?.FormLogo}
                      alt="Logo"
                      src="/assets/logo.png"
                    />
                  </Link>
                </Box>
                <Typography
                  variant="h3"
                  gutterBottom
                  color={
                    theme.palette.mode === "light"
                      ? theme.palette.palette_style.text.black
                      : theme.palette.palette_style.text.white
                  }
                >
                  {t("Existing Login Subject")}
                </Typography>
                <Typography
                  variant="caption"
                  color={
                    theme.palette.mode === "light"
                      ? theme.palette.palette_style.text.primary
                      : theme.palette.palette_style.text.white
                  }
                >
                  {t("Subject Description")}
                </Typography>
              </Grid>

              {/* <Grid
            item
            container
          >
            {error && <Alert severity="error">{error}</Alert>}
          </Grid> */}

              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  placeholder={t("UserName")}
                  type="text"
                  required
                  value={userName}
                  onChange={handleChangeEmail}
                ></CustomTextField>
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  placeholder={t("Password")}
                  required
                  variant="outlined"
                  value={password}
                  onChange={handleChangePassword}
                  type={showPassword ? "text" : "password"}
                  inputProps={{
                    color: theme.palette.palette_style.primary.main,
                  }}
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
                ></CustomTextField>
              </Grid>

              <Grid item sx={styles?.formActionsWrapper} xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked sx={styles?.checkbox} />}
                    label={t("Remember Me")}
                  />
                </FormGroup>
                <Link
                  href="https://flexlists.com/forgotten.php"
                  variant="body1"
                  target="_blank"
                  sx={styles?.forgotPassword}
                >
                  {t("Forgot Password")}
                </Link>
              </Grid>

              <Grid item xs={12}>
                <Button
                  href="#"
                  size="large"
                  variant="contained"
                  endIcon={<LoginIcon />}
                  sx={styles?.button}
                  onClick={handleSubmit}
                >
                  {t("Existing Login Subject")}
                </Button>
              </Grid>

              {/* <SocialLogin /> */}

              <Grid item xs={12}>
                <Divider light sx={{ my: 2 }}></Divider>
              </Grid>

              <Grid item xs={12} columnSpacing={1} sx={styles?.signUpWrapper}>
                <Typography variant="body1">
                  {t("Don't have an account on FlexLists.com?")}{" "}
                  <Link href="/auth/register" variant="body1" sx={styles?.link}>
                    {t("Register Subject")}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </LoadingPage>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const verifyToken = await validateToken(context);

  if (verifyToken) {
    return verifyToken;
  }

  return await getTranslations("existing login", context);
};

const mapStateToProps = (state: any) => ({
  message: state.auth.message,
  legacyCredentials: state.auth.legacyCredentials,
  returnUrl: state.admin.returnUrl,
});

const mapDispatchToProps = {
  setMessage,
  setLegacyCredentials,
  setReturnUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
