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
} from "@mui/material";
import { useRouter } from "next/router";
import { light } from "@mui/material/styles/createPalette";
import { OndemandVideo as TutorialsIcon } from "@mui/icons-material/";
import { Topic as DocsIcon } from "@mui/icons-material/";
import { CoPresent as WebinarsIcon } from "@mui/icons-material/";
import { Newspaper as BlogIcon } from "@mui/icons-material/";
import { set } from "lodash";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const LinkStyle = styled(Link)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.primary,
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

type MenuDesktopItemProps = {
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
  children?: any[];
};

function MenuDesktopItem({
  translations,
  item,
  pathname,
  isHome,
  isOffset,
  styles,
}: MenuDesktopItemProps) {
  const { title, path, children } = item;
  const isActive = pathname === path;
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <LinkStyle
      sx={{
        cursor: "pointer",
        textDecoration: "none",
        ...(isHome && { color: "text.primary" }),
        ...(isOffset && { color: "text.primary" }),
        ...(isActive && { color: "primary.main" }),
      }}
    >
      <Button
        id="documentation-button"
        aria-controls={open ? "documentation-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "inherit !important" }}
      >
        {title}
      </Button>
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
};

export default function MenuDesktop({
  translations,
  isOffset,
  isHome,
  navConfig,
}: MenuDesktopProps) {
  const router = useRouter();
  const pathname = router.pathname;
  const [open, setOpen] = useState(false);

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

  return (
    <Stack direction="row" sx={{ ml: 6 }}>
      {navConfig.map((link: ItemProps, i: number) => (
        <MenuDesktopItem
          translations={translations}
          key={link.title + i}
          item={link}
          pathname={pathname}
          isOffset={isOffset}
          isHome={isHome}
        />
      ))}
    </Stack>
  );
}
