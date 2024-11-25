import React from "react";
import TextField from "@mui/material/TextField";
import { connect } from "react-redux";

export interface WidgetTextAreaFieldPrpos {
  item: any;
  inputSettings: any;
}

const WidgetTextAreaField = ({
  item,
  inputSettings
}: WidgetTextAreaFieldPrpos) => {
  const { label, color, margin, variant, isHideField, focused }: any = inputSettings[item.id] ? inputSettings[item.id] : inputSettings[0];

  return (
    <TextField
      fullWidth
      color={color}
      margin={margin}
      label={label}
      variant={variant}
      disabled={isHideField}
      id={item.id}
      rows={4}
      multiline
      focused={focused}
    />
  );
};

const mapStateToProps = (state: any) => ({
  inputSettings: state.widget.input
});

export default connect(mapStateToProps)(WidgetTextAreaField);
