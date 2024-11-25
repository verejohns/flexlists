import React, { useMemo, memo } from "react";
import Typography from "@mui/material/Typography";
import { green, pink, red } from "@mui/material/colors";
import Box from "@mui/material/Box";
import blue from "@mui/material/colors/blue";
import purple from "@mui/material/colors/purple";
import InputNameSetting from "src/components/formsSetting/InputNameSetting";
import InputGroupSetting from "src/components/formsSetting/InputGroupSetting";
import RadioColorSetting from "src/components/formsSetting/RadioColorSetting";
import SwitchSetting from "src/components/formsSetting/SwitchSetting";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import {
  setRadioHide,
  setRadioTitle,
  setRadioRow,
  setRadioColor,
  addRadioItem,
  setIsAddOption
} from "src/redux/actions/widgetActions";

type RadioSettingsProps = {
  translations: TranslationText[];
  radioSettings: any;
  openPanel: boolean;
  idItem: string;
  isWidget: any;
  setRadioHide: (value: boolean) => void;
  setRadioTitle: (value: string) => void;
  setRadioRow: (value: boolean) => void;
  setRadioColor: (value: string) => void;
  addRadioItem: (value: any) => void;
  setIsAddOption: (value: boolean) => void;
};

const RadioSettings = ({
  translations,
  radioSettings,
  openPanel,
  idItem,
  isWidget,
  setRadioHide,
  setRadioTitle,
  setRadioRow,
  setRadioColor,
  addRadioItem,
  setIsAddOption
}: RadioSettingsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { info: { isHideField, title, isRow, color } } = radioSettings[idItem] ? radioSettings[idItem] : radioSettings[0];
  const { isWidgetRadio } = isWidget;

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

  if (!openPanel || !isWidgetRadio) return null;

  return (
    <>
      <Typography variant="h6" component="h3" mb={2}>
        {t('Single Choice Properties')}
      </Typography>
      <Box mb={2}>
        <InputNameSetting
          label={t("Field Label")}
          text={title}
          id={"outlinedInput123"}
          idItem={idItem}
          updateSetting={setRadioTitle}
        />
      </Box>

      <Box mb={2}>
        <InputGroupSetting
          label={t("Add Option")}
          id={"radioInput"}
          AddItem={addRadioItem}
          updateIsAddItem={setIsAddOption}
        />
      </Box>
      <Box mb={2}>
        <RadioColorSetting
          name={"color-radio-button"}
          radioItem={memoColor}
          checked={color}
          title={t("Color")}
          updateSetting={setRadioColor}
        />
      </Box>
      <Box>
        <SwitchSetting
          label={t("Hide field")}
          updateSetting={setRadioHide}
          checked={isHideField}
        />
      </Box>
      <Box mb={2}>
        <SwitchSetting
          label={t("Align horizontal")}
          updateSetting={setRadioRow}
          checked={isRow}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  radioSettings: state.widget.radio,
  openPanel: state.application.openPanel,
  idItem: state.widget.idItem,
  isWidget: state.widget.isWidget
});

const mapDispatchToProps = {
  setRadioHide,
  setRadioTitle,
  setRadioRow,
  setRadioColor,
  addRadioItem,
  setIsAddOption
};

export default connect(mapStateToProps, mapDispatchToProps)(RadioSettings);
