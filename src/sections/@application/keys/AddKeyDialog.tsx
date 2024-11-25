import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { Button, DialogActions } from "@mui/material";
import { applicationService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isSucc, FlexlistsError } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { fetchApplicationKeys } from "src/redux/actions/applicationActions";

type AddKeyDialogProps = {
  translations: TranslationText[];
  open: boolean;
  applicationId: number;
  fetchApplicationKeys: (applicationId: number) => void;
  handleClose: () => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const AddKeyDialog = ({
  translations,
  open,
  applicationId,
  fetchApplicationKeys,
  handleClose,
  setFlashMessage,
}: AddKeyDialogProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });
  const { name, description } = formValues;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (name.trim() !== "") {
      const response = await applicationService.createApplicationKey(
        applicationId,
        name,
        description
      );

      if (isSucc(response) && response.data) {
        fetchApplicationKeys(applicationId);
        setFlashMessage({
          message: "Added keys successfully",
          type: "success",
        });
        resetForm();
        handleClose();
      } else {
        setFlashMessage({ message: response?.data?.message, type: "error" });
      }
    } else {
      setError('The "Name" field cannot be empty');
    }
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      description: "",
    });
    setError("");
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("Add Key")}</DialogTitle>
        <DialogContent style={{ width: "370px" }}>
          <div style={{ paddingBottom: "10px" }}>
            <TextField
              required
              autoFocus
              value={name}
              margin="dense"
              id="name"
              label={t("Name")}
              type="text"
              fullWidth
              onChange={handleInputChange}
              error={!!error}
              helperText={error}
            />
            <TextField
              rows={4}
              margin="dense"
              id="description"
              label={t("Description")}
              value={description}
              fullWidth
              multiline
              type="text"
              onChange={handleInputChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <Button variant="outlined" size="small" onClick={handleClose}>
              {t("Cancel")}
            </Button>
            <Button variant="contained" size="small" onClick={handleSubmit}>
              {t("Save")}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
});

const mapDispatchToProps = {
  fetchApplicationKeys,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddKeyDialog);
