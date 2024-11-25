"use client";
import React, { useMemo, memo } from "react";
import { green, red } from "@mui/material/colors";
import Box from "@mui/material/Box";
import purple from "@mui/material/colors/purple";
import blue from "@mui/material/colors/blue";
import Typography from "@mui/material/Typography";
import InputNameSetting from "src/components/formsSetting/InputNameSetting";
import SelectSetting from "src/components/formsSetting/SelectSetting";
import RadioColorSetting from "src/components/formsSetting/RadioColorSetting";
import ButtonAlignmentSetting from "src/components/formsSetting/ButtonAlignmentSetting";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import {
  setButtonText,
  setButtonColor,
  setButtonSize,
  setButtonVariant,
  setButtonAlignment
} from "src/redux/actions/widgetActions";

type ButtonSettingsProps = {
  translations: TranslationText[];
  buttonSettings: any;
  openPanel: boolean;
  idItem: string;
  isWidget: any;
  setButtonText: (value: string) => void;
  setButtonColor: (value: string) => void;
  setButtonSize: (value: string) => void;
  setButtonVariant: (value: string) => void;
  setButtonAlignment: (value: string) => void;
};

const ButtonSettings = ({
  translations,
  buttonSettings,
  openPanel,
  idItem,
  isWidget,
  setButtonText,
  setButtonColor,
  setButtonSize,
  setButtonVariant,
  setButtonAlignment
}: ButtonSettingsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { text, color, size, variant, alignment } = buttonSettings[idItem] ? buttonSettings[idItem] : buttonSettings[0];
  const { isWidgetButton } = isWidget;

  const memoSize = useMemo(() => ["small", "medium", "large"], []);
  const memoVariant = useMemo(() => ["text", "contained", "outlined"], []);
  const memoAlignment = useMemo(() => {
    return [
      { position: "flex-start", name: "Left" },
      { position: "center", name: "Center" },
      { position: "flex-end", name: "Right" },
    ];
  }, []);
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

  if (!openPanel || !isWidgetButton) return null;

  return (
    <>
      <Typography variant="h6" component="h3" mb={2}>
        {t('Submit Properties')}
      </Typography>
      <Box mb={2}>
        <InputNameSetting
          label={"Button Text"}
          text={text}
          id={"outlinedInput1"}
          idItem={idItem}
          updateSetting={setButtonText}
        />
      </Box>
      <Box mb={2}>
        <SelectSetting
          id={"select-size1"}
          title={"Size"}
          value={size}
          updateSetting={setButtonSize}
          menuItem={memoSize}
        />
      </Box>
      <Box mb={2}>
        <SelectSetting
          id={"select-size2"}
          title={"Variant"}
          value={variant}
          updateSetting={setButtonVariant}
          menuItem={memoVariant}
        />
      </Box>
      <Box mb={2}>
        <RadioColorSetting
          name={"color-radio-button"}
          radioItem={memoColor}
          checked={color}
          title={"Color"}
          updateSetting={setButtonColor}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="body1" component="h3" mb={1}>
          {t('Button Alignment')}
        </Typography>
        <ButtonAlignmentSetting
          value={alignment}
          updateSetting={setButtonAlignment}
          color={"primary"}
          toggleButton={memoAlignment}
        />
      </Box>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  buttonSettings: state.widget.button,
  openPanel: state.application.openPanel,
  idItem: state.widget.idItem,
  isWidget: state.widget.isWidget
});

const mapDispatchToProps = {
  setButtonText,
  setButtonColor,
  setButtonSize,
  setButtonVariant,
  setButtonAlignment
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSettings);
