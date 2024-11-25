import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import SwitchAddRoleLabels from "./SwitchAddRoleLabels";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { Button, DialogActions } from "@mui/material";
import { PermissionsState } from "./SwitchRoleLabels";
import { applicationService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { fetchApplicationRoles } from "src/redux/actions/applicationActions";

type AddRoleDialogProps = {
  translations: TranslationText[];
  open: boolean;
  views: any[];
  applicationId: number;
  fetchApplicationRoles: (applicationId: number) => void;
  handleClose: () => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

export interface IRights {
  [id: string]: (keyof PermissionsState)[];
}

const AddRoleDialog = ({
  translations,
  open,
  views,
  applicationId,
  fetchApplicationRoles,
  handleClose,
  setFlashMessage,
}: AddRoleDialogProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [rights, setRights] = useState<IRights>({});

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
  };

  const handleSubmit = async () => {
    if (name.trim() !== "") {
      const response = await applicationService.addApplicationRole(
        applicationId,
        name,
        rights
      );

      if (isSucc(response) && response.data) {
        fetchApplicationRoles(applicationId);
        setFlashMessage({
          message: "Added role successfully",
          type: "success",
        });
        handleClose();
      } else {
        setFlashMessage({ message: response?.data?.message, type: "error" });
      }
    } else {
      setError('The "Name" field cannot be empty');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Role</DialogTitle>
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
            variant="standard"
            onChange={handleNameChange}
            error={!!error}
            helperText={error}
          />
        </div>
        {views &&
          views.map(({ id, inAppliation }: any) => {
            if (inAppliation && inAppliation === true) {
              return (
                <SwitchAddRoleLabels
                  key={id}
                  id={id}
                  setRights={setRights}
                  translations={translations}
                />
              );
            }
            return null;
          })}
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
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
  views: state.application.views,
});

const mapDispatchToProps = {
  fetchApplicationRoles,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddRoleDialog);
