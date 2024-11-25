import { useContext, useEffect, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  IconButton,
  Popover,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import { useRouter } from "next/router";
import { authService } from "flexlists-api";
import { connect } from "react-redux";
import { PATH_MAIN, ROOT_PATH } from "src/routes/paths";
import { accountService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import {
  setUserProfile,
  setUserSubscription,
} from "src/redux/actions/userActions";
import { UserProfile } from "src/models/UserProfile";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { AuthValidate } from "src/models/AuthValidate";
import { setAuthValidate } from "src/redux/actions/adminAction";
import { subscriptionService } from "flexlists-api";
import { SubscriptionDto } from "src/models/SubscriptionDto";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { getScreenModePayLoad, removeCookie } from "src/utils/cookieUtils";
import { ThemeContext } from "src/theme";
import { setIsExistingFlow } from "src/utils/localStorage";
import Avatar from "src/components/avatar/Avatar";

type AccountPopoverProps = {
  userProfile?: UserProfile;
  translations: TranslationText[];
  userSubscription?: SubscriptionDto;
  setUserProfile: (userProfile: UserProfile | undefined) => void;
  setAuthValidate: (authValidate: AuthValidate | undefined) => void;
  setUserSubscription: (subscription: SubscriptionDto | undefined) => void;
};

const AccountPopover = ({
  userProfile,
  translations,
  setUserProfile,
  setAuthValidate,
  setUserSubscription,
}: AccountPopoverProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [open, setOpen] = useState(null);
  const { enableThemeMode, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();
  const theme = useTheme();
  const [menus, setMenus] = useState<any[]>([]);
  const [mode, setMode] = useState<"light" | "dark">();

  useEffect(() => {
    setMode(getScreenModePayLoad());
  }, [router]);

  useEffect(() => {
    if (userProfile) {
      enableThemeMode(false);
    }
  }, [userProfile]);

  useEffect(() => {
    async function fetchData() {
      const response = await accountService.getProfile();
      if (isSucc(response) && response.data) {
        setUserProfile(response.data);
      } else {
        setUserProfile(undefined);
        return;
      }
      const subscriptionResponse =
        await subscriptionService.getUserSubscription();
      let isExistingSubscription = false;
      if (isSucc(subscriptionResponse)) {
        setUserSubscription(subscriptionResponse.data);
        if (subscriptionResponse.data) {
          isExistingSubscription = true;
        }
      } else {
        setUserSubscription(undefined);
      }

      setMenus([
        {
          label: t("Settings"),
          icon: <SettingsOutlinedIcon fontSize="small" />,
          path: PATH_MAIN.settings,
        },
        {
          label: isExistingSubscription ? t("Update Plan") : t("Upgrade Plan"),
          icon: <RocketLaunchOutlinedIcon fontSize="small" />,
          path: response?.data?.isLegacyUser
            ? ROOT_PATH.existingPricing
            : ROOT_PATH.pricing,
        },
        {
          label: t("Dark mode"),
          icon: <DarkModeOutlinedIcon fontSize="small" />,
          path: "screenMode",
        },
      ]);
    }

    fetchData();
  }, []);

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const selectMenu = (menu: any) => {
    setOpen(null);

    if (menu.path === "screenMode") {
      toggleTheme();
      setMode(mode === "dark" ? "light" : "dark");
      router.reload();
    } else router.push(menu.path);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logout = async () => {
    handleClose();
    await authService.logout();
    setUserProfile(undefined);
    setAuthValidate({
      isUserValidated: false,
      isKeyValidated: false,
      user: undefined,
    });
    removeCookie("token", {}, {});
    removeCookie("refreshToken", {}, {});
    await router.push({
      pathname: "/",
    });
    enableThemeMode(true);
    setIsExistingFlow(false);
  };

  const style = open && {
    "&:before": {
      zIndex: 1,
      content: "''",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      position: "absolute",
      bgcolor: (theme: any) => alpha(theme.palette.grey[900], 0.8),
    },
  };

  return userProfile ? (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          style,
        }}
      >
        <Avatar
          label={`${userProfile.firstName.charAt(
            0
          )}${userProfile.lastName.charAt(0)}`}
          avatarUrl={userProfile.avatarUrl || ""}
          color={userProfile.color || ""}
          size={30}
          toolTipLabel={userProfile.name}
        />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            // width: 180,
            backgroundColor: theme.palette.palette_style.background.paper,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userProfile?.firstName} {userProfile?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userProfile?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ py: 1, px: 0 }}>
          {menus.map((option) => (
            <MenuItem
              key={option.label}
              sx={{ px: 1, justifyContent: "center", alignItems: "center" }}
              onClick={() => selectMenu(option)}
            >
              {/* {option.label} */}
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
              {option.label == t("Dark mode") && (
                <Switch size="small" checked={mode === "dark"} />
              )}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ py: 1, px: 0 }}>
          <MenuItem
            onClick={logout}
            sx={{ px: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("Logout")}</ListItemText>
          </MenuItem>
        </Stack>
      </Popover>
    </>
  ) : (
    <></>
  );
};

const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = {
  setUserProfile,
  setAuthValidate,
  setUserSubscription,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountPopover);
