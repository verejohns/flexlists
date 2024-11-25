import { Box, Tooltip } from "@mui/material";
import {
  downloadFileUrl,
  downloadUserAvatarUrl,
} from "src/utils/flexlistHelper";
import { useTheme } from "@mui/material/styles";
import { FileImpl } from "flexlists-api";

type AvatarProps = {
  label: string;
  avatarUrl: string | FileImpl;
  color: string;
  size: number;
  toolTipLabel: string;
  visibleStatus?: boolean;
};

const Avatar = ({
  label,
  avatarUrl,
  color,
  size,
  toolTipLabel,
  visibleStatus,
}: AvatarProps) => {
  const theme = useTheme();

  return (
    <Tooltip title={toolTipLabel}>
      {
        <Box sx={{ position: "relative" }}>
          {avatarUrl ? (
            <Box
              component="img"
              src={
                avatarUrl instanceof FileImpl
                  ? URL.createObjectURL(avatarUrl.data)
                  : downloadUserAvatarUrl(avatarUrl)
              }
              sx={{
                width: size,
                height: size,
                borderRadius: 50,
                backgroundColor:
                  color || theme.palette.palette_style.background.calendarItem,
                color: theme.palette.palette_style.text.white,
                cursor: "pointer",
              }}
            />
          ) : (
            <Box
              sx={{
                width: size,
                height: size,
                borderRadius: 50,
                backgroundColor:
                  color || theme.palette.palette_style.background.calendarItem,
                color: theme.palette.palette_style.text.white,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textTransform: "uppercase",
                fontSize: 18,
              }}
            >
              {label}
            </Box>
          )}
          {visibleStatus && (
            <Box
              sx={{
                width: 14,
                height: 14,
                backgroundColor:
                  color || theme.palette.palette_style.background.calendarItem,
                borderRadius: "50%",
                position: "absolute",
                right: 0,
                bottom: 0,
                border: "2px solid white",
              }}
            />
          )}
        </Box>
      }
    </Tooltip>
  );
};

export default Avatar;
