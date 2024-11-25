import React, { memo } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface ISelectSetting {
  id: string;
  title: string;
  value: string;
  menuItem: string[];
  updateSetting: (payload: string) => void;
}

const SelectSetting = ({
  id,
  title,
  value,
  menuItem,
  updateSetting,
}: ISelectSetting) => {
  const handleChange = (event: SelectChangeEvent) => {
    updateSetting(event.target.value as string);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={id}>{title}</InputLabel>
      <Select
        labelId={id}
        id={id}
        value={value}
        label={title}
        onChange={handleChange}
      >
        {menuItem.map((item, id) => {
          return (
            <MenuItem key={id} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default memo(SelectSetting);
