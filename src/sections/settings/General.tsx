import {
  FormControl,
  Button,
  Grid,
  Divider,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { userSettingsService } from "flexlists-api";
import { getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { FlashMessageModel } from "src/models/FlashMessageModel";

type GeneralProps = {
  translations: TranslationText[];
  setFlashMessage: (message: FlashMessageModel) => void;
};

const General = ({ translations, setFlashMessage }: GeneralProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const notifications = [
    {
      label: t("Yes"),
      value: "on",
    },
    {
      label: t("No"),
      value: "off",
    },
  ];
  const [settingsIsDirty, setSettingsIsDirty] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>(
    notifications[1].value
  );

  useEffect(() => {
    getSettings();
  }, []);

  const getSettings = async () => {
    const response = await userSettingsService.getUserSettings();

    if (isSucc(response)) {
      setNotification(response.data.viewEmailNotification ? "on" : "off");
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };

  const handleNotification = (event: SelectChangeEvent) => {
    setNotification(event.target.value);
    setSettingsIsDirty(true);
  };

  const onSubmit = async () => {
    const response = await userSettingsService.updateUserSettings(
      notification === "on"
    );

    if (isSucc(response)) {
      setFlashMessage({
        message: "Update user settings successfully",
        type: "success",
      });
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }

    setSettingsIsDirty(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1">
        {t("System-wide notification settings")}:
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Grid item md={6}>
          <Typography variant="body1">
            {"Do you want to receive email notifications on list changes?"}
          </Typography>
        </Grid>
        <Grid item md={6}>
          <FormControl fullWidth sx={{ display: "flex", flexDirection: "row" }}>
            <Select
              sx={{ width: "100%" }}
              value={notification}
              onChange={handleNotification}
            >
              {notifications.map((notification: any) => (
                <MenuItem key={notification.value} value={notification.value}>
                  {notification.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={12}>
          <Typography variant="body1">
            {t(
              "When you set this to Yes, you will, by default, get update notifications across all lists and you can switch them off per list. If you set this to No, you will default not receive any updates, however you can switch them On per list."
            )}
          </Typography>
        </Grid>
      </Grid>
      <Divider light sx={{ my: 4 }}></Divider>
      <Button
        sx={{ mt: 2 }}
        disabled={!settingsIsDirty}
        variant="contained"
        onClick={() => {
          onSubmit();
        }}
      >
        {t("Update Settings")}
      </Button>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(General);
