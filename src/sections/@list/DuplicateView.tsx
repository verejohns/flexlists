import React, { useState } from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import CentralModal from "src/components/modal/CentralModal";
import { connect } from "react-redux";
import { View } from "src/models/SharedModels";
import { listViewService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { useRouter } from "next/router";
import { PATH_MAIN } from "src/routes/paths";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useTheme } from "@mui/material/styles";

type DuplicateViewProps = {
  open: boolean;
  translations: TranslationText[];
  handleClose: () => void;
  currentView: View;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const DuplicateView = ({
  open,
  translations,
  handleClose,
  currentView,
  setFlashMessage,
}: DuplicateViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };
  const handleViewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleViewDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const onSubmit = async () => {
    setIsSubmit(true);
    let _errors: { [key: string]: string | boolean } = {};

    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };
    let newViewName = await frontendValidate(
      ModelValidatorEnum.TableView,
      FieldValidatorEnum.name,
      name,
      _errors,
      _setErrors,
      true
    );
    if (isFrontendError(FieldValidatorEnum.name, _errors, setErrors, setError))
      return;
    var response = await listViewService.createView(
      currentView.listId,
      newViewName,
      currentView.type,
      currentView.config,
      currentView.template,
      currentView.category,
      currentView.page,
      currentView.limit,
      currentView.order,
      currentView.query,
      description,
      currentView.conditions,
      currentView.fields
    );
    if (isSucc(response) && response.data && response.data.viewId) {
      await router.push(`${PATH_MAIN.views}/${response.data.viewId}`);
      router.reload();
      handleClose();
    } else {
      setError(response.message);
    }
  };
  return (
    <CentralModal open={open} handleClose={handleClose} zIndex={1200}>
      <Typography variant="h6" color={theme.palette.palette_style.text.primary}>
        {t("Duplicate View")}
      </Typography>
      <Divider sx={{ my: 2 }}></Divider>
      <Box>
        {/* <Typography variant="subtitle2">{t("Name")}</Typography> */}
        <TextField
          fullWidth
          onChange={handleViewNameChange}
          value={name}
          label={t("Name")}
          required
          error={isSubmit && isFrontendError(FieldValidatorEnum.name, errors)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        {/* <Typography variant="subtitle2" sx={{ mt: 2 }}>
          {t("Description")}
        </Typography> */}
        <TextField
          multiline
          rows={4}
          fullWidth
          label={t("Description")}
          value={description}
          onChange={handleViewDescriptionChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      {/* <FormGroup>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Copy content"
        />
      </FormGroup> */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => onSubmit()}>
          {t("Duplicate")}
        </Button>
        <Button onClick={handleClose} sx={{ mt: 2, ml: 2 }} variant="text">
          {t("Cancel")}
        </Button>
      </Box>
    </CentralModal>
  );
};
const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(DuplicateView);
