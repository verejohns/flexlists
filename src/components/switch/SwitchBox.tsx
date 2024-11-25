import { Switch } from "@mui/material";
import { makeStyles } from "@mui/styles";

type SwitchBoxProps = {
  checked: boolean;
  checkedColor: string;
  uncheckedColor: string;
  sx?: any;
  onChange?: (e: any) => void;
};

const SwitchBox = ({
  checked,
  checkedColor,
  uncheckedColor,
  sx,
  onChange
}: SwitchBoxProps) => {
  const useStyles = makeStyles({
    switch_track: {
      backgroundColor: uncheckedColor
    },
    switch_base: {
      color: uncheckedColor,
      "&.Mui-disabled": {
        color: uncheckedColor
      },
      "&.Mui-checked": {
        color: checkedColor
      },
      "&.Mui-checked + .MuiSwitch-track": {
        backgroundColor: checkedColor
      }
    },
    switch_primary: {
      "&.Mui-checked": {
        color: checkedColor
      },
      "&.Mui-checked + .MuiSwitch-track": {
        backgroundColor: checkedColor
      },
    }
  });

  const classes = useStyles();

  return (
    <Switch
      checked={checked}
      sx={sx}
      classes={{
        track: classes.switch_track,
        switchBase: classes.switch_base,
        colorPrimary: classes.switch_primary,
      }}
      onChange={onChange}
    />
  );
};

export default SwitchBox;
