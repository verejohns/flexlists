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
import { authService } from "flexlists-api";
import { isErr } from "src/models/ApiResponse";
import { setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { PATH_AUTH, PATH_MAIN } from "src/routes/paths";

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
}

function MigrateModal({ message, setMessage }: MigrateModelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);

  const [progress, setProgress] = React.useState(10);

  // error handling
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);

  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
  }, [message]);

  const flashHandleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };
  function setError(message: string) {
    setFlashMessage(message);
  }
  function setFlashMessage(message: string, type: string = "error") {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  }

  React.useEffect(() => {
    const timer = setInterval(async () => {
      const result = await authService.getMigrationProgress();
      //console.log(result)
      if (isErr(result)) {
        // this should definitely be sent to the admin as it means catestrophic failure
        if (result.code === 401) {
          // unauthorized
          setMessage({ message: "Unauthorized, please login!", type: "error" });
          await router.push({ pathname: PATH_AUTH.login });
          return;
        }

        // TODO: what else?
      } else if (
        result.data!.status ===
        authService.LegacyMigrationQueueStatusEnum.Success
      ) {
        setProgress(100);
        clearInterval(timer);
        setMessage({
          message: "Migration finished successful!",
          type: "success",
        });
        await router.push({ pathname: PATH_MAIN.lists });
        return;
      }
    }, 2000);
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
              Importing your data
            </Typography>
            <Typography sx={{ color: "#666" }} variant="body1" gutterBottom>
              We are importing your data from previous version of FlexLists,
              this will only take a minute and is one time operation.
            </Typography>
          </Box>
          <ProgressBar variant="determinate" value={progress} />
          <Typography sx={{ color: "#666" }} variant="body2">
            Please wait...
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}

const mapStateToProps = (state: any) => ({
  message: state.view.message,
});

const mapDispatchToProps = {
  setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(MigrateModal);
