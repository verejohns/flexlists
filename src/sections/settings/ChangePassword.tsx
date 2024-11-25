import React, { useState } from "react";
import { Box, Modal, Button, Typography, TextField } from "@mui/material";
import { accountService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 400, md: 600 },
  bgcolor: "background.paper",
  border: "none",
  boxShadow: "none",
  p: 4,
  borderRadius: "8px",
};

export type ChangePasswordProps = {
  translations: TranslationText[];
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
};

const ChangePassword = ({
  translations,
  setFlashMessage,
}: ChangePasswordProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = React.useState("");
  const [formDirty, setFormDirty] = useState<
    { field: string; isDirty: boolean }[]
  >([
    { field: "oldPassword", isDirty: false },
    { field: "newPassword", isDirty: false },
    { field: "newPasswordConfirm", isDirty: false },
  ]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const setFieldDirty = (field: string) => {
    const newFormDirty = formDirty.map((item) => {
      if (item.field === field) {
        return { ...item, isDirty: true };
      }

      return item;
    });

    setFormDirty(newFormDirty);
  };

  const isFieldDirty = (field: string) => {
    return formDirty.find((item) => item.field === field)?.isDirty;
  };

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
    setFieldDirty("oldPassword");
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setFieldDirty("newPassword");
    setIsSubmit(false);
  };

  const handleNewPasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPasswordConfirm(e.target.value);
    setFieldDirty("newPasswordConfirm");
  };

  const isFormInvalid = () => {
    return (
      !oldPassword ||
      !newPassword ||
      !newPasswordConfirm ||
      newPassword !== newPasswordConfirm
    );
  };

  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };

  const onSubmit = async () => {
    if (isFormInvalid()) {
      setFlashMessage({
        message: "Password and Confirm Password does not match",
        type: "error",
      });
      return;
    }

    setIsSubmit(true);

    let _errors: { [key: string]: string | boolean } = {};
    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };

    await frontendValidate(
      ModelValidatorEnum.User,
      FieldValidatorEnum.password,
      newPassword,
      _errors,
      _setErrors,
      true
    );

    if (
      isFrontendError(FieldValidatorEnum.password, _errors, setErrors, setError)
    )
      return;

    let response = await accountService.changePassword(
      oldPassword,
      newPassword
    );

    if (isSucc(response)) {
      setFlashMessage({
        message: "Password changed successfully",
        type: "success",
      });
      handleClose();
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="outlined">
        {t("Change password")}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" sx={{ mb: 4 }}>
            {t("Change your password")}
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography
              id="modal-modal-title"
              variant="subtitle2"
              component="span"
            >
              {t("Current Password")}
            </Typography>
            <TextField
              value={oldPassword}
              onChange={handleOldPasswordChange}
              error={isFieldDirty("oldPassword") && !oldPassword}
              onBlur={() => setFieldDirty("oldPassword")}
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography
              id="modal-modal-title"
              variant="subtitle2"
              component="span"
            >
              {t("New Password")}
            </Typography>
            <TextField
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={
                (isFieldDirty("newPassword") && !newPassword) ||
                (isSubmit &&
                  isFrontendError(FieldValidatorEnum.password, errors))
              }
              onBlur={() => setFieldDirty("newPassword")}
              fullWidth
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography
              id="modal-modal-title"
              variant="subtitle2"
              component="span"
            >
              {t("Confirm New Password")}
            </Typography>
            <TextField
              value={newPasswordConfirm}
              onChange={handleNewPasswordConfirmChange}
              error={
                isFieldDirty("newPasswordConfirm") &&
                (!newPasswordConfirm || newPasswordConfirm !== newPassword)
              }
              onBlur={() => setFieldDirty("newPasswordConfirm")}
              fullWidth
            />
            {isFieldDirty("newPasswordConfirm") &&
              newPasswordConfirm !== newPassword && (
                <Typography
                  id="modal-modal-title"
                  variant="subtitle2"
                  component="span"
                >
                  {t("Password and Confirm Password")}
                </Typography>
              )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Button
              variant="contained"
              disabled={isFormInvalid()}
              onClick={() => onSubmit()}
            >
              {t("Update")}
            </Button>
            <Button sx={{ ml: 2 }} onClick={handleClose} variant="text">
              {t("Cancel")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
