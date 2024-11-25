import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Drawer } from '@mui/material';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import useResponsive from '../../../hooks/useResponsive';
import Logo from '../../../components/logo';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { PATH_ADMIN } from "src/routes/paths";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import { SystemRole } from "src/enums/SystemRole";
import { AuthValidate } from "src/models/AuthValidate";
import { connect } from "react-redux";

const NAV_WIDTH = 64;
const APP_BAR_DESKTOP = 80;

type NavProps = {
  openNav: boolean;
  authValidate: AuthValidate;
  onCloseNav: () => void;
};

const Nav = ({ openNav, authValidate, onCloseNav }:NavProps) => {
  const router = useRouter();
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'lg');

  const navConfig = [
    {
      title: "Content Management",
      path: PATH_ADMIN.contentManagement,
      icon: <DashboardOutlinedIcon />,
      role: [SystemRole.Admin, SystemRole.ContentManager]
    },
    {
      title: "Support",
      path: PATH_ADMIN.support,
      icon: <ContactSupportOutlinedIcon />,
      role: [SystemRole.Admin, SystemRole.Support]
    }
  ];

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
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
      }}
    >
      <NavSection data={navConfig.filter((item: any) => item.role.includes(authValidate?.user?.systemRole))} open={openNav} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
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
              position: 'relative',
              border: 'none',
              height: `calc(100vh - ${APP_BAR_DESKTOP + 25}px)`,
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
            sx: { width: '280px', paddingLeft: 2, backgroundColor: theme.palette.palette_style.background.default },
          }}
        >
          <Link href="/">
            <Box sx={{ px: 2.5, py: 3, display: 'inline-flex', marginLeft: 2 }}>
              <Logo />
            </Box>
          </Link>
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  authValidate: state.admin.authValidate,
});

export default connect(mapStateToProps)(Nav);
