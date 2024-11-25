import React, { memo } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface IButtonAlignmentSetting {
  value: string;
  color:
    | "standard"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  toggleButton: { position: string; name: string }[];
  updateSetting: (payload: string) => void;
}

const ButtonAlignmentSetting = ({
  toggleButton,
  value,
  color,
  updateSetting,
}: IButtonAlignmentSetting) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    updateSetting(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color={color}
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      size="small"
    >
      {toggleButton.map(
        (item: { position: string; name: string }, id: number) => {
          return (
            <ToggleButton key={id} value={item.position}>
              {item.name}
            </ToggleButton>
          );
        }
      )}
    </ToggleButtonGroup>
  );
};

export default memo(ButtonAlignmentSetting);
