import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import { connect } from "react-redux";

type WidgetInputFieldProps = {
  item: any;
  inputSettings: any;
};

const WidgetInputField = ({
  item,
  inputSettings
}: WidgetInputFieldProps) => {
  const { label, color, margin, size, variant, isHideField, focused }: any = inputSettings[item.id] ? inputSettings[item.id] : inputSettings[0];

  return (
    <TextField
      fullWidth
      id={item.id}
      color={color}
      margin={margin}
      label={label}
      size={size}
      variant={variant}
      disabled={isHideField}
      focused={focused}
    />
  );
};

const mapStateToProps = (state: any) => ({
  inputSettings: state.widget.input
});

export default connect(mapStateToProps)(WidgetInputField);
