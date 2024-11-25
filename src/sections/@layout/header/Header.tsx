import React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
// import styles from "./Header.module.scss";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeItemLS } from "src/utils/ls";
import SaveIcon from "@mui/icons-material/Save";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { toggleOpenWidget, setLayoutDialog, setOpenPanel } from "src/redux/actions/applicationActions";
import { connect } from "react-redux";

type LayputHeaderProps = {
  translations: TranslationText[];
  widgetItemsPage: string;
  widgetLayoutsPage: string;
  openPanel: boolean;
  handleSubmit: () => void;
  toggleOpenWidget: () => void;
  setLayoutDialog: (value: boolean) => void;
  setOpenPanel: (value: boolean) => void;
};

const LayputHeader = ({
  translations,
  widgetItemsPage,
  widgetLayoutsPage,
  openPanel,
  handleSubmit,
  toggleOpenWidget,
  setLayoutDialog,
  setOpenPanel
}: LayputHeaderProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();

  const handleClear = () => {
    removeItemLS(widgetItemsPage);
    removeItemLS(widgetLayoutsPage);
    document.location.reload();
  };

  return (
    <AppBar position="fixed" style={{ background: "#f5f5f5" }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '48px' }}>
        <IconButton
          edge="start"
          onClick={toggleOpenWidget}
        >
          <MenuIcon />
        </IconButton>

        <Stack direction="row" spacing={1}>
          <Button
            size={"small"}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/main/applications")}
          >
            {t('Back App')}
          </Button>
          <Button
            onClick={() => setLayoutDialog(true)}
            size={"small"}
            variant="contained"
            startIcon={<RemoveRedEyeIcon />}
          >
            {t('Preview')}
          </Button>
          <Button
            onClick={handleSubmit}
            size={"small"}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {t('Submit')}
          </Button>
          <Button
            color="error"
            size={"small"}
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
          >
            {t('Clear')}
          </Button>
        </Stack>

        <IconButton
          edge="start"
          aria-label="open drawer"
          onClick={() => setOpenPanel(!openPanel)}
        >
          <VerticalSplitIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state: any) => ({
  openPanel: state.application.openPanel
});

const mapDispatchToProps = {
  toggleOpenWidget,
  setLayoutDialog,
  setOpenPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(LayputHeader);
