import React, { useMemo } from "react";
import Typography from "@mui/material/Typography";
import { green, pink, red } from "@mui/material/colors";
import InputNameSetting from "src/components/formsSetting/InputNameSetting";
import Box from "@mui/material/Box";
import blue from "@mui/material/colors/blue";
import purple from "@mui/material/colors/purple";
import SelectSetting from "src/components/formsSetting/SelectSetting";
import RadioColorSetting from "src/components/formsSetting/RadioColorSetting";
import SwitchSetting from "src/components/formsSetting/SwitchSetting";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import {
  setInputLabel,
  setInputColor,
  setInputSize,
  setInputVariant,
  setInputMargin,
  setInputIsHideField,
  setInputFocused
} from "src/redux/actions/widgetActions";

type InputSettingsProps = {
  translations: TranslationText[];
  inputSettings: any;
  openPanel: boolean;
  idItem: string;
  isWidget: any;
  setInputLabel: (value: string) => void;
  setInputColor: (value: string) => void;
  setInputSize: (value: string) => void;
  setInputVariant: (value: string) => void;
  setInputMargin: (value: string) => void;
  setInputIsHideField: (value: boolean) => void;
  setInputFocused: (value: boolean) => void;
};

const InputSettings = ({
  translations,
  inputSettings,
  openPanel,
  idItem,
  isWidget,
  setInputLabel,
  setInputColor,
  setInputSize,
  setInputVariant,
  setInputMargin,
  setInputIsHideField,
  setInputFocused
}: InputSettingsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { label, color, margin, size, variant, isHideField, focused } = inputSettings[idItem] ? inputSettings[idItem] : inputSettings[0];
  const { isWidgetInput } = isWidget;
  
  const memoMargin = useMemo(() => {
    return ["dense", "normal", "none"];
  }, []);
  const memoSize = useMemo(() => {
    return ["small", "medium"];
  }, []);
  const memoVariant = useMemo(() => {
    return ["outlined", "filled", "standard"];
  }, []);
  const memoColor = useMemo(() => {
    // return [
    //   { color: blue[700], name: "primary" },
    //   { color: purple[500], name: "secondary" },
    //   { color: green[800], name: "success" },
    //   { color: red[700], name: "error" },
    //   { color: pink[800], name: "warning" },
    // ];
    return [
      { color: '#1976d2', name: "primary" },
      { color: '#7b1fa2', name: "secondary" },
      { color: '#2e7d32', name: "success" },
      { color: '#d32f2f', name: "error" },
      { color: '#ad1457', name: "warning" },
    ];
  }, []);

  if (!openPanel || !isWidgetInput) return null;

  return (
    <>
      <Typography variant="h6" component="h3" mb={2}>
        {t('Input Properties')}
      </Typography>
      <Box mb={2}>
        <InputNameSetting
          label={t("Field Label")}
          text={label}
          id={"outlinedInput2"}
          idItem={idItem}
          updateSetting={setInputLabel}
        />
      </Box>
      <Box mb={2}>
        <SelectSetting
          id={"select-size1"}
          title={t("Size")}
          value={size}
          updateSetting={setInputSize}
          menuItem={memoSize}
        />
      </Box>
      <Box mb={2}>
        <SelectSetting
          id={"select-margin"}
          title={t("Margin")}
          value={margin}
          updateSetting={setInputMargin}
          menuItem={memoMargin}
        />
      </Box>
      <Box mb={2}>
        <SelectSetting
          id={"select-variant12"}
          title={t("Variant")}
          value={variant}
          updateSetting={setInputVariant}
          menuItem={memoVariant}
        />
      </Box>
      <Box mb={2}>
        <RadioColorSetting
          name={"color-radio-button"}
          radioItem={memoColor}
          checked={color}
          title={t("Color")}
          updateSetting={setInputColor}
        />
      </Box>
      <Box>
        <SwitchSetting
          label={t("Hide field")}
          updateSetting={setInputIsHideField}
          checked={isHideField}
        />
      </Box>
      <Box mb={2}>
        <SwitchSetting
          label={t("Focused")}
          updateSetting={setInputFocused}
          checked={focused}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  inputSettings: state.widget.input,
  openPanel: state.application.openPanel,
  idItem: state.widget.idItem,
  isWidget: state.widget.isWidget
});

const mapDispatchToProps = {
  setInputLabel,
  setInputColor,
  setInputSize,
  setInputVariant,
  setInputMargin,
  setInputIsHideField,
  setInputFocused
};

export default connect(mapStateToProps, mapDispatchToProps)(InputSettings);
