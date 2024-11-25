import React, { memo, useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const ItemBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 20,
  textAlign: "center",
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));

const SwitchRightLabels = ({ name, id, inKey, setRoleIds }: any) => {
  const [state, setState] = useState<any>({ [name]: inKey || false });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = {
      ...state,
      [event.target.name]: event.target.checked,
    };
    setState(newState);
    updateRoleIds(newState);
  };

  const updateRoleIds = (currentState: any) => {
    setRoleIds((prevIds: any) => {
      if (currentState[name]) {
        return Array.from(new Set([...prevIds, id]));
      } else {
        return prevIds.filter((prevId: string) => prevId !== id);
      }
    });
  };

  useEffect(() => {
    setState((prevState: any) => ({
      ...prevState,
      [name]: inKey,
    }));
  }, [name, inKey]);

  useEffect(() => {
    updateRoleIds(state);
  }, [state, updateRoleIds]);

  return (
    <ItemBox style={{ padding: "7px 0 7px 12px", marginTop: "3px" }}>
      <Grid container spacing={2}>
        <Grid xs={9} display="flex" alignItems="center">
          {name}
        </Grid>
        <Grid xs={3} display="flex" justifyContent={"end"}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={state[name]}
                  onChange={handleChange}
                  name={name}
                />
              }
              label=""
            />
          </FormGroup>
        </Grid>
      </Grid>
    </ItemBox>
  );
};

export default memo(SwitchRightLabels);
