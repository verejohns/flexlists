import React, { useState } from "react";
import {
  Grid,
  Button,
  FormLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  InputAdornment,
  SelectChangeEvent,
  Tooltip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetKeysForViewOutputDto } from "src/models/ApiOutputModels";
import { Role } from "src/enums/SharedEnums";
import { listViewService } from "flexlists-api";
import { useRouter } from "next/router";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { View, TranslationText } from "src/models/SharedModels";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { getTranslation } from "src/utils/i18n";
import CopyClipboard from "src/components/clipboard/CopyClipboard";

type ManageKeysProps = {
  viewKeys: GetKeysForViewOutputDto[];
  roles: { name: string; label: string }[];
  currentView: View;
  translations: TranslationText[];
  onUpdateViewKeys: (newViewKeys: GetKeysForViewOutputDto[]) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const ManageKeys = ({
  viewKeys,
  roles,
  translations,
  currentView,
  onUpdateViewKeys,
  setFlashMessage,
}: ManageKeysProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const router = useRouter();
  const [viewKeyUpdateList, setViewKeyUpdateList] = useState<
    { keyId: number; isEditing: boolean }[]
  >([]);
  const [previousEditViewKeys, setPreviousEditViewKeys] = useState<
    GetKeysForViewOutputDto[]
  >([]);

  const handleSelectRoleChange = async (
    event: SelectChangeEvent,
    index: number
  ) => {
    const newViewKeys: GetKeysForViewOutputDto[] = Object.assign([], viewKeys);
    const currentViewKey = newViewKeys[index];
    currentViewKey.role = event.target.value as Role;

    onUpdateViewKeys(newViewKeys);
  };

  const handleViewNameChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newViewKeys: GetKeysForViewOutputDto[] = Object.assign([], viewKeys);
    const currentViewKey = newViewKeys[index];
    currentViewKey.name = event.target.value;

    onUpdateViewKeys(newViewKeys);
  };

  const getKeyLink = (key: string): string => {
    return `${process.env.NEXT_PUBLIC_FLEXLIST_CLIENT_URL}/key/${key}`;
  };

  const isKeyEditing = (keyId: number): boolean => {
    const existKeyEditing = viewKeyUpdateList.find((x) => x.keyId == keyId);

    if (existKeyEditing && existKeyEditing.isEditing) return true;

    return false;
  };

  const deleteKey = async (keyId: number) => {
    const response = await listViewService.deleteKeyFromView(
      currentView.id,
      keyId
    );

    if (isSucc(response)) {
      onUpdateViewKeys(viewKeys.filter((x) => x.keyId !== keyId));
    } else {
      setFlashMessage({
        message: (response as FlashMessageModel).message,
        type: "error",
      });
    }
  };

  const updateViewKeyUpdateList = (keyId: number, isEditing: boolean) => {
    let newViewKeyUpdateList: { keyId: number; isEditing: boolean }[] =
      Object.assign([], viewKeyUpdateList);
    const isKeyUpdateIndex = newViewKeyUpdateList.findIndex(
      (x) => x.keyId === keyId
    );

    if (isKeyUpdateIndex >= 0) {
      newViewKeyUpdateList[isKeyUpdateIndex].isEditing = isEditing;
    } else {
      newViewKeyUpdateList.push({ keyId: keyId, isEditing: isEditing });
    }

    setViewKeyUpdateList(newViewKeyUpdateList);
  };

  const onSubmit = async (keyId: number) => {
    if (!isKeyEditing(keyId)) {
      updateViewKeyUpdateList(keyId, true);

      let newViewKeys: GetKeysForViewOutputDto[] = Object.assign([], viewKeys);
      let currentViewKey = newViewKeys.find((x) => x.keyId === keyId);
      let previousEditViewKey = previousEditViewKeys.find(
        (x) => x.keyId === keyId
      );

      if (!previousEditViewKey) {
        previousEditViewKey = Object.assign({}, currentViewKey);
        setPreviousEditViewKeys([...previousEditViewKeys, previousEditViewKey]);
      }
    } else {
      let currentKeyView = viewKeys.find((x) => x.keyId === keyId);

      if (currentKeyView) {
        let updateKeyView = await listViewService.updateKeyForView(
          currentView.id,
          keyId,
          currentKeyView.role,
          currentKeyView.name
        );

        if (isSucc(updateKeyView)) {
          updateViewKeyUpdateList(keyId, false);
          revertPreviousEditKey(keyId, false);
        } else {
          setFlashMessage({
            message: (updateKeyView as FlexlistsError).message,
            type: "error",
          });
        }
      }
    }
  };

  const onEditCancel = (keyId: number) => {
    revertPreviousEditKey(keyId);
  };

  const revertPreviousEditKey = (keyId: number, isCancel: boolean = true) => {
    if (isCancel) {
      let previousEditViewKey = previousEditViewKeys.find(
        (x) => x.keyId === keyId
      );

      if (previousEditViewKey) {
        let newViewKeys: GetKeysForViewOutputDto[] = Object.assign(
          [],
          viewKeys
        );
        let currentViewKey = newViewKeys.find((x) => x.keyId === keyId);

        if (currentViewKey) {
          currentViewKey.name = previousEditViewKey.name;
          currentViewKey.role = previousEditViewKey.role;

          onUpdateViewKeys(newViewKeys);
        }
      }
    }

    let newPreviousEditViewKeys = previousEditViewKeys.filter(
      (x) => x.keyId !== keyId
    );

    setPreviousEditViewKeys(newPreviousEditViewKeys);
    updateViewKeyUpdateList(keyId, false);
  };

  return (
    <>
      {viewKeys &&
        viewKeys.map((viewKey, index) => {
          return (
            <Box key={`viewKeys-${index}`}>
              <Grid
                container
                spacing={1}
                sx={{
                  alignItems: "flex-end",
                  display: { xs: "none", md: "flex" },
                }}
              >
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <FormLabel>
                    <Typography variant="body2">{t("Access Role")}</Typography>
                  </FormLabel>
                  <Select
                    size="small"
                    value={viewKey.role}
                    onChange={(e) => handleSelectRoleChange(e, index)}
                    disabled={!isKeyEditing(viewKey.keyId)}
                  >
                    {roles &&
                      roles.map((role, index) => {
                        return (
                          <MenuItem
                            key={`accessRoles-${index}`}
                            value={role.name}
                          >
                            {role.label}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <FormLabel>
                    <Typography variant="body2">{t("Key Link")}</Typography>
                  </FormLabel>

                  <TextField
                    size="small"
                    value={getKeyLink(viewKey.key)}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={t("Copy To Clipboard")}>
                            <CopyClipboard data={getKeyLink(viewKey.key)} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <FormLabel>
                    <Typography variant="body2">{t("Info")}</Typography>
                  </FormLabel>
                  <TextField
                    size="small"
                    placeholder={t("Key Name")}
                    value={viewKey.name}
                    onChange={(e: any) => handleViewNameChange(e, index)}
                    disabled={!isKeyEditing(viewKey.keyId)}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                  }}
                >
                  <Button
                    fullWidth
                    variant="text"
                    disabled={index === 0}
                    sx={{
                      color: theme.palette.palette_style.primary.main,
                    }}
                    onClick={() => onSubmit(viewKey.keyId)}
                  >
                    {isKeyEditing(viewKey.keyId) ? t("Update") : t("Edit")}
                  </Button>
                  <Button
                    fullWidth
                    variant={isKeyEditing(viewKey.keyId) ? "text" : "contained"}
                    sx={{
                      color: theme.palette.palette_style.primary.main,
                      display: isKeyEditing(viewKey.keyId) ? "block" : "none",
                    }}
                    onClick={() => onEditCancel(viewKey.keyId)}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    disabled={index === 0}
                    sx={{
                      borderColor: "red",
                      color: theme.palette.palette_style.error.dark,
                      display: !isKeyEditing(viewKey.keyId) ? "block" : "none",
                    }}
                    onClick={() => deleteKey(viewKey.keyId)}
                  >
                    {t("Delete")}
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ mb: 2, display: { xs: "block", md: "none" } }}>
                <Typography variant="body2">
                  {viewKey.role} - {viewKey.name}
                </Typography>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      p: 0,
                      minHeight: 40,
                      "& .MuiAccordionSummary-content": {
                        m: 0,
                        minHeight: "unset",
                      },
                      "&.MuiAccordionSummary-root.Mui-expanded": {
                        margin: "0 0",
                        minHeight: "36px",
                      },
                    }}
                  >
                    <TextField
                      size="small"
                      fullWidth
                      value={getKeyLink(viewKey.key)}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Copy to clipboard">
                              <CopyClipboard data={getKeyLink(viewKey.key)} />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 0,
                      gap: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Select
                      size="small"
                      fullWidth
                      value={viewKey.role}
                      onChange={(e) => handleSelectRoleChange(e, index)}
                      disabled={!isKeyEditing(viewKey.keyId)}
                    >
                      {roles &&
                        roles.map((role, index) => {
                          return (
                            <MenuItem key={`roles-${index}`} value={role.name}>
                              {role.label}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Key name"
                      value={viewKey.name}
                      onChange={(e: any) => handleViewNameChange(e, index)}
                      disabled={!isKeyEditing(viewKey.keyId)}
                    />
                    <Box sx={{ display: "flex" }}>
                      <Button
                        fullWidth
                        variant={
                          isKeyEditing(viewKey.keyId) ? "text" : "contained"
                        }
                        sx={{
                          color: theme.palette.palette_style.primary.main,
                          display: isKeyEditing(viewKey.keyId)
                            ? "block"
                            : "none",
                        }}
                        onClick={() => onEditCancel(viewKey.keyId)}
                      >
                        Cancel
                      </Button>
                      <Button
                        fullWidth
                        variant={
                          isKeyEditing(viewKey.keyId) ? "contained" : "text"
                        }
                        disabled={index === 0}
                        sx={{
                          color: isKeyEditing(viewKey.keyId)
                            ? theme.palette.palette_style.text.white
                            : theme.palette.palette_style.primary.main,
                        }}
                        onClick={() => onSubmit(viewKey.keyId)}
                      >
                        {isKeyEditing(viewKey.keyId) ? "Update" : "Edit"}
                      </Button>
                      <Button
                        fullWidth
                        variant="text"
                        disabled={index === 0}
                        sx={{
                          borderColor: "red",
                          color: theme.palette.palette_style.error.dark,
                          display: !isKeyEditing(viewKey.keyId)
                            ? "block"
                            : "none",
                        }}
                        onClick={() => deleteKey(viewKey.keyId)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          );
        })}
    </>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageKeys);
