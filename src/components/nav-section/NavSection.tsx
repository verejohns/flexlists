import { Box, List, ListItemText, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { StyledNavItem, StyledNavItemIcon } from "./styles";
import { useTheme } from "@mui/material/styles";

type NavSectionProps = {
  data: any[];
  open: boolean;
  showSupportPanel?: () => void;
};

const NavSection = ({
  data = [],
  open = false,
  showSupportPanel,
}: NavSectionProps) => {
  const router = useRouter();

  return (
    <Box>
      <List
        disablePadding
        sx={{
          p: 1,
          position: "relative",
          minHeight: "510px",
          height: "calc(100vh - 110px)",
          overflow: "auto",
        }}
      >
        {data.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            open={open}
            pathname={router.pathname}
            showSupportPanel={showSupportPanel}
          />
        ))}
      </List>
    </Box>
  );
};

export default NavSection;

type NavItemProps = {
  item: any;
  open: boolean;
  pathname: string;
  showSupportPanel?: () => void;
};

function NavItem({ item, open, pathname, showSupportPanel }: NavItemProps) {
  const { title, path, icon, type } = item;
  const theme = useTheme();

  const handleClickItem = (item: any) => {
    if (
      item.type === "panel" &&
      item.path.indexOf("support") > 0 &&
      showSupportPanel
    ) {
      showSupportPanel();
    }
    if (item.type === "url") {
      window.open(item.path, "_blank");
    }
  };

  return (
    <StyledNavItem
      to={type === "path" ? path : ""}
      // component={RouterLink}
      target={type === "url" ? "_blank" : ""}
      sx={{
        position: type === "panel" || type === "url" ? "absolute" : "relative",
        bottom:
          //path.indexOf("information") > 0
          type === "url"
            ? "80px"
            : path.indexOf("support") > 0
            ? "10px"
            : "inherit",
        marginBottom: type === "panel" || type === "url" ? 0 : 3,
        width: !open ? 42 : "inherit",
      }}
      onClick={() => {
        handleClickItem(item);
      }}
    >
      {pathname === "/dashboard" ? (
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      ) : (
        <Tooltip title={title}>
          <Box
            // component="span"
            className="svg-color"
            sx={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // backgroundImage: `url(/assets/icons/navbar/${
              //   pathname === path ? icon + "Active" : icon
              // }.svg)`,
              // backgroundSize: "cover",
              // backgroundRepeat: "no-repeat",
              borderRadius: "8px",
              backgroundColor:
                pathname === path || pathname.indexOf(path) > -1
                  ? theme.palette.palette_style.primary.main
                  : theme.palette.palette_style.background.nav_icon,
              "&:hover": {
                backgroundColor: theme.palette.palette_style.primary.main,
              },
              "& .MuiSvgIcon-root": {
                color:
                  pathname === path || pathname.indexOf(path) > -1
                    ? theme.palette.palette_style.text.white
                    : theme.palette.palette_style.primary.main,
              },
              "&:hover .MuiSvgIcon-root": {
                color: theme.palette.palette_style.text.white,
              },
            }}
          >
            {icon}
          </Box>
        </Tooltip>
      )}

      {open && (
        <ListItemText
          disableTypography
          primary={title}
          sx={{ marginLeft: 2 }}
        />
      )}
    </StyledNavItem>
  );
}
