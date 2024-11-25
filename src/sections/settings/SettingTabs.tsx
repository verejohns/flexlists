import * as React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  FormControl,
  Select,
  Divider,
  Switch,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ChangePassword from "./ChangePassword";
import GroupsIcon from "@mui/icons-material/Groups";
import GppGoodIcon from "@mui/icons-material/GppGood";
import SettingsIcon from "@mui/icons-material/Settings";
import ProfileSetting from "./ProfileSetting";
import General from "./General";
import useResponsive from "src/hooks/useResponsive";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Subscription from "./Subscription";
import Keys from "./Keys";
import { getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import KeyIcon from '@mui/icons-material/Key';

const ThemeChoiceImage = styled("img")(({ theme }) => ({
  width: 180,
  height: 180,
  border: "solid 2px #eee",
  borderRadius: "16px",
  transition: "all .2s ease",
  "&:hover": {
    cursor: "pointer",
    borderColor: "#54A6FB",
  },
}));

type TabPanelProps = {
  children?: React.ReactNode;
  index: string;
  value: string;
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ flex: 1, overflowY: "scroll", height: "100%" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (key: string) => {
  return {
    id: `vertical-tab-${key}`,
    "aria-controls": `vertical-tabpanel-${key}`,
  };
};

type SettingTabsProps = {
  translations: TranslationText[];
};

const SettingTabs = ({ translations }: SettingTabsProps) => {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [value, setValue] = useState<string>("profile");
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  useEffect(() => {
    if (router.isReady && router.query.tab) {
      setValue(router.query.tab as string);
    }
  }, [router.isReady]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);

    window.history.pushState({}, "", "?tab=" + newValue);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bgcolor: theme.palette.palette_style.background.paper,
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        scrollButtons={false}
        value={value}
        onChange={handleTabChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          maxHeight: "100%",
        }}
      >
        {/* <Tooltip title="Profile" placement="right"> */}
        <Tab
          label={isDesktop ? t("Profile") : ""}
          {...a11yProps("profile")}
          icon={<GroupsIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            minWidth: "unset",
            gap: 1,
            "& .MuiTab-iconWrapper": {
              mb: 0,
            },
          }}
          value="profile"
        />
        {/* </Tooltip> */}

        <Tab
          label={isDesktop ? t("Settings") : ""}
          {...a11yProps("general")}
          icon={<SettingsIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 1,
            "& .MuiTab-iconWrapper": {
              mb: 0,
            },
          }}
          value="general"
        />
        {/* <Tooltip title="Security" placement="right"> */}
        {/* <Tab
          label={isDesktop ? t("Settings") : ""}
          {...a11yProps("settings")}
          icon={<SettingsIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            minWidth: "unset",
            gap: 2,
            "& .MuiTab-iconWrapper": {
              mb: 0,
            },
          }}
          value="settings"
        /> */}
        <Tab
          label={isDesktop ? t("Security") : ""}
          {...a11yProps("security")}
          icon={<GppGoodIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            minWidth: "unset",
            gap: 1,
            "& .MuiTab-iconWrapper": {
              mb: 0,
            },
          }}
          value="security"
        />

        <Tab
          label={isDesktop ? t("Plan") : ""}
          {...a11yProps("security")}
          icon={<DynamicFeedIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            minWidth: "unset",
            gap: 1,
            "& .MuiTab-iconWrapper": {
              mb: 0,
            },
          }}
          value="plan"
        />
        {/* </Tooltip> */}

        {/* <Tab
          label="Notifications"
          {...a11yProps("notifications")}
          icon={<NotificationsIcon sx={{ mr: 1 }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
          value="notifications"
        />
       */}

        <Tab
          label={isDesktop ? t("Keys") : ""}
          {...a11yProps("keys")}
          icon={<KeyIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            minWidth: "unset",
            gap: 1,
            "& .MuiTab-iconWrapper": {
              mb: 0,
            },
          }}
          value="keys"
        />
      </Tabs>
      <TabPanel value={value} index="profile">
        <Typography variant="h4">{t("Profile Settings")}</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <ProfileSetting translations={translations} />
      </TabPanel>
      <TabPanel value={value} index="general">
        <Typography variant="h4">{t("General Settings")}</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <General translations={translations} />
      </TabPanel>
      <TabPanel value={value} index="security">
        <Typography variant="h4">{t("Security Settings")}</Typography>
        <Divider light sx={{ my: 4 }}></Divider>

        <Box mt={4}>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            {t("Password")}
          </Typography>
          <Divider light sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              width: "100%",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mt: 2,
              gap: { xs: 2, md: 0 },
            }}
          >
            {/* <Typography variant="body1">{t("Enhance Account")}.</Typography> */}
            <Typography variant="body1"></Typography>

            <ChangePassword translations={translations} />
          </Box>
          {/* <Typography variant="subtitle1" sx={{ mt: 4 }}>
            {t("Two Step")}
          </Typography>
          <Divider light sx={{ my: 2 }}></Divider>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                {t("Authenticator App")}
              </Typography>
              <Typography component="span" variant="body2" color="#aaa">
                {t("Google Authenticator")}{" "}
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box> */}
          {/* <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                SMS
              </Typography>
              <Typography component="span" variant="body2" color="#aaa">
                {t("Receive Message")}: +123 456 789
              </Typography>
            </Box>
            <Switch defaultChecked />
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                {t("Email Notify")}
              </Typography>
              <Typography component="span" variant="body2" color="#aaa">
                email@email.com
              </Typography>
            </Box>
            <Switch />
          </Box> */}
        </Box>
      </TabPanel>
      <TabPanel value={value} index="plan">
        <Typography variant="h4">{t("Plan")}</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <Subscription translations={translations} />
      </TabPanel>
      <TabPanel value={value} index="keys">
        <Typography variant="h4">{t("Generate System Keys")}</Typography>
        <Divider light sx={{ my: 4 }}></Divider>
        <Keys translations={translations} />
      </TabPanel>
    </Box>
  );
};

export default SettingTabs;
