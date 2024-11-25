import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import IconToggleButton from "src/components/buttons/IconToggleButton";
import React, { ReactElement, useMemo } from "react";
import TabletAndroidIcon from "@mui/icons-material/TabletAndroid";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { setLayoutDialog, setBreakpoint } from "src/redux/actions/applicationActions";
import { connect } from "react-redux";

type LayoutDialogProps = {
  translations: TranslationText[];
  children: ReactElement;
  breakpoint: string;
  layoutDialog: boolean;
  handleSubmit: () => void;
  setCustomLayoutKey: React.Dispatch<React.SetStateAction<number>>;
  setLayoutDialog: (value: boolean) => void;
  setBreakpoint: (value: string) => void;
};

const LayoutDialog = ({
  translations,
  children,
  breakpoint,
  layoutDialog,
  handleSubmit,
  setCustomLayoutKey,
  setLayoutDialog,
  setBreakpoint
}: LayoutDialogProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  
  const memoToggleButton = useMemo(() => {
    return [
      { size: "768px", icon: <TabletAndroidIcon /> },
      {
        size: "1024px",
        icon: <TabletAndroidIcon style={{ transform: "rotate(90deg)" }} />,
      },
      { size: "320px", icon: <PhoneAndroidOutlinedIcon /> },
      {
        size: "480px",
        icon: (
          <PhoneAndroidOutlinedIcon style={{ transform: "rotate(90deg)" }} />
        ),
      },
    ];
  }, []);

  const handleClose = async () => {
    setLayoutDialog(false);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setCustomLayoutKey((prevKey: number) => prevKey + 1);
  };

  return (
    <Dialog
      fullWidth
      open={layoutDialog}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            maxWidth: "1112px",
          },
        },
      }}
    >
      <Stack
        mt={1}
        mb={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <IconToggleButton
          value={breakpoint}
          updateSetting={setBreakpoint}
          size={"small"}
          color={"standard"}
          toggleButton={memoToggleButton}
        />

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent dividers>
        <Box
          sx={{
            marginRight: "auto",
            marginLeft: "auto",
            width: `${breakpoint}`,
            background: "#fff",
            border: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          {t('Submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = (state: any) => ({
  breakpoint: state.application.breakpoint,
  layoutDialog: state.application.layoutDialog
});

const mapDispatchToProps = {
  setLayoutDialog,
  setBreakpoint
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutDialog);
