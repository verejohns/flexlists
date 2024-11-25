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
import { listService } from "flexlists-api";
type CloneListProps = {
  open: boolean;
  translations: TranslationText[];
  handleClose: () => void;
  currentView: View;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const CloneList = ({
  open,
  translations,
  handleClose,
  currentView,
  setFlashMessage,
}: CloneListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [windowHeight, setWindowHeight] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>("");
  const [newListDescription, setNewListDescription] = useState<string>("");
  const [isIncludeViews, setIsIncludeViews] = useState<boolean>(false);
  const [isIncludeContents, setIsIncludeContents] = useState<boolean>(false);
  const [isIncludeRelationTables, setIsIncludeRelationTables] =
    useState<boolean>(false);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const handleNewListNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewListName(event.target.value);
    setIsSubmit(false);
  };
  const handleNewListDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewListDescription(event.target.value);
  };
  const onIsIncludeViewsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsIncludeViews(event.target.checked);
  };
  const onIsIncludeContentsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsIncludeContents(event.target.checked);
  };
  const onIsIncludeRelationTablesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsIncludeRelationTables(event.target.checked);
  };
  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
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
      newListName,
      _errors,
      _setErrors,
      true
    );
    if (isFrontendError(FieldValidatorEnum.name, _errors, setErrors, setError))
      return;
    var response = await listService.cloneList(
      currentView.id,
      newViewName,
      newListDescription,
      isIncludeViews,
      isIncludeContents,
      isIncludeRelationTables
    );
    if (isSucc(response)) {
      handleClose();
      setFlashMessage({ type: "success", message: "Clone List Success" });
      window.location.href = `${PATH_MAIN.lists}/${response.data.viewId}`;
    } else {
      setError((response as FlexlistsError).message);
    }
  };
  return (
    <CentralModal open={open} handleClose={handleClose} zIndex={1200}>
      <Typography variant="h6" color={theme.palette.palette_style.text.primary}>
        {t("Clone List")}
      </Typography>
      <Divider sx={{ my: 2 }}></Divider>

      <>
        <Box sx={{ mt: 2 }}>
          <TextField
            label={t("Name")}
            fullWidth
            onChange={handleNewListNameChange}
            value={newListName}
            required
            error={isSubmit && isFrontendError(FieldValidatorEnum.name, errors)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            label={t("Description")}
            multiline
            rows={4}
            fullWidth
            onChange={handleNewListDescriptionChange}
            value={newListDescription}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isIncludeViews}
                onChange={onIsIncludeViewsChange}
                name="include_views"
              />
            }
            label={t("Clone Views")}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isIncludeContents}
                onChange={onIsIncludeContentsChange}
                name="include_contents"
              />
            }
            label={t("Clone Contents")}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isIncludeRelationTables}
                onChange={onIsIncludeRelationTablesChange}
                name="include_contents"
              />
            }
            label={t("Clone Relation Tables")}
          />
        </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(CloneList);
