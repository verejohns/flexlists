import React, { useState } from "react";
import { Drawer, Divider, Box, Tabs } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Tab from "@mui/material/Tab";
import ViewsList from "./views/ViewsList";
import RoleList from "./roles/RoleList";
import KeysList from "./keys/KeysList";
import MenuPagesList from "./menuPages/MenuPagesList";
import WidgetInfo from "src/components/widgetsSettings/WidgetInfo";
import { tabsClasses } from "@mui/material/Tabs";
import InputSettings from "src/components/widgetsSettings/inputSettings/InputSettings";
import TextareaSettings from "src/components/widgetsSettings/textareaSettings/TextareaSettings";
import ButtonSettings from "src/components/widgetsSettings/buttonSettings/ButtonSettings";
import RadioSettings from "src/components/widgetsSettings/radioSettings/RadioSettings";
import CheckboxSettings from "src/components/widgetsSettings/checkboxSettings/CheckboxSettings";
import SwitchSettings from "src/components/widgetsSettings/switchSettings/SwitchSettings";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { setTab, setOpenPanel } from "src/redux/actions/applicationActions";
import { connect } from "react-redux";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type ApplicationDetailPanelProps = {
  translations: TranslationText[];
  tab: number;
  openPanel: boolean;
  setOpenPanel: (value: boolean) => void;
  setTab: (tab: number) => void;
};

const ApplicationDetailPanel = ({
  translations,
  tab,
  openPanel,
  setOpenPanel,
  setTab
}: ApplicationDetailPanelProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const tabs = [
    {
      value: 'views',
      label: t('Views')
    },
    {
      value: 'keys',
      label: t('Keys')
    },
    {
      value: 'roles',
      label: t('Roles')
    },
    {
      value: 'menu',
      label: t('Menu')
    },
    {
      value: 'props',
      label: t('Props')
    }
  ];
  const theme = useTheme();
  const [panelWidth, setPanelWidth] = useState("500px");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Drawer
      sx={{
        width: { xs: "100%", lg: panelWidth },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: { xs: "100%", lg: panelWidth },
        },
      }}
      variant="persistent"
      anchor="right"
      open={openPanel}
    >
      <DrawerHeader>
        <IconButton onClick={() => setOpenPanel(false)}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />

      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            flexGrow: 1,
            maxWidth: { xs: 320, sm: 480 },
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                "&.Mui-disabled": { opacity: 0.3 },
              },
            }}
          >
            {tabs.map((tab: any, index: number) => 
              <Tab key={tab.value} label={tab.label} {...a11yProps(index)} />
            )}
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <ViewsList translations={translations} />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <KeysList translations={translations} />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={2}>
          <RoleList translations={translations} />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={3}>
          <MenuPagesList translations={translations} />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={4}>
          <InputSettings translations={translations} />
          <TextareaSettings translations={translations} />
          <ButtonSettings translations={translations} />
          <RadioSettings translations={translations} />
          <CheckboxSettings translations={translations} />
          <SwitchSettings translations={translations} />
          <WidgetInfo translations={translations} />
        </CustomTabPanel>
      </Box>
    </Drawer>
  );
};

const mapStateToProps = (state: any) => ({
  tab: state.application.tab,
  openPanel: state.application.openPanel
});

const mapDispatchToProps = {
  setTab,
  setOpenPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDetailPanel);
