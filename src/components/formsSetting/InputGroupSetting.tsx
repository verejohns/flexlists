import React, { memo, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import { v4 as uuidv4 } from "uuid";

interface IInputNameSetting {
  id: string;
  label: string;
  className?: string;
  AddItem: (payload: any) => void;
  updateIsAddItem: (payload: boolean) => void;
}

const InputGroupSetting = ({
  id,
  className,
  updateIsAddItem,
  AddItem,
  label,
}: IInputNameSetting) => {
  const newIdItem = uuidv4();
  const [name, setName] = useState<string>("");

  const handleAddItem = (newIdItem: string, name: string) => {
    AddItem({
      id: newIdItem,
      value: name.toLowerCase(),
      isChecked: false,
      label: name,
    });
    updateIsAddItem(true);
    setName("");
  };

  return (
    <Grid container spacing={1} padding={0}>
      <Grid xs={9.6}>
        <TextField fullWidth
          label={label}
          className={className}
          size="small"
          value={name}
          id={id}
          variant="outlined"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
        />
      </Grid>
      <Grid xs display="flex" justifyContent="end" alignItems="center">
        <Button
          disabled={!name.trim()}
          onClick={() => handleAddItem(newIdItem, name)}
          variant="outlined"
          style={{ width: "fit-content" }}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default memo(InputGroupSetting);
