import React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { connect } from "react-redux";

type WidgetBtnProps = {
  buttonSettings: any;
  item: any;
};

const WidgetBtn = ({
  buttonSettings,
  item
}: WidgetBtnProps) => {
  const { text, size, variant, color, alignment }: any = buttonSettings[item.id] ? buttonSettings[item.id] : buttonSettings[0];

  return (
    <Stack spacing={2} direction="row" justifyContent={alignment}>
      <Button size={size} variant={variant} color={color}>
        {text}
      </Button>
    </Stack>
  );
};

const mapStateToProps = (state: any) => ({
  buttonSettings: state.widget.button
});

export default connect(mapStateToProps)(WidgetBtn);
