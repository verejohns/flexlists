import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import {
  LinearProgressProps,
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { isErr } from "src/models/ApiResponse";
import { setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { PATH_AUTH, PATH_MAIN } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { getTranslation, getTranslations } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { subscriptionService } from "flexlists-api";
import { SubscriptionDto } from "src/models/SubscriptionDto";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#54A6FB",
  },
}));

function ProgressBar(props: LinearProgressProps & { value: number }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        my: 2,
      }}
    >
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body1" gutterBottom color="#54A6FB">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
      <Box sx={{ width: "100%", mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

interface MigrateModelProps {
  message: any;
  setMessage: (message: any) => void;
  translations: TranslationText[];
  userSubscription?: SubscriptionDto;
}

function SubscriptionProcessing({
  message,
  setMessage,
  translations,
  userSubscription,
}: MigrateModelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);

  const [progress, setProgress] = React.useState(10);

  // error handling
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
  }, [message]);

  React.useEffect(() => {
    const timer = setInterval(async () => {
      const result = await subscriptionService.getUserSubscription();
      if (isErr(result)) {
        setProgress(100);
        clearInterval(timer);
        setMessage({ message: result.message, type: "error" });
        return;
      } else {
        if (result.data && result.data.id !== userSubscription?.id) {
          setProgress(100);
          clearInterval(timer);
          setMessage({ message: "Payment successful!", type: "success" });
          await router.push({ pathname: PATH_MAIN.lists });
          return;
        }
      }
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 1 : prevProgress + 1
      );
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // --------------------AUTO OPEN TOUR VIEW START----------------------------------------------------
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true); // set the state to true after 1 second
    }, 1);

    return () => clearTimeout(timer); // clear the timeout on component unmount
  }, []);

  useEffect(() => {
    const button = document.getElementById("auto-open");
    if (isOpen && button) {
      const clickTimer = setTimeout(() => {
        button.click(); // simulate a button click after 1 second
      }, 1);

      return () => clearTimeout(clickTimer); // clear the timeout on component unmount
    }
  }, [isOpen]);

  // --------------------AUTO OPEN TOUR VIEW END----------------------------------------------------

  return (
    <Box>
      {/* --------------------BUTTON THAT AUTO OPENS MODAL ON PAGE LOAD---------------------------------------------------- */}
      <Button
        onClick={handleOpen}
        id="auto-open"
        sx={{ display: "none" }}
      ></Button>
      {/* --------------------BUTTON THAT AUTO OPENS MODAL ON PAGE LOAD---------------------------------------------------- */}
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
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            minWidth: "300px",
            maxWidth: "600px",
            backgroundColor: "#fff",
            p: 4,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom variant="h5">
              {t("Processing payment")}
            </Typography>
            <Typography sx={{ color: "#666" }} variant="body1" gutterBottom>
              Processing payment,this maybe take some minutes and is one time
              operation.
            </Typography>
          </Box>
          <ProgressBar variant="determinate" value={progress} />
          <Typography sx={{ color: "#666" }} variant="body2">
            {t("Please wait...")}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

const mapStateToProps = (state: any) => ({
  message: state.view.message,
  userSubscription: state.user.userSubscription,
});

const mapDispatchToProps = {
  setMessage,
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("pricing", context);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProcessing);
