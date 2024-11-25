import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Drawer } from "@mui/material";
import Scrollbar from "../../../components/scrollbar";
import NavSection from "../../../components/nav-section";
import useResponsive from "../../../hooks/useResponsive";
import Logo from "../../../components/logo";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { PATH_MAIN } from "src/routes/paths";
import GridViewIcon from "@mui/icons-material/GridView";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import SupportPanel from "src/sections/@list/SupportPanel";
import DisplaySettingsOutlinedIcon from "@mui/icons-material/DisplaySettingsOutlined";
import { SystemRole } from "src/enums/SystemRole";
import { AuthValidate } from "src/models/AuthValidate";
import { connect } from "react-redux";

const NAV_WIDTH = 64;
const APP_BAR_DESKTOP = 80;

type NavProps = {
  openNav: boolean;
  translations: TranslationText[];
  authValidate: AuthValidate;
  onCloseNav: () => void;
};

const Nav = ({ openNav, translations, authValidate, onCloseNav }: NavProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();
  const [visibleSupportPanel, setVisibleSupportPanel] = useState(false);

  const isDesktop = useResponsive("up", "lg");

  const navConfig = [
    {
      title: t("Create New List"),
      path: PATH_MAIN.chooseTemplate,
      icon: <AddIcon />,
      type: "path",
      role: [SystemRole.User],
    },
    {
      title: t("My Lists"),
      path: PATH_MAIN.lists,
      icon: <ListAltOutlinedIcon />,
      type: "path",
      role: [SystemRole.User],
    },
    {
      title: t("My Views"),
      path: PATH_MAIN.views,
      icon: <GridViewIcon />,
      type: "path",
      role: [SystemRole.User],
    },
    {
      title: t("Groups"),
      path: PATH_MAIN.groups,
      icon: <Groups2OutlinedIcon />,
      type: "path",
      role: [SystemRole.User],
    },
    {
      title: t("Applications"),
      path: PATH_MAIN.applications,
      icon: <DisplaySettingsOutlinedIcon />,
      type: "path",
      role: [SystemRole.User],
    },
    {
      title: t("Integrations"),
      path: PATH_MAIN.integrations,
      icon: <ExtensionOutlinedIcon />,
      type: "path",
      role: [SystemRole.User],
    },
    {
      title: t("Information"),
      path: "/documentation/docs/adding_new_list",
      icon: <InfoOutlinedIcon />,
      type: "url",
      role: [SystemRole.User],
    },
    {
      title: t("Support"),
      path: "/support",
      icon: <ContactSupportOutlinedIcon />,
      type: "panel",
      role: [SystemRole.User],
    },
  ];

  const showSupportPanel = () => {
    setVisibleSupportPanel(true);
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <NavSection
        data={navConfig.filter((item: any) =>
          item.role.includes(authValidate?.user?.systemRole)
        )}
        open={openNav}
        showSupportPanel={showSupportPanel}
      />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
        paddingTop: 3,
      }}
    >
      {!openNav && isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              position: "relative",
              border: "none",
              height: `calc(100vh - ${APP_BAR_DESKTOP + 32}px)`,
              backgroundColor: theme.palette.palette_style.background.default,
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: "280px",
              paddingLeft: 2,
              backgroundColor: theme.palette.palette_style.background.default,
            },
          }}
        >
          <Link href="/">
            <Box sx={{ px: 2.5, py: 3, display: "inline-flex", marginLeft: 2 }}>
              <Logo />
            </Box>
          </Link>
          {renderContent}
        </Drawer>
      )}
      <SupportPanel
        open={visibleSupportPanel}
        onClose={() => setVisibleSupportPanel(false)}
        translations={translations}
      />
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  authValidate: state.admin.authValidate,
});

export default connect(mapStateToProps)(Nav);
