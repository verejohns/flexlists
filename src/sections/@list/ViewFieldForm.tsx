import { useState, useEffect } from "react";
import {
  Button,
  Stack,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ViewField } from "src/models/ViewField";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { ErrorConsts } from "src/constants/errorConstants";
import { fieldService } from "flexlists-api";
import { View } from "src/models/SharedModels";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";

interface ViewFieldFormProps {
  currentView: View;
  field: ViewField;
  onUpdate: (field: ViewField) => void;
  onClose: () => void;
  setFlashMessage: (message: FlashMessageModel) => void;
  columns: ViewField[];
}
function ViewFieldForm({
  currentView,
  field,
  onUpdate,
  onClose,
  setFlashMessage,
  columns,
}: ViewFieldFormProps) {
  const theme = useTheme();
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [currentField, setCurrentField] = useState<ViewField>(field);

  const [submit, setSubmit] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    setSubmit(false);
    if (field) {
      setCurrentField(field);
    }
  }, [field]);
  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };
  const handleSubmit = async () => {
    setSubmit(true);
    if (!currentField.viewFieldName) {
      setError("Name is required");
      return;
    }
    let _errors: { [key: string]: string | boolean } = {};

    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };
    let newGroupName = await frontendValidate(
      ModelValidatorEnum.FieldDefinition,
      FieldValidatorEnum.name,
      currentField.viewFieldName,
      _errors,
      _setErrors,
      true
    );
    if (isFrontendError(FieldValidatorEnum.name, _errors, setErrors, setError))
      return;

    let existingViewFieldName = columns.find(
      (x) =>
        x.viewFieldName?.trim().toLowerCase() ==
          currentField.viewFieldName?.trim().toLowerCase() &&
        x.id != currentField.id
    );
    if (existingViewFieldName) {
      setError("Name already exists");
      return;
    }
    var existingField = currentView.fields?.find(
      (x) => x.id == currentField.id
    );
    if (existingField) {
      var updateViewFieldResponse = await fieldService.updateViewField(
        currentView.id,
        currentField.id,
        currentField.viewFieldColor,
        currentField.viewFieldName,
        currentField.viewFieldDetailsOnly,
        currentField.viewFieldVisible
      );
      if (isSucc(updateViewFieldResponse)) {
        onUpdate(currentField);
      } else {
        setError((updateViewFieldResponse as FlexlistsError).message);
        return;
      }
    } else {
      var createiewFieldResponse = await fieldService.createViewField(
        currentView.id,
        currentField.id,
        currentField.viewFieldColor,
        currentField.viewFieldName,
        currentField.viewFieldDetailsOnly,
        currentField.viewFieldVisible
      );
      if (isSucc(createiewFieldResponse)) {
        onUpdate(currentField);
      } else {
        setError((createiewFieldResponse as FlexlistsError).message);
        return;
      }
    }

    onClose();
  };
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newField = Object.assign({}, currentField);
    newField.viewFieldName = event.target.value;
    setCurrentField(newField);
  };
  const onDetailsOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newField = Object.assign({}, currentField);
    newField.viewFieldDetailsOnly = event.target.checked;
    setCurrentField(newField);
  };
  const onVisibleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newField = Object.assign({}, currentField);
    newField.viewFieldVisible = event.target.checked;
    setCurrentField(newField);
  };
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack
        sx={{
          // width: '100%',
          // minWidth: { xs: '300px', sm: '360px', md: '400px' },
          paddingTop: 1,
        }}
      >
        <TextField
          label="Name"
          name="name"
          size="small"
          value={currentField.viewFieldName}
          onChange={onNameChange}
          required
          error={submit && isFrontendError(FieldValidatorEnum.name, errors)}
        />
        <FormGroup sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={currentField.viewFieldDetailsOnly}
                onChange={onDetailsOnlyChange}
                name="required"
              />
            }
            label="DetailsOnly"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={currentField.viewFieldVisible}
                onChange={onVisibleChange}
                name="required"
              />
            }
            label="Visible"
          />
        </FormGroup>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Update Field
        </Button>
      </Box>
    </form>
  );
}
const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewFieldForm);
