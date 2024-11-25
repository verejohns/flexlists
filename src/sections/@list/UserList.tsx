import { Box, Tooltip, Popover } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "@coreui/coreui/dist/css/coreui.min.css";
import { connect } from "react-redux";
import { getViewUserGroups, getViewUsers } from "src/redux/actions/viewActions";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { View } from "src/models/SharedModels";
import Avatar from "src/components/avatar/Avatar";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type ViewUsersProps = {
  users: any[];
  currentView: View;
  translations: TranslationText[];
  getViewUsers: (viewId: number) => void;
  getViewUserGroups: (viewId: number) => void;
};

const ViewUsersList = ({
  users,
  currentView,
  translations,
  getViewUsers,
  getViewUserGroups,
}: ViewUsersProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(null);

  useEffect(() => {
    getViewUsers(currentView.id);
  }, [router.isReady, getViewUsers]);

  useEffect(() => {
    getViewUserGroups(currentView.id);
  }, [router.isReady, getViewUserGroups]);

  const handleClose = async () => {
    setOpen(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          width: "max-content",
        }}
      >
        {users
          .filter((user: any, index: number) => index < 2)
          .map((user: any, index: number) => (
            <Box
              key={index}
              sx={{
                marginLeft: index ? "-7px" : "inherit",
                zIndex:
                  users.filter((user: any, index: number) => index < 2).length -
                  index,
              }}
            >
              <Avatar
                label={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                avatarUrl={user.avatarUrl || ''}
                color={user.color || ''}
                size={32}
                toolTipLabel={user.name}
              />
            </Box>
          ))}
        {users.length > 2 && (
          <Tooltip title={t("Other Members")}>
            <Box
              sx={{
                minWidth: 32,
                maxWidth: 32,
                height: 32,
                borderRadius: 50,
                border: `1px solid ${theme.palette.palette_style.text.primary}`,
                position: "relative",
                cursor: "pointer",
                display: "grid",
                placeContent: "center",
              }}
              onClick={(event: any) => {
                setOpen(event.currentTarget);
              }}
            >
              <Box sx={{ fontSize: "12px" }}>+{users.length - 2}</Box>
            </Box>
          </Tooltip>
        )}
      </Box>
      <Popover
        id="user_popover"
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            minWidth: 65,
            backgroundColor: theme.palette.palette_style.background.paper,
            px: 2,
            py: 1,
          },
        }}
      >
        {/* <Tooltip title={t("Other Members")}> */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
          }}
        >
          {users
            .filter((user: any, index: number) => index > 1)
            .map((user: any, index: number) => (
              <Box
                key={index}
                sx={{
                  marginLeft: index ? "-7px" : "inherit",
                  zIndex:
                    users.filter((user: any, index: number) => index > 1)
                      .length - index,
                }}
              >
                <Avatar
                  label={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                  avatarUrl={user.avatarUrl || ''}
                  color={user.color || ''}
                  size={32}
                  toolTipLabel=''
                />
              </Box>
            ))}
        </Box>
        {/* </Tooltip> */}
      </Popover>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  users: state.view.users,
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  getViewUsers,
  getViewUserGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewUsersList);
