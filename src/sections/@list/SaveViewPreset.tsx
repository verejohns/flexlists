import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { PresetType, Role } from "src/enums/SharedEnums";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { PresetModel, View } from "src/models/SharedModels";
import { setFlashMessage } from "src/redux/actions/authAction";
import {
  getCurrentView,
  setCurrentView,
  setDefaultPreset,
  fetchRows,
} from "src/redux/actions/viewActions";
import { listViewService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/utils/responses";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useTheme } from "@mui/material/styles";
import { hasPermission } from "src/utils/permissionHelper";
import { initViewStorage, saveViewPresetStorage } from "src/utils/localStorage";

type SaveViewPresetProps = {
  translations: TranslationText[];
  currentView: View;
  setCurrentView: (view: View) => void;
  handleClose: () => void;
  setFlashMessage: (message: FlashMessageModel) => void;
  setDefaultPreset: (preset: any) => void;
  getCurrentView: (viewId: number) => void;
  fetchRows: () => void;
  setSelectedPreset: (preset: any) => void;
};

const SaveViewPreset = ({
  translations,
  currentView,
  getCurrentView,
  setCurrentView,
  setDefaultPreset,
  handleClose,
  setFlashMessage,
  fetchRows,
  setSelectedPreset,
}: SaveViewPresetProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [type, setType] = useState<PresetType>(PresetType.View);
  const [name, setName] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const theme = useTheme();

  useEffect(() => {
    if (currentView) {
      setType(
        currentView.role !== Role.FullAccess
          ? PresetType.Yourself
          : PresetType.View
      );
    }
  }, [currentView]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType((event.target as HTMLInputElement).value as PresetType);
  };

  const handleViewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setIsNameValid(true);
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
    let newName: string = "";

    if (type !== PresetType.View) {
      newName = await frontendValidate(
        ModelValidatorEnum.TableView,
        FieldValidatorEnum.name,
        name,
        _errors,
        _setErrors,
        true
      );

      if (
        isFrontendError(FieldValidatorEnum.name, _errors, setErrors, setError)
      )
        return;
      if (
        newName?.trim().toLowerCase() === "default" ||
        newName?.trim().toLowerCase() === "show all" ||
        newName?.trim().toLowerCase() === "archived" ||
        newName?.trim().toLowerCase() === "unarchived"
      ) {
        setIsNameValid(false);
        setFlashMessage({ message: t("Name Already Exist"), type: "error" });
        return;
      }
      if (
        currentView &&
        currentView.presets &&
        currentView.presets.length > 0
      ) {
        const isExist = currentView.presets.find(
          (p) => p.name.toLowerCase() === newName?.toLowerCase()
        );
        if (isExist) {
          setFlashMessage({ message: t("Name Already Exist"), type: "error" });
          return;
        }
      }
    }

    const response = await listViewService.saveViewPreset(
      currentView.id,
      type,
      newName,
      currentView.page,
      currentView.limit,
      currentView.order,
      currentView.query,
      currentView.conditions,
      currentView.fields
    );

    if (isSucc(response)) {
      let newView = cloneDeep(currentView);
      let newPreset: PresetModel = {};

      if (type === PresetType.View) {
        newPreset = {
          name: "Default",
          type: type,
          page: newView.page,
          limit: newView.limit,
          order: newView.order,
          query: currentView.query,
          conditions: newView.conditions,
          fields: newView.fields,
        };

        setDefaultPreset(newPreset);
      } else {
        if (!newView.presets) {
          newView.presets = [];
        }

        let cloneView = cloneDeep(currentView);
        newPreset = {
          name: newName,
          type: type,
          page: cloneView.page,
          limit: cloneView.limit,
          order: cloneView.order,
          query: cloneView.query,
          conditions: cloneView.conditions,
          fields: cloneView.fields,
        };

        newView.presets.push(newPreset);
      }

      setSelectedPreset(newPreset);
      initViewStorage(
        currentView.id,
        newPreset.conditions,
        newPreset.order,
        newPreset.query,
        newPreset.fields,
        newPreset.page,
        newPreset.limit,
        newPreset
      );
      // saveViewPresetStorage(currentView.id, newPreset);
      setCurrentView(newView);
      fetchRows();

      // if(type === PresetType.View)
      // {
      //   setDefaultPreset({
      //     name:'Default',
      //     type:cloneDeep(type),
      //     page:cloneDeep(currentView.page),
      //     limit:cloneDeep(currentView.limit),
      //     order:cloneDeep(currentView.order),
      //     query:cloneDeep(currentView.query),
      //     conditions:cloneDeep(currentView.conditions),
      //     fields:cloneDeep(currentView.fields)
      //   })
      // }
      // else
      // {
      //     let newView = cloneDeep(currentView)

      //     if(!newView.presets)
      //     {
      //       newView.presets = []
      //     }
      //     newView.presets.push({
      //         name:newName,
      //         type:cloneDeep(type),
      //         page:cloneDeep(currentView.page),
      //         limit:cloneDeep(currentView.limit),
      //         order:cloneDeep(currentView.order),
      //         query:cloneDeep(currentView.query),
      //         conditions:cloneDeep(currentView.conditions),
      //         fields:cloneDeep(currentView.fields)
      //     });
      //     setCurrentView(newView)
      // }

      setFlashMessage({
        message: t("Save View Preset"),
        type: "success",
      });
      handleClose();
    } else {
      setError((response as FlexlistsError).message);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: theme.palette.palette_style.background.paper,
      }}
    >
      <FormControl sx={{ gap: 1 }}>
        <FormLabel
          id="demo-row-radio-buttons-group-label"
          sx={{ color: theme.palette.palette_style.text.primary }}
        >
          {t("Preset Types")}
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={type}
          onChange={handleTypeChange}
          sx={{ color: theme.palette.palette_style.text.primary }}
        >
          {hasPermission(currentView?.role, "All") && (
            <FormControlLabel
              value={t("View")}
              control={<Radio />}
              label={PresetType.View}
            />
          )}
          <FormControlLabel
            value={t("Yourself")}
            control={<Radio />}
            label={PresetType.Yourself}
          />
          {hasPermission(currentView?.role, "All") && (
            <FormControlLabel
              value={t("Everyone")}
              control={<Radio />}
              label={PresetType.Everyone}
            />
          )}
        </RadioGroup>
      </FormControl>
      {(type === PresetType.Everyone || type === PresetType.Yourself) && (
        <TextField
          fullWidth
          onChange={handleViewNameChange}
          value={name}
          label={t("Preset Name")}
          InputLabelProps={{
            shrink: true,
          }}
          // placeholder="Name"
          required
          error={
            isSubmit &&
            (!isNameValid || isFrontendError(FieldValidatorEnum.name, errors))
          }
        />
      )}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={handleClose} variant="outlined">
          {t("Cancel")}
        </Button>
        <Button variant="contained" onClick={() => onSubmit()}>
          {t("Save")}
        </Button>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setCurrentView,
  setFlashMessage,
  setDefaultPreset,
  getCurrentView,
  fetchRows,
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveViewPreset);
