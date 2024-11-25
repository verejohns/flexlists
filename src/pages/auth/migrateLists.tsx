import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Link,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
  AlertColor,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import SocialLogin from "../../sections/auth/SocialLoginButtons";
import LoginIcon from "@mui/icons-material/Login";
// import {MuiTelInput}  from "mui-tel-input";
import { authService } from "flexlists-api";
import { useRouter } from "next/router";
import Iconify from "../../components/iconify";
import { FlexlistsError, isErr, isSucc } from "src/models/ApiResponse";
import { MuiTelInput } from "mui-tel-input";
import InfoIcon from "@mui/icons-material/Info";
import { PATH_AUTH } from "src/routes/paths";
import { ErrorConsts } from "src/constants/errorConstants";
import { connect } from "react-redux";
import {
  LegacyCredentials,
  setLegacyCredentials,
  setMessage,
} from "src/redux/actions/authAction";
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import LoadingPage from "../LoadingPage";
import { get } from "lodash";
import { getLanguage } from "src/utils/localStorage";

interface MigrateListsProps {
  message: any;
  legacyCredentials: LegacyCredentials;
  styles?: any;
  translations: TranslationText[];
  setMessage: (message: any) => void;
  setLegacyCredentials: (credentials: LegacyCredentials) => void;
}
const MigrateLists = ({
  message,
  legacyCredentials,
  styles,
  translations,
  setMessage,
  setLegacyCredentials,
}: MigrateListsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [termsAndConditions, setTermsAndConditions] = useState<boolean>(false);
  const [lists, setLists] = useState<any[]>([]);
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    function checkCreds() {
      if (legacyCredentials?.username) {
        setUserName(legacyCredentials.username);
        setUserEmail(legacyCredentials.email);
        setPassword(legacyCredentials.password);
        setLists(legacyCredentials.lists);
      }
    }
    checkCreds();
  }, [legacyCredentials]);

  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
  }, [message]);

  const handleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  const setError = (message: string) => {
    setFlashMessage(message);
  };

  const setFlashMessage = (message: string, type: string = "error") => {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  };

  const handlePhoneChange = (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFirstName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAndConditions(event.target.checked);
  };

  const handleSubmit = async () => {
    try {
      if (!firstName) {
        setError("First Name required");
        return;
      }
      if (!lastName) {
        setError("Last Name required");
        return;
      }
      if (!userName) {
        setError("User Name required");
        return;
      }
      if (!userEmail) {
        setError("Email required");
        return;
      }
      if (!password) {
        setError("Password required");
        return;
      }

      if (!termsAndConditions) {
        setError("Please accept terms and conditions");
        return;
      }

      if (!legacyCredentials?.username) {
        // if we don't have ye-olde creds, we need to see if they exist, or move this user off
        // the legacy system
        var response = await authService.loginExisting(userName, password);
        if (isSucc(response)) {
          if (response.data.wasMigrated) {
            setMessage({
              message:
                "Your account was already migrated, please login via the regular login.",
              type: "success",
            });
            await router.push({ pathname: PATH_AUTH.login });
            return;
          } else {
            setLegacyCredentials({
              lists: response.data.lists,
              username: userName,
              password: password,
              legacyId: response.data.user.userId,
              session: response.data.session,
              email: response.data.user.email,
            });
            // setMessage({ message: 'Login successful, please sign up for the new Flexlists!', type: 'success' })
            // await router.push({ pathname: PATH_AUTH.registerExisting });
            // return
          }
        } else {
          // it's an error, so that aint good
          setFlashMessage(
            `We could not retrieve your username/password combination on the old system. Please check if your username and password are the ones you use on that system.`
          );
          return;
        }
      }
      let language = getLanguage();
      var response = await authService.registerExisting(
        userName,
        password,
        termsAndConditions,
        firstName,
        lastName,
        userEmail,
        phoneNumber,
        language ?? "en-US"
      );
      // var response = await authService.register(
      //   firstName,
      //   lastName,
      //   userName,
      //   userEmail,
      //   phoneNumber,
      //   password,
      //   termsAndConditions
      // );

      if (isSucc(response)) {
        setMessage({
          message:
            "Registration successful! Please check your email to verify your account.",
          type: "success",
        });
        router.push({
          pathname: PATH_AUTH.verifyEmail,
          query: { email: userEmail },
        });
        return;
      }

      // cannot really happen, but what can you do
      if (isErr(response)) {
        if ((response as FlexlistsError).code === 503) {
          // UserAlreadyMigrated
          setMessage({
            message:
              "Your account was already migrated, please login via the regular login.",
            type: "success",
          });
          await router.push({ pathname: PATH_AUTH.login });
          return;
        }
      }

      setError(
        (response as FlexlistsError)?.message ??
          "Could not create account, please try again or contact support."
      );
    } catch (error) {
      setError(ErrorConsts.InternalServerError);
      console.log(error);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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

    leftBox: {
      width: { xs: "100%", md: "50%" },
      position: "relative",
      minHeight: { md: "100vh" },
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 4,
      alignItems: "center",
      textAlign: { xs: "center", md: "left" },
      color: theme.palette.palette_style.text.white,
      py: { xs: 4, md: 0 },
      px: { xs: 0, md: 4 },
    },

    loginIllustration: {
      width: 250,
      height: 250,
      objectFit: "contain",
    },

    rightBox: {
      width: { xs: "100%", md: "50%" },
      minHeight: { md: "100vh" },
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      textAlign: "center",
      position: "relative",
      backgroundColor: "#fff",
      "&::after": {
        position: "absolute",
        content: '" "',
        height: "100%",
        width: "250px",
        right: 0,
        backgroundColor: "#fff",
        transform: "translateX(250px)",
        display: { xs: "none", md: "block" },
      },
    },

    circleEffect: {
      width: 400,
      height: 400,
      borderRadius: 400,
      background: "linear-gradient(#9bf8f4, #ffeda0, #fa9372)",
      position: "absolute",
      top: "40px",
      left: { xs: "100px", md: "400px" },
      opacity: 0.2,
      zIndex: 1,
      filter: "blur(100px)",
      transform: "translate3d(0, 0, 0)",
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
    loginExisting: {
      display: isHovered ? "block" : "none",
      background: "#222",
      color: "#fff",
      position: "absolute",
      right: 0,
      width: "250px",
      whiteSpace: "initial",
      textAlign: "left",
      p: 1,
      px: 2,
      zIndex: 10,
    },

    formActionsWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    termsAndConditions: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: { xs: "center", md: "flex-start" },
    },
    checkboxLabel: {
      mr: 0,
      textAlign: { xs: "center", md: "left" },
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

    signInWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    link: {
      color: theme.palette.palette_style.text.selected,
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
  };

  return (
    <LoadingPage>
      <Box sx={styles?.body}>
        <Snackbar
          open={flash !== undefined}
          autoHideDuration={10000}
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
            rowSpacing={4}
            sx={{
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              px: { xs: 1, md: 4 },
              borderRadius: "4px",
              boxShadow: "0 0 64px 0 rgba(0,0,0,0.1)",
              backgroundColor: theme.palette.palette_style.background.paper,
              marginTop: 0,
              maxHeight: "93vh",
              overflow: "auto",
            }}
          >
            <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
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
              <Typography variant="h4" textAlign="center" gutterBottom>
                {t("Title")}
              </Typography>
              <Typography variant="body1" textAlign="center">
                {t("Description")}
              </Typography>
            </Grid>

            {/* <Grid item container>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid> */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder={t("Username")}
                type="text"
                required
                value={userName}
                onChange={handleChangeUserName}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      position="end"
                    >
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        <Typography
                          variant="body2"
                          component={"div"}
                          sx={{
                            display: isHovered ? "block" : "none",
                            background: "#222",
                            color: "#fff",
                            position: "absolute",
                            right: 0,
                            width: "250px",
                            whiteSpace: "initial",
                            textAlign: "left",
                            p: 1,
                            px: 2,
                            zIndex: 10,
                          }}
                        >
                          {t("Name Used For Other")}{" "}
                          <Link
                            sx={{
                              color: theme.palette.palette_style.text.selected,
                              fontWeight: "500",
                              textDecoration: "none",
                            }}
                            href="login"
                          >
                            {t("Login Page")}
                          </Link>{" "}
                          {t("And Login With Previous")}
                        </Typography>
                        <InfoIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={styles?.textField}
              />
            </Grid>
            <Grid item container>
              <Grid item xs={6} sx={{ paddingRight: 1 }}>
                <TextField
                  fullWidth
                  placeholder={t("First Name")}
                  type="text"
                  required
                  value={firstName}
                  onChange={handleFirstNameChange}
                  sx={styles?.textField}
                ></TextField>
              </Grid>

              <Grid item xs={6} sx={{ paddingLeft: 1 }}>
                <TextField
                  fullWidth
                  placeholder={t("Last Name")}
                  type="text"
                  required
                  value={lastName}
                  onChange={handleLastNameChange}
                  sx={styles?.textField}
                ></TextField>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder={t("Email")}
                type="email"
                required
                value={userEmail}
                onChange={handleEmailChange}
                sx={styles?.textField}
              ></TextField>
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
                sx={styles?.textField}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <MuiTelInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                defaultCountry="NL"
                sx={{
                  width: "100%",
                  ...styles?.textField,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <FormControlLabel
                  sx={{ mr: 0, textAlign: { xs: "center", md: "left" } }}
                  control={
                    <Checkbox
                      onChange={handleTermsChange}
                      value={termsAndConditions}
                      sx={styles?.checkbox}
                    />
                  }
                  label={t("I Have Read")}
                />

                <Link href="#" sx={styles?.link}>
                  &nbsp;{t("Terms Conditions")}
                </Link>
              </FormGroup>
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
                {t("Register Subject")}
              </Button>
            </Grid>
            {/* <SocialLogin /> */}
            <Grid
              item
              xs={12}
              columnSpacing={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  display: "inline",
                }}
              >
                {t("Already Have")}{" "}
                <Link
                  href="/auth/loginExisting"
                  variant="body1"
                  sx={styles?.link}
                >
                  {t("Login Subject")}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </LoadingPage>
  );
};

const mapStateToProps = (state: any) => ({
  message: state.auth.message,
  legacyCredentials: state.auth.legacyCredentials,
});

const mapDispatchToProps = {
  setMessage,
  setLegacyCredentials,
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const verifyToken = await validateToken(context);

  if (verifyToken) {
    return verifyToken;
  }

  return await getTranslations("migrate lists", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(MigrateLists);
