import { Box, styled, Avatar } from "@mui/material";
import { downloadGroupAvatarUrl } from "src/utils/flexlistHelper";
import { useTheme } from "@mui/material/styles";
import { FileImpl } from "flexlists-api";

type GroupAvatarProps = {
  avatarUrl: string | FileImpl;
  name: string;
  color: string;
  size: number;
  groupId?: number;
  isDownloadMemory?: boolean;
};

const GroupAvatar = (props: GroupAvatarProps) => {
  const { avatarUrl, name, color, size, isDownloadMemory, groupId } = props;
  const theme = useTheme();

  const AvatarImg = styled("img")(({ theme }) => ({
    width: "100%",
    height: "100%",
  }));

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        border: "solid 6px #fff",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.1)",
        fontSize: 40,
        textTransform: "uppercase",
        position: "relative",
        backgroundColor:
          color || theme.palette.palette_style.background.calendarItem,
        "&:hover .overlay": {
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          position: "absolute",
        },
      }}
    >
      {avatarUrl ? (
        <AvatarImg
          src={
            avatarUrl instanceof FileImpl
              ? URL.createObjectURL(avatarUrl.data)
              : !isDownloadMemory
              ? downloadGroupAvatarUrl(avatarUrl, groupId)
              : avatarUrl
          }
        />
      ) : (
        <Box>{name.charAt(0)}</Box>
      )}
    </Avatar>
  );
};

export default GroupAvatar;
