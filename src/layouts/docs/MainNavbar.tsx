import { styled, useTheme } from "@mui/material/styles";
import { Box, Button, AppBar, Toolbar, Container, Stack } from "@mui/material";
import useOffSetTop from "src/hooks/useOffSetTop";
import Logo from "src/components/logo";
import { MHidden } from "src/components/@material-extend";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icon } from "@iconify/react";
import homeFill from "@iconify/icons-eva/home-fill";
import fileFill from "@iconify/icons-eva/file-fill";
import bookFill from "@iconify/icons-eva/book-fill";
import forwardFill from "@iconify/icons-eva/skip-forward-fill";

import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useEffect, useState } from "react";
import { getIsExistingFlow } from "src/utils/localStorage";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LanguagePopover from "../LanguagePopover";
import ThemeMode from "../ThemeMode";
import { connect } from "react-redux";
import { AuthValidate } from "src/models/AuthValidate";
import AccountPopover from "src/layouts/AccountPopover";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 88;

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: APP_BAR_MOBILE,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("md")]: {
    height: APP_BAR_DESKTOP,
  },
}));

const ToolbarShadowStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: "auto",
  borderRadius: "50%",
  position: "absolute",
  width: `calc(100% - 48px)`,
  boxShadow: theme.shadows[24],
}));

const LogoStyle = styled("span")(({ theme }) => ({
  display: "-webkit-inline-box",
  textDecoration: "none",
  fontFamily: "system-ui",
  fontWeight: 600,
  fontSize: "30px",
  lineHeight: "40px",
  color: theme.palette.mode == "light" ? "#333" : "#ccc",
  alignItems: "center",
}));

const LogoTitleStyle = styled("span")(({ theme }) => ({
  color: theme.palette.mode == "light" ? "#54A6FB" : "#fff",
}));

type MainNavbarProps = {
  translations: TranslationText[];
  authValidate: AuthValidate;
};

export const getMenuItems = (
  t: (key: string) => string
): {
  [key: string]: { title: string; path: string; ignore?: boolean }[];
} => {
  return {
    docs: [
      {
        title: t("Adding A New List"),
        path: "/documentation/docs/adding_new_list",
      },
      {
        title: t("Adding A New Field"),
        path: "/documentation/docs/adding_new_field",
      },
      {
        title: t("Adding New Content"),
        path: "/documentation/docs/adding_new_content",
      },
      {
        title: t("Using Filters"),
        path: "/documentation/docs/using_filters",
      },
      {
        title: t("Importing Data"),
        path: "/documentation/docs/importing_data",
      },
      {
        title: t("Creating New View"),
        path: "/documentation/docs/creating_new_view",
      },
      {
        title: t("Inviting Groups"),
        path: "/documentation/docs/inviting_groups",
      },
      {
        title: t("Key Sharing"),
        path: "/documentation/docs/key_sharing",
      },
      {
        title: t("Comments Section"),
        path: "/documentation/docs/comments_section",
      },
      // {
      //   title: t("Inviting Users"),
      //   path: "/documentation/docs/inviting_users",
      // },
      // {
      //   title: t("View Permissions"),
      //   path: "/documentation/docs/view_permissions",
      // },
    ],
    tutorials: [
      // {
      //   title: t("Adding New List"),
      //   path:  "/documentation/tutorials/adding_new_list",
      // },
      // {
      //   title: t("Inviting Users"),
      //   path: "/documentation/tutorials/inviting_users",
      // },
      // {
      //   title: t("Inviting Groups"),
      //   path: "/documentation/tutorials/inviting_groups",
      // },
      // {
      //   title: t("Key Sharing"),
      //   path: "/documentation/tutorials/key_sharing",
      // },
      // {
      //   title: t("List Sharing"),
      //   path: "/documentation/tutorials/list_sharing",
      // },
    ],
    webinars: [
      // {
      //   title: t("Adding New List"),
      //   path: "/documentation/webinars/adding_new_list",
      // },
      // {
      //   title: t("Inviting Users"),
      //   path: "/documentation/webinars/inviting_users",
      // },
      // {
      //   title: t("Inviting Groups"),
      //   path: "/documentation/webinars/inviting_groups",
      // },
      // {
      //   title: t("Key Sharing"),
      //   path: "/documentation/webinars/key_sharing",
      // },
      // {
      //   title: t("List Sharing"),
      //   path: existing + "/documentation/webinars/list_sharing",
      // },
    ],
    blogs: [
      {
        title: t("A Happy Flexlists 2024!"),
        path: "/documentation/blogs/a-happy-flexlists-2024",
      },
      {
        title: t(
          "Welcome to the New Era: Introducing the Redesigned Flexlists"
        ),
        path: "/documentation/blogs/welcome-to-the-new-era",
      },
      {
        title: t("Behind the Scenes: Crafting the New Flexlists"),
        path: "/documentation/blogs/behind-the-scenes-crafting-the-new-flexlists",
      },
      {
        title: t("Flexlists: A Journey Through Time"),
        path: "/documentation/blogs/a-journey-through-time",
      },
      // {
      //   title: t("Coming Soon - Integrations"),
      //   path: "/documentation/blogs/coming_soon_integrations",
      // },
      // {
      //   title: t("Coming Soon - Views"),
      //   path: "/documentation/blogs/coming_soon_views",
      // },
      // {
      //   title: t("Inviting Groups"),
      //   path: "/documentation/blogs/inviting_groups",
      // },
      // {
      //   title: t("Key Sharing"),
      //   path: "/documentation/blogs/key_sharing",
      // },
      // {
      //   title: t("List Sharing"),
      //   path: "/documentation/blogs/list_sharing",
      // },
    ],
    roadmap: [
      {
        title: t("Coming Soon - Integrations"),
        path: "/documentation/roadmap/coming_soon_integrations",
      },
      {
        title: t("Coming Soon - Views"),
        path: "/documentation/roadmap/coming_soon_views",
      },
      // {
      //   title: t("Inviting Groups"),
      //   path: "/documentation/blogs/inviting_groups",
      // },
      // {
      //   title: t("Key Sharing"),
      //   path: "/documentation/blogs/key_sharing",
      // },
      // {
      //   title: t("List Sharing"),
      //   path: "/documentation/blogs/list_sharing",
      // },
    ],
  };
};

const MainNavbar = ({ translations, authValidate }: MainNavbarProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const isOffset = useOffSetTop(100);
  const router = useRouter();
  const pathname = router.pathname;
  const isHome = pathname === "/";
  const [isExisting, setIsExisting] = useState<boolean>(false);
  const theme = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const ICON_SIZE = {
    width: 22,
    height: 22,
  };

  const items = getMenuItems(t);
  const navConfig = [
    {
      title: t("Docs"),
      icon: <Icon icon={homeFill} {...ICON_SIZE} />,
      path: "/docs",
      children: items["docs"].filter((item) => !item.ignore),
    },
    // {
    //   title: t("Tutorials"),
    //   icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    //   path: "/tutorials",
    //   children: items["tutorials"].filter((item) => !item.ignore),
    // },
    // {
    //   title: t("Webinars"),
    //   icon: <Icon icon={fileFill} {...ICON_SIZE} />,
    //   path: "/webinars",
    //   children: items["webinars"].filter((item) => !item.ignore),
    // },
    {
      title: t("Blogs"),
      icon: <Icon icon={bookFill} {...ICON_SIZE} />,
      path: "/blogs",
      children: items["blogs"].filter((item) => !item.ignore),
    },
    {
      title: t("Roadmap"),
      icon: <Icon icon={forwardFill} {...ICON_SIZE} />,
      path: "/roadmap",
      children: items["roadmap"].filter((item) => !item.ignore),
    },
  ];

  useEffect(() => {
    if (router.isReady && getIsExistingFlow()) {
      setIsExisting(true);
    }
  }, [router.isReady]);

  const gotoSignin = async () => {
    if (isExisting) {
      await router.push({
        pathname: "/auth/loginExisting",
      });
    } else {
      await router.push({
        pathname: "/auth/login",
      });
    }
  };

  const gotoSignup = async () => {
    await router.push({
      pathname: "/auth/register",
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AppBar
      sx={{
        boxShadow: 0,
        background: theme.palette.palette_style.background.default,
      }}
    >
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            background: theme.palette.palette_style.background.paper,
            height: { md: APP_BAR_DESKTOP - 16 },
          }),
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="#"
            onClick={async () => {
              await router.push({ pathname: isExisting ? "/existing" : "/" });
            }}
          >
            <LogoStyle>
              <Logo />
              <Box
                sx={{
                  "@media screen and (max-width: 360px)": {
                    display: "none",
                  },
                }}
              >
                <LogoTitleStyle>Flex</LogoTitleStyle>Lists
              </Box>
            </LogoStyle>
          </Link>

          <MHidden width="lgDown">
            <MenuDesktop
              translations={translations}
              isOffset={isOffset}
              isHome={isHome}
              navConfig={navConfig}
            />
          </MHidden>
          <Box sx={{ flexGrow: 1 }} />
          {!authValidate?.isUserValidated && (
            <>
              <ThemeMode />
              <LanguagePopover translations={translations} />
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Button variant="contained" onClick={() => gotoSignup()}>
                  {t("Sign up")}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={() => gotoSignin()}
                >
                  {t("Sign in")}
                </Button>
              </Box>
            </>
          )}
          {
            <Stack
              direction="row"
              alignItems="center"
              spacing={{
                xs: 0.5,
                sm: 1,
              }}
            >
              {authValidate.isUserValidated && (
                <AccountPopover translations={translations} />
              )}
            </Stack>
          }
          {!authValidate?.isUserValidated && (
            <MHidden width="lgUp">
              <Button
                variant="text"
                size="small"
                onClick={() => toggleMobileMenu()}
              >
                {!isMobileMenuOpen && <MenuIcon sx={{ fontSize: 36 }} />}
                {isMobileMenuOpen && <CloseIcon sx={{ fontSize: 36 }} />}
              </Button>
              <MenuMobile
                translations={translations}
                isMenuMobileOpen={isMobileMenuOpen}
                isOffset={isOffset}
                isHome={isHome}
                navConfig={navConfig}
              />
            </MHidden>
          )}
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
};

const mapStateToProps = (state: any) => ({
  authValidate: state.admin.authValidate,
});

export default connect(mapStateToProps)(MainNavbar);
