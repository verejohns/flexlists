import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import React, { memo } from "react";
// import styles from "./WidgetButtons.module.scss";
import { setTab, setOpenPanel } from "src/redux/actions/applicationActions";
import { connect } from "react-redux";
import { Box } from "@mui/material";

type WidgetButtonsProps = {
  item: any;
  handleRemoveItem: (id: string) => void;
  setOpenPanel: (value: boolean) => void;
  setTab: (tab: number) => void;
};

const WidgetButtons = ({
  item,
  handleRemoveItem,
  setTab,
  setOpenPanel
}: WidgetButtonsProps) => {
  const onSettings = () => {
    setOpenPanel(true);
    setTab(4);
  };
  return (
    <Box sx={{
      display: 'flex',
      position: 'absolute',
      right: '-34px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'map_get($color-secondary, 200)',
      zIndex: 10,
      flexDirection: 'column'
    }}>
      <IconButton
        size={"small"}
        aria-label="Highlight"
        onClick={() => handleRemoveItem(item.id)}
      >
        <DeleteIcon color="error" />
      </IconButton>
      <IconButton size={"small"} aria-label="Highlight" onClick={onSettings}>
        <SettingsIcon color="action" />
      </IconButton>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = {
  setTab,
  setOpenPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetButtons);
