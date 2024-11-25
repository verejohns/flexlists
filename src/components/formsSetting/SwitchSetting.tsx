import React, { memo } from "react";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface ISwitchSetting {
  label: string;
  checked: boolean;
  updateSetting: (payload: boolean) => void;
}

const SwitchSetting = ({
  label,
  updateSetting,
  checked
}: ISwitchSetting) => {
  const switchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSetting(event.target.checked);
  };

  return (
    <FormControl>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={checked} onChange={switchHandler} />}
          label={label}
        />
      </FormGroup>
    </FormControl>
  );
};

export default memo(SwitchSetting);