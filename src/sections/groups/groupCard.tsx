import { useTheme } from "@mui/material/styles";
import { Card, CardHeader, CardContent, Box, Tooltip } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { PATH_MAIN } from "src/routes/paths";
import WysiwygView from "src/components/wysiwyg/wysiwygView";
import GroupAvatar from "src/components/avatar/GroupAvatar";

type GroupCard = {
  groupId: number;
  title?: string;
  description?: string;
  avatarUrl?: string;
  color: string;
};

export default function GroupCard({
  groupId,
  title,
  description,
  avatarUrl,
  color,
  ...other
}: GroupCard) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Tooltip title={description ? <WysiwygView value={description} /> : ""}>
      <Link
        href=""
        onClick={() => {
          router.push(`${PATH_MAIN.groups}/${groupId}`);
        }}
        style={{ textDecoration: "none" }}
      >
        <Card
          component={motion.div}
          {...other}
          sx={{
            margin: "auto",
            maxHeight: "260px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.palette_style.background.paper,
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Box sx={{ pt: 3 }}>
            <GroupAvatar
              avatarUrl={avatarUrl || ""}
              name={title || ""}
              color={color}
              size={100}
              groupId={groupId}
            />
          </Box>
          <CardHeader
            title={title}
            sx={{
              textAlign: "center",
            }}
          />
          <CardContent
            sx={{
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              pt: 0,
              "& .ql-editor": {
                textAlign: "center",
              },
            }}
          >
            {/* <Typography
              variant="caption"
              sx={{
                whiteSpace: "nowrap",
                lineHeight: 1,
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "text.secondary"
                    : "common.white",
              }}
            >
              {description}
            </Typography> */}
            <WysiwygView value={description} />
          </CardContent>
        </Card>
      </Link>
    </Tooltip>
  );
}
