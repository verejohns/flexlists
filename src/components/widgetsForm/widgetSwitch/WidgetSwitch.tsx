import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { connect } from "react-redux";
import { Box } from "@mui/material";

export interface WidgetSwitchProps {
  item: any;
  switchSettings: any;
}

const WidgetSwitch = ({
  item,
  switchSettings
}: WidgetSwitchProps) => {
  const { label, color, isHideField, size, alignment }: any = switchSettings[item.id] ? switchSettings[item.id] : switchSettings[0];

  return (
    <Box style={{ display: "flex", justifyContent: `${alignment}` }}>
      <FormGroup>
        <FormControlLabel
          control={<Switch color={color} defaultChecked size={size} />}
          label={label}
          disabled={isHideField}
        />
      </FormGroup>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  switchSettings: state.widget.switch
});

export default connect(mapStateToProps)(WidgetSwitch);
