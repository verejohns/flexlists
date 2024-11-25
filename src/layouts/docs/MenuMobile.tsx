import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import * as React from "react";
import arrowIosUpwardFill from "@iconify/icons-eva/arrow-ios-upward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Link,
  Grid,
  List,
  Stack,
  Popover,
  ListItem,
  ListSubheader,
  CardActionArea,
  Typography,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/router";
import { light } from "@mui/material/styles/createPalette";
import { OndemandVideo as TutorialsIcon } from "@mui/icons-material/";
import { Topic as DocsIcon } from "@mui/icons-material/";
import { CoPresent as WebinarsIcon } from "@mui/icons-material/";
import { Newspaper as BlogIcon } from "@mui/icons-material/";
import DocumentationMenu from "src/components/menu/DocumentationMenu";
import { set } from "lodash";
import { ThemeContext } from "@emotion/react";
import LanguagePopover from "../LanguagePopover";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { getIsExistingFlow } from "src/utils/localStorage";

const LinkStyle = styled(Link)(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: 600,
  color: theme.palette.palette_style.text.primary,
  marginRight: theme.spacing(5),
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
  "&:hover": {
    opacity: 0.48,
    textDecoration: "none",
  },
}));

IconBullet.propTypes = {
  type: PropTypes.oneOf(["subheader", "item"]),
};

function IconBullet({ type = "item" }) {
  return (
    <Box sx={{ width: 24, height: 16, display: "flex", alignItems: "center" }}>
      <Box
        component="span"
        sx={{
          ml: "2px",
          width: 4,
          height: 4,
          borderRadius: "50%",
          bgcolor: "currentColor",
          ...(type !== "item" && {
            ml: 0,
            width: 8,
            height: 2,
            borderRadius: 2,
          }),
        }}
      />
    </Box>
  );
}

type MenuMobileItemProps = {
  translations: TranslationText[];
  item: ItemProps;
  pathname: string;
  isHome: boolean;
  isOffset: boolean;
  styles?: any;
};

type ItemProps = {
  title: any;
  path?: string;
  icon?: string;
  children?: any;
};

function MenuMobileItem({
  translations,
  item,
  pathname,
  isHome,
  isOffset,
  styles,
}: MenuMobileItemProps) {
  const { title, path, children } = item;
  const isActive = pathname === path;
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = async (event: React.MouseEvent<HTMLSpanElement>) => {
    if (path === "/docs" || path === "/blogs" || path === "/roadmap") {
      setAnchorEl(event.currentTarget);
    } else {
      if (path) {
        await router.push({ pathname: path });
      }
    }
  };
  // if (children) {
  //   return (
  //     <div key={title}>
  //       <LinkStyle
  //         onClick={handleOpen}
  //         sx={{
  //           display: "flex",
  //           cursor: "pointer",
  //           alignItems: "center",
  //           textDecoration: "none",
  //           ...(isHome && { color: "text.primary" }),
  //           ...(isOffset && { color: "text.primary" }),
  //           ...(isOpen && { opacity: 0.48 }),
  //         }}
  //       >
  //         {title}
  //         <Box
  //           component={Icon}
  //           icon={isOpen ? arrowIosUpwardFill : arrowIosDownwardFill}
  //           sx={{ ml: 0.5, width: 16, height: 16 }}
  //         />
  //       </LinkStyle>

  //       <Popover
  //         open={isOpen}
  //         anchorReference="anchorPosition"
  //         anchorPosition={{ top: 80, left: 0 }}
  //         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  //         transformOrigin={{ vertical: "top", horizontal: "center" }}
  //         onClose={handleClose}
  //         PaperProps={{
  //           sx: {
  //             px: 3,
  //             pt: 5,
  //             pb: 3,
  //             right: 16,
  //             margin: "auto",
  //             maxWidth: 1280,
  //             borderRadius: 2,
  //             boxShadow: (theme) => theme.shadows[24],
  //           },
  //         }}
  //       >
  //         <Grid container spacing={3}>
  //           {children.map((list: { subheader: any; items: any }) => {
  //             const { subheader, items } = list;

  //             return (
  //               <Grid
  //                 key={subheader}
  //                 item
  //                 xs={12}
  //                 md={subheader === "Dashboard" ? 6 : 2}
  //               >
  //                 <List disablePadding>
  //                   <ListSubheader
  //                     disableSticky
  //                     disableGutters
  //                     sx={{
  //                       display: "flex",
  //                       lineHeight: "unset",
  //                       alignItems: "center",
  //                       color: "text.primary",
  //                       typography: "overline",
  //                     }}
  //                   >
  //                     <IconBullet type="subheader" /> {subheader}
  //                   </ListSubheader>

  //                   {items.map((item: ItemProps) => (
  //                     <ListItem
  //                       key={item.path}
  //                       // to={item.path}
  //                       // component={RouterLink}
  //                       // underline="none"
  //                       sx={{
  //                         p: 0,
  //                         mt: 3,
  //                         typography: "body2",
  //                         color: "text.secondary",
  //                         transition: (theme) =>
  //                           theme.transitions.create("color"),
  //                         "&:hover": { color: "text.primary" },
  //                         ...(item.path === pathname && {
  //                           typography: "subtitle2",
  //                           color: "text.primary",
  //                         }),
  //                       }}
  //                     >
  //                       {item.title === "Dashboard" ? (
  //                         <CardActionArea
  //                           sx={{
  //                             py: 5,
  //                             px: 10,
  //                             borderRadius: 2,
  //                             color: "primary.main",
  //                             bgcolor: "background.neutral",
  //                           }}
  //                         >
  //                           <Box
  //                             component={motion.img}
  //                             whileTap="tap"
  //                             whileHover="hover"
  //                             variants={{
  //                               hover: { scale: 1.02 },
  //                               tap: { scale: 0.98 },
  //                             }}
  //                             src="/assets/illustrations/illustration_dashboard.png"
  //                           />
  //                         </CardActionArea>
  //                       ) : (
  //                         <>
  //                           <IconBullet />
  //                           {item.title}
  //                         </>
  //                       )}
  //                     </ListItem>
  //                   ))}
  //                 </List>
  //               </Grid>
  //             );
  //           })}
  //         </Grid>
  //       </Popover>
  //     </div>
  //   );
  // }

  return (
    <LinkStyle
      // to={path}
      // component={RouterLink}
      sx={{
        cursor: "pointer",
        textDecoration: "none",
        ...(isHome && { color: "text.primary" }),
        ...(isOffset && { color: "text.primary" }),
        ...(isActive && { color: "primary.main" }),
      }}
    >
      <span onClick={(e) => handleOpen(e)} id="docs-menu">
        {title}
      </span>
      {/* <Popover
        open={isOpen}
        anchorReference="anchorPosition"
        onClose={handleClose}
        anchorPosition={{ top: 96, left: 0 }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: {
            p: 3,
            right: 16,
            margin: "auto",
            minHeight: 500,
            maxWidth: 1280,
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[24],
            backgroundColor: theme.palette.palette_style.background.paper
          },
        }}
      >
        <DocumentationMenu translations={translations} />
      </Popover> */}
      <Menu
        id="documentation-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "documentation-button",
          sx: {
            backgroundColor: theme.palette.palette_style.background.paper,
          },
        }}
        // sx={{zIndex: 9999}}
      >
        {children?.map((child: any) => (
          <MenuItem key={child.title} onClick={handleClose}>
            <Link
              sx={{ color: "inherit", textDecoration: "none" }}
              href={child.path}
            >
              {child.title}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </LinkStyle>
  );
}

type MenuDesktopProps = {
  translations: TranslationText[];
  isOffset: boolean;
  isHome: boolean;
  navConfig: any[];
  isMenuMobileOpen: boolean;
};

export default function MenuMobile({
  isOffset,
  isHome,
  navConfig,
  translations,
  isMenuMobileOpen,
}: MenuDesktopProps) {
  const router = useRouter();
  const theme = useTheme();
  const pathname = router.pathname;
  const [open, setOpen] = useState(false);
  const [isExisting, setIsExisting] = useState<boolean>(false);
  const t = (key: string): string => {
    if (!translations) {
      return key;
    }
    return getTranslation(key, translations);
  };

  useEffect(() => {
    if (router.isReady) {
      if (getIsExistingFlow()) {
        setIsExisting(true);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  return (
    <Stack
      //   direction="row"
      sx={{
        flexDirection: {
          xs: "column",
          lg: "row",
        },
        py: 4,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 6,
        background: theme.palette.palette_style.background.default,
        width: "100%",
        height: "calc(100vh - 64px)",
        ml: { xs: 0, lg: 6 },
        top: { xs: 64, md: 88 },
        left: { xs: 0, lg: 0 },
        transform: !isMenuMobileOpen ? "translateX(4000px)" : "translateX(0px)",
        transition: "transform ease .5s",
        position: "absolute",
        // textTransform: "uppercase",
        "& a": {
          fontSize: 18,
          textAlign: "left",
          mr: 0,
          ml: 2,
        },
      }}
    >
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          width: "100vw",
        }}
      >
        <Button
          sx={{ flex: 1, ml: 2 }}
          variant="contained"
          onClick={() => gotoSignup()}
        >
          {t("Sign up")}
        </Button>

        <Button
          sx={{ flex: 1, mr: 2 }}
          variant="outlined"
          onClick={() => gotoSignin()}
        >
          {t("Sign in")}
        </Button>
      </Box>
      {navConfig.map((link: ItemProps) => (
        <MenuMobileItem
          translations={translations}
          key={link.title}
          item={link}
          pathname={pathname}
          isOffset={isOffset}
          isHome={isHome}
        />
      ))}
    </Stack>
  );
}
