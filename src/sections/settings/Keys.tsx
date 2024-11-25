import { Button, Divider, Box, Typography } from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { authService } from "flexlists-api";
import { getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getAmPm, getDateFormatString } from "src/utils/convertUtils";
import { renderTimeViewClock } from "@mui/x-date-pickers";
import CopyClipboard from "src/components/clipboard/CopyClipboard";

type KeysProps = {
  translations: TranslationText[];
  setFlashMessage: (message: FlashMessageModel) => void;
};

const Keys = ({ translations, setFlashMessage }: KeysProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const oneYearLater = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );
  const [key, setKey] = useState("");
  const [dateTime, setDateTime] = useState(oneYearLater);

  const onSubmit = async () => {
    const response = await authService.getAPIBearerToken(
      dateTime.getTime() / 60000
    );

    if (isSucc(response)) {
      setKey(response.data);

      setFlashMessage({
        message: "Generated key successfully",
        type: "success",
      });
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1">
        {t(
          "Below you can generate system wide keys for accessing all features of Flexlists, like the API and other features. Keys expire at the date set below. Warning: these keys are very powerful; do not share them with anyone you do not trust! They will have full accesss to your entire account."
        )}
      </Typography>
      <Divider light sx={{ my: 4 }}></Divider>
      <Box sx={{ display: { md: "flex" }, justifyContent: "space-between" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={dayjs(dateTime)}
            onChange={(e: any) => {
              setDateTime(new Date(e));
            }}
            ampm={getAmPm()}
            format={`${getDateFormatString(window.navigator.language)} ${
              getAmPm() ? "hh" : "HH"
            }:mm:ss${getAmPm() ? " a" : ""}`}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            slotProps={{
              textField: {
                required: true,
                InputLabelProps: {
                  shrink: true,
                },
              },
            }}
          />
        </LocalizationProvider>
        <Button
          sx={{ mt: { xs: 2, md: 1 }, height: 40 }}
          variant="contained"
          onClick={() => {
            onSubmit();
          }}
        >
          {t("Generate")}
        </Button>
      </Box>
      {key && (
        <>
          <Divider light sx={{ my: 4 }}></Divider>
          <Box
            sx={{ display: { md: "flex" }, justifyContent: "space-between" }}
          >
            <Typography variant="body1" sx={{ mt: 1 }}>
              {t("Click here to copy the key to your clipboard:")}
            </Typography>
            <Button sx={{ mt: { xs: 2, md: 0 } }} variant="contained">
              <Box sx={{ mr: 0.5 }}>{t("Copy")}</Box>
              <CopyClipboard data={key} />
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Keys);
