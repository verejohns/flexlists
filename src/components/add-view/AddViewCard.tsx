import { styled, useTheme } from "@mui/material/styles";
import { Card, Typography, CardHeader, CardContent, Box } from "@mui/material";

const CardIconStyle = styled("img")(({ theme }) => ({
  width: 128,
  height: 128,
  margin: "auto",
}));

type AddViewCard = {
  icon: string;
  title?: string;
  description?: string;
};

export default function AddViewCard({
  icon,
  title,
  description,
  ...other
}: AddViewCard) {
  const theme = useTheme();
  return (
    <Card
      {...other}
      sx={{
        margin: "auto",
        boxShadow: "none",
        overflow: "visible",
        cursor: "pointer",
        backgroundColor: theme.palette.palette_style.background.default
      }}
    >
      <Box
        className="viewImageWrapper"
        sx={{
          borderRadius: "8px",
          border: "solid 1px #ccc",
          py: 4,
          "&:hover": {
            borderColor: theme.palette.palette_style.text.selected,
            boxShadow: "0 0 24px 0 rgba(0,0,0,.1)",
          },
        }}
      >
        <CardIconStyle src={icon} alt={title} />
      </Box>
      <Box sx={{ py: 2, px: 1 }}>
        <CardHeader sx={{ p: 0 }} title={title} />

        <CardContent sx={{ p: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "text.secondary"
                  : "common.white",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
