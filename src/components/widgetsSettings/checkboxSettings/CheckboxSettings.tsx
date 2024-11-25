import React, { useMemo, memo } from "react";
import Typography from "@mui/material/Typography";
import { green, pink, red } from "@mui/material/colors";
import InputNameSetting from "src/components/formsSetting/InputNameSetting";
import Box from "@mui/material/Box";
import RadioColorSetting from "src/components/formsSetting/RadioColorSetting";
import blue from "@mui/material/colors/blue";
import purple from "@mui/material/colors/purple";
import InputGroupSetting from "src/components/formsSetting/InputGroupSetting";
import SwitchSetting from "src/components/formsSetting/SwitchSetting";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import {
  setCheckboxHide,
  setCheckboxTitle,
  setCheckboxRow,
  setCheckboxColor,
  addCheckboxItem,
  setIsAddOption
} from "src/redux/actions/widgetActions";

type CheckboxSettingsProps = {
  translations: TranslationText[];
  checkboxSettings: any;
  openPanel: boolean;
  idItem: string;
  isWidget: any;
  setCheckboxHide: (value: boolean) => void;
  setCheckboxTitle: (value: string) => void;
  setCheckboxRow: (value: boolean) => void;
  setCheckboxColor: (value: string) => void;
  addCheckboxItem: (value: any) => void;
  setIsAddOption: (value: boolean) => void;
};

const CheckboxSettings = ({
  translations,
  checkboxSettings,
  openPanel,
  idItem,
  isWidget,
  setCheckboxHide,
  setCheckboxTitle,
  setCheckboxRow,
  setCheckboxColor,
  addCheckboxItem,
  setIsAddOption
}: CheckboxSettingsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { info: { isHideField, title, isRow, color } } = checkboxSettings[idItem] ? checkboxSettings[idItem] : checkboxSettings[0];
  const { isWidgetCheckbox } = isWidget;
  
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
      { color: '#9c27b0', name: "secondary" },
      { color: '#2e7d32', name: "success" },
      { color: '#d32f2f', name: "error" },
      { color: '#ad1457', name: "warning" },
    ];
  }, []);

  if (!openPanel || !isWidgetCheckbox) return null;

  return (
    <>
      <Typography variant="h6" component="h3" mb={2}>
        {t('Multiple Choice Properties')}
      </Typography>
      <Box mb={2}>
        <InputNameSetting
          label={t("Field Label")}
          text={title}
          id={"outlinedInput123"}
          idItem={idItem}
          updateSetting={setCheckboxTitle}
        />
      </Box>
      <Box mb={2}>
        <InputGroupSetting
          label={t("Add Option")}
          id={"checkboxInput"}
          AddItem={addCheckboxItem}
          updateIsAddItem={setIsAddOption}
        />
      </Box>
      <Box mb={2}>
        <RadioColorSetting
          name={"color-radio-button"}
          radioItem={memoColor}
          checked={color}
          title={t("Color")}
          updateSetting={setCheckboxColor}
        />
      </Box>
      <Box>
        <SwitchSetting
          label={t("Hide field")}
          updateSetting={setCheckboxHide}
          checked={isHideField}
        />
      </Box>
      <Box mb={2}>
        <SwitchSetting
          label={t("Align horizontal")}
          updateSetting={setCheckboxRow}
          checked={isRow}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  checkboxSettings: state.widget.checkbox,
  openPanel: state.application.openPanel,
  idItem: state.widget.idItem,
  isWidget: state.widget.isWidget
});

const mapDispatchToProps = {
  setCheckboxHide,
  setCheckboxTitle,
  setCheckboxRow,
  setCheckboxColor,
  addCheckboxItem,
  setIsAddOption
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckboxSettings);
