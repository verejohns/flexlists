import React from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import CentralModal from "src/components/modal/CentralModal";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useTheme } from "@mui/material/styles";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { setFlashMessage } from "src/redux/actions/authAction";

type YesNoDialogProps = {
  translations: TranslationText[];
  title: string;
  submitText: string;
  message: string;
  open: boolean;
  onSubmit: () => void;
  handleClose: () => void;
  zIndex?: number;
  confirmValue?: string;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
};

const YesNoDialog = ({
  title,
  submitText,
  message,
  open,
  translations,
  handleClose,
  onSubmit,
  zIndex,
  confirmValue,
  setFlashMessage,
}: YesNoDialogProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [currentConfirmValue, setCurrentConfirmValue] =
    React.useState<string>("");
  const [isSubmit, setIsSubmit] = React.useState<boolean>(false);
  const [isConfirmError, setIsConfirmError] = React.useState<boolean>(false);
  const theme = useTheme();
  const handleSubmit = async () => {
    setIsSubmit(true);
    if (
      confirmValue &&
      confirmValue.trim()?.toLowerCase() !==
        currentConfirmValue?.trim()?.toLowerCase()
    ) {
      setFlashMessage({ type: "error", message: t("Confirm Value wrong") });
      setIsConfirmError(true);
      return;
    }
    onSubmit();
    handleClose();
  };

  const handleConfirmValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentConfirmValue(event.target.value);
    setIsSubmit(false);
    setIsConfirmError(false);
  };
  return (
    <CentralModal open={open} handleClose={handleClose} zIndex={zIndex}>
      <Typography variant="h6" color={theme.palette.palette_style.text.primary}>
        {title}
      </Typography>
      <Divider sx={{ my: 2 }}></Divider>
      <Box>
        <Typography
          variant="body1"
          color={theme.palette.palette_style.text.primary}
        >
          {message}
        </Typography>
      </Box>
      {confirmValue && (
        <>
          <Box sx={{ my: 2 }}>
            <Typography
              variant="body1"
              color={theme.palette.palette_style.text.primary}
            >
              {`${t("Please enter the following value")}: `}
              <strong>{confirmValue}</strong>
            </Typography>
          </Box>
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              onChange={handleConfirmValueChange}
              value={currentConfirmValue}
              // placeholder={t("Name")}
              required
              error={isSubmit && isConfirmError}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => handleSubmit()}
        >
          {submitText}
        </Button>
        <Button onClick={handleClose} sx={{ mt: 2, ml: 2 }} variant="text">
          {t("Cancel")}
        </Button>
      </Box>
    </CentralModal>
  );
};
const mapStateToProps = (state: any) => ({
  languages: state.admin.languages,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(YesNoDialog);
