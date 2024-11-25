import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import CentralModal from "src/components/modal/CentralModal";
import { connect } from "react-redux";
import { View } from "src/models/SharedModels";
import { listViewService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { setFlashMessage } from "src/redux/actions/authAction";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { PATH_MAIN } from "src/routes/paths";
import { is } from "date-fns/locale";

type RemigrateViewProps = {
  open: boolean;
  translations: TranslationText[];
  handleClose: () => void;
  currentView: View;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const RemigrateView = ({
  open,
  translations,
  handleClose,
  currentView,
  setFlashMessage,
}: RemigrateViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [windowHeight, setWindowHeight] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [newMigrateName, setNewMigrateName] = useState<string>(
    currentView.name
  );
  const [legacyUserPassword, setLegacyUserPassword] = useState<string>("");
  const [isKeepCurrentList, setIsKeepCurrentList] = useState<boolean>(false);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const handleNewMigrateNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMigrateName(event.target.value);
  };
  const handleLegacyUserPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLegacyUserPassword(event.target.value);
  };
  const onKeepCurrentListChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsKeepCurrentList(event.target.checked);
  };
  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };
  const onSubmit = async () => {
    if (!newMigrateName) {
      setError(t("Migrate Name is required"));
      return;
    }
    if (!legacyUserPassword) {
      setError(t("Legacy User Password is required"));
      return;
    }
    setIsSubmit(true);
    let _errors: { [key: string]: string | boolean } = {};

    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };
    let newViewName = await frontendValidate(
      ModelValidatorEnum.TableView,
      FieldValidatorEnum.name,
      newMigrateName,
      _errors,
      _setErrors,
      true
    );
    if (isFrontendError(FieldValidatorEnum.name, _errors, setErrors, setError))
      return;
    var response = await listViewService.remigrateLegacyList(
      currentView.id,
      newViewName,
      legacyUserPassword,
      isKeepCurrentList
    );
    if (isSucc(response)) {
      handleClose();
      setFlashMessage({ type: "success", message: "Remigrate Success" });
      window.location.href = `${PATH_MAIN.lists}/${response.data.viewId}`;
    } else {
      setError((response as FlexlistsError).message);
    }
  };
  return (
    <CentralModal open={open} handleClose={handleClose} zIndex={1200}>
      <Typography variant="h6" color={theme.palette.palette_style.text.primary}>
        {t("Remigrate Legacy List")}
      </Typography>
      <Divider sx={{ my: 2 }}></Divider>

      <>
        <Box sx={{ mt: 2 }}>
          <TextField
            label={t("Legacy User Password")}
            fullWidth
            onChange={handleLegacyUserPasswordChange}
            value={legacyUserPassword}
            required
            error={isSubmit && isFrontendError(FieldValidatorEnum.name, errors)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            color={theme.palette.palette_style.text.primary}
          >
            {t("delete migrate list alert")}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isKeepCurrentList}
                onChange={onKeepCurrentListChange}
                name="keep_current_list"
              />
            }
            label={t("Keep Current List")}
          />
        </Box>
        {isKeepCurrentList && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label={t("New Migrate Name")}
              fullWidth
              onChange={handleNewMigrateNameChange}
              value={newMigrateName}
              required
              error={
                isSubmit && isFrontendError(FieldValidatorEnum.name, errors)
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} sx={{ mt: 2 }} variant="text">
            {t("Cancel")}
          </Button>
          <Button
            sx={{ mt: 2, ml: 2 }}
            variant="contained"
            onClick={() => onSubmit()}
          >
            {t("Submit")}
          </Button>
        </Box>
      </>
    </CentralModal>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(RemigrateView);
