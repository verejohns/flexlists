import React, { useMemo, memo } from "react";
import { green, red } from "@mui/material/colors";
import Box from "@mui/material/Box";
import purple from "@mui/material/colors/purple";
import blue from "@mui/material/colors/blue";
import Typography from "@mui/material/Typography";
import InputNameSetting from "src/components/formsSetting/InputNameSetting";
import SelectSetting from "src/components/formsSetting/SelectSetting";
import RadioColorSetting from "src/components/formsSetting/RadioColorSetting";
import SwitchSetting from "src/components/formsSetting/SwitchSetting";
import ButtonAlignmentSetting from "src/components/formsSetting/ButtonAlignmentSetting";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import {
  setSwitchLabel,
  setSwitchColor,
  setSwitchSize,
  setSwitchIsHideField,
  setSwitchAlignment
} from "src/redux/actions/widgetActions";

type SwitchSettingsProps = {
  translations: TranslationText[];
  switchSettings: any;
  openPanel: boolean;
  idItem: string;
  isWidget: any;
  setSwitchLabel: (value: string) => void;
  setSwitchColor: (value: string) => void;
  setSwitchSize: (value: string) => void;
  setSwitchIsHideField: (value: boolean) => void;
  setSwitchAlignment: (value: string) => void;
};

const SwitchSettings = ({
  translations,
  switchSettings,
  openPanel,
  idItem,
  isWidget,
  setSwitchLabel,
  setSwitchColor,
  setSwitchSize,
  setSwitchIsHideField,
  setSwitchAlignment
}: SwitchSettingsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { label, color, size, isHideField, alignment }: any = switchSettings[idItem] ? switchSettings[idItem] : switchSettings[0];
  const { isWidgetSwitch } = isWidget;

  const memoSize = useMemo(() => ["small", "medium"], []);
  const memoColor = useMemo(() => {
    // return [
    //   { color: blue[700], name: "primary" },
    //   { color: purple[500], name: "secondary" },
    //   { color: green[800], name: "success" },
    //   { color: red[700], name: "error" },
    // ];
    return [
      { color: '#1976d2', name: "primary" },
      { color: '#7b1fa2', name: "secondary" },
      { color: '#2e7d32', name: "success" },
      { color: '#d32f2f', name: "error" }
    ];
  }, []);
  const memoAlignment = useMemo(() => {
    return [
      { position: "flex-start", name: "Left" },
      { position: "center", name: "Center" },
      { position: "flex-end", name: "Right" },
    ];
  }, []);

  if (!openPanel || !isWidgetSwitch) return null;

  return (
    <>
      <Typography variant="h6" component="h3" mb={2}>
        {t('Switch Properties')}
      </Typography>
      <Box mb={2}>
        <InputNameSetting
          label={t("Button Text")}
          text={label}
          id={"outlinedInput1"}
          idItem={idItem}
          updateSetting={setSwitchLabel}
        />
      </Box>
      <Box mb={2}>
        <SelectSetting
          id={"select-size1"}
          title={t("Size")}
          value={size}
          updateSetting={setSwitchSize}
          menuItem={memoSize}
        />
      </Box>
      <Box mb={2}>
        <RadioColorSetting
          name={"color-radio-Switch"}
          radioItem={memoColor}
          checked={color}
          title={t("Color")}
          updateSetting={setSwitchColor}
        />
      </Box>
      <Box mb={2}>
        <SwitchSetting
          label={t("Hide field")}
          updateSetting={setSwitchIsHideField}
          checked={isHideField}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="body1" component="h3" mb={1}>
          {t('Switch Alignment')}
        </Typography>
        <ButtonAlignmentSetting
          value={alignment}
          updateSetting={setSwitchAlignment}
          color={"primary"}
          toggleButton={memoAlignment}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  switchSettings: state.widget.switch,
  openPanel: state.application.openPanel,
  idItem: state.widget.idItem,
  isWidget: state.widget.isWidget
});

const mapDispatchToProps = {
  setSwitchLabel,
  setSwitchColor,
  setSwitchSize,
  setSwitchIsHideField,
  setSwitchAlignment
};

export default connect(mapStateToProps, mapDispatchToProps)(SwitchSettings);
