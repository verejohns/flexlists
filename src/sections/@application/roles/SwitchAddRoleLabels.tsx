import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { memo, useEffect, useMemo } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { getTranslation } from "src/utils/i18n";

const ItemBox = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 20,
  textAlign: "center",
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));

interface PermissionsState {
  Create: boolean;
  Read: boolean;
  Update: boolean;
  Delete: boolean;
  OwnerCreate: boolean;
  OwnerRead: boolean;
  OwnerUpdate: boolean;
  OwnerDelete: boolean;
}

const SwitchAddRoleLabels = ({ id, setRights, translations }: any) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  const [state, setState] = useState<PermissionsState>({
    Create: false,
    Read: false,
    Update: false,
    Delete: false,
    OwnerCreate: false,
    OwnerRead: false,
    OwnerUpdate: false,
    OwnerDelete: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const {
    Create,
    Read,
    Update,
    OwnerCreate,
    OwnerDelete,
    OwnerRead,
    OwnerUpdate,
    Delete,
  } = state;

  const getTruePermissions = useMemo((): (keyof PermissionsState)[] => {
    return Object.keys(state).filter(
      (key) => state[key as keyof PermissionsState]
    ) as (keyof PermissionsState)[];
  }, [state]);

  useEffect(() => {
    setRights((prevState: any) => {
      return {
        ...prevState,
        [id]: getTruePermissions,
      };
    });
  }, [state]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={5} display="flex" justifyContent="center" alignItems="center">
          <div>{t('ViewID')}: {id}</div>
        </Grid>
        <Grid xs={7}>
          <ItemBox>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={Create}
                    onChange={handleChange}
                    name="Create"
                  />
                }
                label={t("Creat")}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={Read}
                    onChange={handleChange}
                    name="Read"
                  />
                }
                label={t("Read")}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={Update}
                    onChange={handleChange}
                    name="Update"
                  />
                }
                label={t("Update")}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={Delete}
                    onChange={handleChange}
                    name="Delete"
                  />
                }
                label={t("Delete")}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={OwnerCreate}
                    onChange={handleChange}
                    name="OwnerCreate"
                  />
                }
                label={t("Owner Create")}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={OwnerRead}
                    onChange={handleChange}
                    name="OwnerRead"
                  />
                }
                label={t("Owner Read")}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={OwnerUpdate}
                    onChange={handleChange}
                    name="OwnerUpdate"
                  />
                }
                label={t("Owner Update")}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={OwnerDelete}
                    onChange={handleChange}
                    name="OwnerDelete"
                  />
                }
                label={t("Owner Delete")}
              />
            </FormGroup>
          </ItemBox>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(SwitchAddRoleLabels);
