import {
  Alert,
  AlertColor,
  Box,
  Container,
  Grid,
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
import { GetServerSideProps } from "next";
import { validateToken } from "src/utils/tokenUtils";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";

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

  useEffect(() => {
    const checkMessage = () => {
      if (message?.message) {
        setFlash(message);
      }
    };

    checkMessage();
  }, [message]);

  useEffect(() => {
    async function verifyEmail() {
      try {
        let verifyResponse = await authService.verifySignup(
          router.query.token as string,
          router.query.email as string
        );
        if (
          isSucc(verifyResponse) &&
          verifyResponse.data &&
          verifyResponse.data.isValidated
        ) {
          setMessage({
            message: "Your account has been activated, please login!",
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
            pathname: PATH_AUTH.resendEmailVerification,
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
          pathname: PATH_AUTH.resendEmailVerification,
          query: { email: router.query.email as string },
        });
        return;
        //console.log(err)
        //setVerifyResult("Verify fail")
      }
    }
    if (router.query.token && router.isReady) {
      verifyEmail();
    }
  }, [router.query.token]);

  const handleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  return (
    <>
      <Box
        component="img"
        sx={{
          height: "100%",
          width: "100%",
          position: "absolute",
          zIndex: -1,
        }}
        alt="The house from the offer."
        src="/assets/images/background.png"
      />
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            py: 4,
            px: { xs: 1, md: 4 },
            borderRadius: "4px",
            boxShadow: "0 0 64px 0 rgba(0,0,0,0.1)",
            backgroundColor: "white",
          }}
        >
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {t("Title")}
            </Typography>
            <Typography variant="body1">{t("Description")}</Typography>
          </Grid>
        </Grid>
      </Container>
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

  return await getTranslations("verify token", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailToken);
