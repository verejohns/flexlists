import React, { useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  Snackbar,
  AlertColor,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { authService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { useRouter } from "next/router";
import { PATH_AUTH } from "src/routes/paths";
import { setMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import LoadingPage from "../LoadingPage";
import { isNumericString } from "src/utils/formatNumber";

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "56px !important",
          width: "40px !important",

          "& input": {
            textAlign: "center",
            fontWeight: "600",
            fontSize: 24,
          },
        },
      },
    },
  },
});

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

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [canSubmit, setCanSubmit] = React.useState(false);
  const [token, setToken] = React.useState<string>("      ");
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputValue = event.target.value;
    const input = inputRefs.current[index];
    let _token = token.toString();

    if (isNaN(parseInt(inputValue))) {
      input!.value = "";
      return;
    }

    if (inputValue.length <= 1) {
      if (input) {
        input.value = inputValue;
        if (inputValue.length === 1) {
          input.blur(); // Remove focus from the current input
          const nextInput = inputRefs.current[index + 1];
          if (nextInput) {
            nextInput.focus(); // Move focus to the next input
            if (nextInput.value.length === 0) {
              nextInput.value = ""; // Clear the next input field only if it's empty
            }
          }
        }
      }

      _token =
        _token.substring(0, index) +
        (input?.value && input.value.length > 0 ? input.value : " ") +
        _token.substring(index + 1);
    } else {
      if (inputValue.length === 2) {
        // after paste, if edit input, need to prevent to show 2 numbers.
        if (input) input.value = inputValue.charAt(1);
      } else {
        for (let i = 0; i < inputValue.length; i++) {
          const inputEl = inputRefs.current[i + index];

          if (inputEl) inputEl.value = inputValue.charAt(i);
        }

        _token = (
          _token.substring(0, index) +
          inputValue +
          _token.substring(index + inputValue.length)
        ).substring(0, 6);
      }
    }

    setToken(_token);
    setCanSubmit(
      _token.split("").filter((x) => x !== " ").length === 6 && email.length > 0
    );
  };

  const emptyInput = () => {
    for (let i = 0; i < 6; i++) {
      const input = inputRefs.current[i];
      input!.value = "";
    }
    setToken("      ");
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = async () => {
    try {
      setCanSubmit(false);
      let verifyResponse = await authService.verifySignup(token, email);
      if (
        isSucc(verifyResponse) &&
        verifyResponse.data &&
        verifyResponse.data.isValidated
      ) {
        setMessage({
          message: "Your account has been activated, please login!",
          type: "success",
        });
        await router.push({
          pathname: PATH_AUTH.login,
          query: { email: email },
        });
        return;
      } else {
        emptyInput();
        setFlashMessage(
          "Verification failed, invalid code. Please request a new code.",
          "error"
        );
        await router.push({
          pathname: PATH_AUTH.resendEmailVerification,
          query: { email: email },
        });
        return;
        // emptyInput()
        // setFlashMessage('Verification failed, invalid code.')
      }
    } catch (err) {
      emptyInput();
      setFlashMessage(
        "Verification failed, invalid code. Please request a new code.",
        "error"
      );
      await router.push({
        pathname: PATH_AUTH.resendEmailVerification,
        query: { email: email },
      });
      return;
      // emptyInput()
      // setFlashMessage('Verification failed, invalid code.')
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Even in number type text field, we can input 'e', so need to prevent for this special case.
    if (
      event.key === "e" ||
      event.key === "E" ||
      event.key === "+" ||
      event.key === "-" ||
      event.key === "."
    )
      event.preventDefault();

    if (event.key === "Backspace") {
      const currentInput = event.target as HTMLInputElement;

      if (currentInput.value.length === 0) {
        const currentIndex = inputRefs.current.findIndex(
          (ref) => ref === currentInput
        );

        const previousInput = inputRefs.current[currentIndex - 1];
        if (previousInput) {
          previousInput.focus(); // Move focus to the previous input
        }
      } else {
        const index = inputRefs.current.findIndex(
          (ref) => ref === currentInput
        );
        let _token = token.toString();
        // set the _token[index] to inputValue
        _token = _token.substring(0, index) + " " + _token.substring(index + 1);
        setToken(_token);
        setCanSubmit(
          _token.split("").filter((x) => x !== " ").length === 6 &&
            email.length > 0
        );
        return;
      }
    }

    setCanSubmit(
      token.split("").filter((x) => x !== " ").length === 6 && email.length > 0
    );
  };

  const handlePaste = (e: any) => {
    // Even in number type text field, we can paste string included 'e', so need to prevent for this special case.
    if (!isNumericString(e.clipboardData.getData("text/plain")))
      e.preventDefault();
  };

  const handleClose = () => {
    setFlash(undefined);
    setMessage(null);
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
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              width: "100%",
              py: 4,
              px: { xs: 1, md: 4 },
              borderRadius: "4px",
              boxShadow: "0 0 64px 0 rgba(0,0,0,0.1)",
              backgroundColor: theme.palette.palette_style.background.paper,
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
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {t("Title")}
              </Typography>
              <Typography variant="body1">{t("Description")}</Typography>
            </Grid>

            <Grid item xs={12} sx={{ width: "100%" }}>
              <TextField
                fullWidth
                placeholder={t("Email")}
                type="email"
                required
                value={email}
                sx={styles?.textField}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setCanSubmit(
                    token.split("").filter((x) => x !== " ").length === 6 &&
                      event.target.value.length > 0
                  );
                }}
              />
            </Grid>

            <Grid item xs={12} xl={12}>
              <ThemeProvider theme={theme}>
                <Box
                  sx={{ width: "100%", display: "flex", gap: { xs: 1, md: 2 } }}
                >
                  <TextField
                    size="small"
                    inputRef={(ref) => (inputRefs.current[0] = ref)}
                    onChange={(event: any) => handleInputChange(event, 0)}
                    onKeyDown={handleInputKeyDown}
                    sx={{
                      ...{
                        border:
                          theme.palette.mode === "light"
                            ? "1px solid #eee"
                            : "none",
                      },
                      ...styles?.textField,
                    }}
                    inputProps={{
                      maxLength: 1,
                      type: "number",
                      inputMode: "numeric",
                    }}
                    onPaste={handlePaste}
                  ></TextField>
                  <TextField
                    size="small"
                    inputRef={(ref) => (inputRefs.current[1] = ref)}
                    onChange={(event: any) => handleInputChange(event, 1)}
                    onKeyDown={handleInputKeyDown}
                    sx={{
                      ...{
                        border:
                          theme.palette.mode === "light"
                            ? "1px solid #eee"
                            : "none",
                      },
                      ...styles?.textField,
                    }}
                    inputProps={{
                      maxLength: 1,
                      type: "number",
                      inputMode: "numeric",
                    }}
                    onPaste={handlePaste}
                  ></TextField>
                  <TextField
                    size="small"
                    inputRef={(ref) => (inputRefs.current[2] = ref)}
                    onChange={(event: any) => handleInputChange(event, 2)}
                    onKeyDown={handleInputKeyDown}
                    sx={{
                      ...{
                        border:
                          theme.palette.mode === "light"
                            ? "1px solid #eee"
                            : "none",
                      },
                      ...styles?.textField,
                    }}
                    inputProps={{
                      maxLength: 1,
                      type: "number",
                      inputMode: "numeric",
                    }}
                    onPaste={handlePaste}
                  ></TextField>
                  <TextField
                    size="small"
                    inputRef={(ref) => (inputRefs.current[3] = ref)}
                    onChange={(event: any) => handleInputChange(event, 3)}
                    onKeyDown={handleInputKeyDown}
                    sx={{
                      ...{
                        border:
                          theme.palette.mode === "light"
                            ? "1px solid #eee"
                            : "none",
                      },
                      ...styles?.textField,
                    }}
                    inputProps={{
                      maxLength: 1,
                      type: "number",
                      inputMode: "numeric",
                    }}
                    onPaste={handlePaste}
                  ></TextField>
                  <TextField
                    size="small"
                    inputRef={(ref) => (inputRefs.current[4] = ref)}
                    onChange={(event: any) => handleInputChange(event, 4)}
                    onKeyDown={handleInputKeyDown}
                    sx={{
                      ...{
                        border:
                          theme.palette.mode === "light"
                            ? "1px solid #eee"
                            : "none",
                      },
                      ...styles?.textField,
                    }}
                    inputProps={{
                      maxLength: 1,
                      type: "number",
                      inputMode: "numeric",
                    }}
                    onPaste={handlePaste}
                  ></TextField>
                  <TextField
                    size="small"
                    inputRef={(ref) => (inputRefs.current[5] = ref)}
                    onChange={(event: any) => handleInputChange(event, 5)}
                    onKeyDown={handleInputKeyDown}
                    sx={{
                      ...{
                        border:
                          theme.palette.mode === "light"
                            ? "1px solid #eee"
                            : "none",
                      },
                      ...styles?.textField,
                    }}
                    inputProps={{
                      maxLength: 1,
                      type: "number",
                      inputMode: "numeric",
                    }}
                    onPaste={handlePaste}
                  ></TextField>
                </Box>
              </ThemeProvider>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                href="#"
                size="large"
                variant="contained"
                disabled={!canSubmit}
                sx={styles?.button}
                onClick={() => handleSubmit()}
              >
                {t("Submit")}
              </Button>
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

  return await getTranslations("verify email", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
