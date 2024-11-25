import { useState } from "react";
import {
  Box,
  Button,
  DialogTitle,
  useTheme,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FieldUIType, View } from "src/models/SharedModels";
import { connect } from "react-redux";
import { ViewType } from "src/enums/SharedEnums";
import { ViewField } from "src/models/ViewField";
import { useRouter } from "next/router";
import KanbanViewConfig from "./KanbanViewConfig";
import MapViewConfig from "./MapViewConfig";
import ChartViewConfig from "./ChartViewConfig";
import CalendarViewConfig from "./CalendarViewConfig";
import GalleryViewConfig from "./GalleryViewConfig";
import TimelineViewConfig from "./TimelineViewConfig";
import GanttViewConfig from "./GanttViewConfig";
import { validateViewConfig } from "src/utils/flexlistHelper";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import RightPanel from "src/components/right-panel/RightPanel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { listViewService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/utils/responses";
import { fetchRows, setCurrentView } from "src/redux/actions/viewActions";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type EditViewConfigFormProps = {
  currentView: View;
  setCurrentView: (newView: View) => void;
  translations: TranslationText[];
  columns: ViewField[];
  open: boolean;
  handleClose: () => void;
  availableFieldUiTypes: FieldUIType[];
  setFlashMessage: (message: FlashMessageModel) => void;
  fetchRows: () => void;
};

const EditViewConfigForm = ({
  open,
  translations,
  handleClose,
  currentView,
  columns,
  availableFieldUiTypes,
  setFlashMessage,
  fetchRows,
  setCurrentView,
}: EditViewConfigFormProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();
  const [config, setConfig] = useState<any>({});
  const [submit, setSubmit] = useState(false);

  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };
  const handleSubmit = async () => {
    setSubmit(true);

    if (!validateViewConfig(currentView.type, config, setError)) {
      return;
    }
    let updateViewCongig = await listViewService.updateViewConfig(
      currentView.id,
      config
    );
    if (isSucc(updateViewCongig)) {
      let newView = Object.assign({}, currentView);
      newView.config = config;
      setCurrentView(newView);
      fetchRows();
      setFlashMessage({ message: "View config updated", type: "success" });
      handleClose();
    } else {
      setError(
        (updateViewCongig as FlexlistsError).message || "Something went wrong!"
      );
    }
  };

  const updateConfig = (newConfig: any) => {
    setConfig(newConfig);
  };

  return (
    <>
      <RightPanel open={open} handleClose={handleClose}>
        <DialogTitle
          textAlign="left"
          sx={{
            borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
          }}
        >
          {t("Edit View Config")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3 }}>
            {currentView && currentView.type === ViewType.Calendar && (
              <CalendarViewConfig
                translations={translations}
                submit={submit}
                availableFieldUiTypes={availableFieldUiTypes}
                updateConfig={(newConfig) => updateConfig(newConfig)}
                config={currentView?.config}
              />
            )}
            {currentView && currentView.type === ViewType.Gallery && (
              <GalleryViewConfig
                translations={translations}
                submit={submit}
                availableFieldUiTypes={availableFieldUiTypes}
                updateConfig={(newConfig) => updateConfig(newConfig)}
                config={currentView?.config}
              />
            )}
            {currentView && currentView.type === ViewType.KanBan && (
              <KanbanViewConfig
                translations={translations}
                submit={submit}
                availableFieldUiTypes={availableFieldUiTypes}
                updateConfig={(newConfig) => updateConfig(newConfig)}
                config={currentView?.config}
              />
            )}
            {currentView && currentView.type === ViewType.TimeLine && (
              <TimelineViewConfig
                translations={translations}
                submit={submit}
                availableFieldUiTypes={availableFieldUiTypes}
                updateConfig={(newConfig) => updateConfig(newConfig)}
                config={currentView?.config}
              />
            )}
            {currentView && currentView.type === ViewType.Gantt && (
              <GanttViewConfig
                translations={translations}
                submit={submit}
                availableFieldUiTypes={availableFieldUiTypes}
                updateConfig={(newConfig) => updateConfig(newConfig)}
                config={currentView?.config}
              />
            )}
            {currentView && currentView.type === ViewType.Map && (
              <MapViewConfig
                translations={translations}
                submit={submit}
                availableFieldUiTypes={availableFieldUiTypes}
                updateConfig={(newConfig) => updateConfig(newConfig)}
                config={currentView?.config}
              />
            )}
            {currentView && currentView.type === ViewType.Chart && (
              <ChartViewConfig
                translations={translations}
                submit={submit}
                availableFieldUiTypes={availableFieldUiTypes}
                updateConfig={(newConfig) => updateConfig(newConfig)}
                config={currentView?.config}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: "1.25rem",
            borderTop: `1px solid ${theme.palette.palette_style.border.default}`,
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              bottom: 0,
              ml: "auto",
              mr: 0,
            }}
          >
            <Button onClick={handleClose}>{t("Cancel")}</Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              variant="contained"
              type="submit"
            >
              {t("Update")}
            </Button>
          </Box>
        </DialogActions>
      </RightPanel>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
  columns: state.view.columns,
  availableFieldUiTypes: state.view.availableFieldUiTypes,
});

const mapDispatchToProps = {
  setCurrentView,
  setFlashMessage,
  fetchRows,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditViewConfigForm);
