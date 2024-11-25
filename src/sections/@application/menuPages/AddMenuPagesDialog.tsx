import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { Button, DialogActions } from "@mui/material";
import { applicationService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { fetchApplicationMenus } from "src/redux/actions/applicationActions";

type AddMenuPagesDialogProps = {
  translations: TranslationText[];
  open: boolean;
  applicationId: number;
  isEdit: boolean;
  id: number;
  menus: any[];
  fetchApplicationMenus: (applicationId: number) => void;
  handleClose: () => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const AddMenuPagesDialog = ({
  translations,
  open,
  applicationId,
  isEdit,
  id,
  menus,
  fetchApplicationMenus,
  handleClose,
  setFlashMessage,
}: AddMenuPagesDialogProps) => {
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
      const response = await applicationService.createApplicationMenuPage(
        applicationId,
        name,
        description
      );

      if (isSucc(response) && response.data) {
        fetchApplicationMenus(applicationId);
        setFlashMessage({
          message: "Added menu page successfully",
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

  const handleUpdate = async () => {
    // if (idAPP !== 0 && token) {
    //   dispatch(
    //     updateAsyncMenuPages({
    //       id,
    //       applicationId: idAPP,
    //       name,
    //       description,
    //       token,
    //     })
    //   );
    //   resetForm();
    //   handleClose();
    // }
  };

  const resetForm = () => {
    setFormValues({
      name: "",
      description: "",
    });
    setError("");
  };

  useEffect(() => {
    if (isEdit) {
      const currentItem = menus.find((item: any) => item.id === id);

      if (currentItem) {
        setFormValues((prevState) => ({
          ...prevState,
          name: currentItem?.name,
          description: currentItem?.description,
        }));
      }
    } else {
      resetForm();
    }
  }, [menus, id, isEdit]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? t("Edit Page") : t("Add Page")}</DialogTitle>
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
              value={description || ""}
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
            {isEdit ? (
              <Button variant="contained" size="small" onClick={handleUpdate}>
                {t("Save Edit")}
              </Button>
            ) : (
              <Button variant="contained" size="small" onClick={handleSubmit}>
                {t("Save")}
              </Button>
            )}
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
  menus: state.application.menus,
});

const mapDispatchToProps = {
  fetchApplicationMenus,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMenuPagesDialog);
