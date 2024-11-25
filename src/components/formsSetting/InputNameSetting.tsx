import React, { memo, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import useDebounce from "src/hooks/useDebounce";

interface IInputNameSetting {
  id: string;
  label: string;
  text: string;
  idItem: string;
  updateSetting: (payload: string) => void;
}

const InputNameSetting = ({
  id,
  text,
  idItem,
  label,
  updateSetting,
}: IInputNameSetting) => {
  const [isChangeInput, setIsChangeInput] = React.useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const debouncedValue = useDebounce<string>(name, 500);
  
  useEffect(() => {
    if (isChangeInput) {
      updateSetting(name);
    }
  }, [debouncedValue, isChangeInput]);

  React.useEffect(() => {
    setName(text);
  }, [idItem]);

  return (
    <TextField
      fullWidth
      size="small"
      id={id}
      label={label}
      variant="outlined"
      value={name}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChangeInput(true);
        setName(event.target.value);
      }}
    />
  );
};

export default memo(InputNameSetting);
