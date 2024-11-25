import * as React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material/";
import { useTheme } from "@mui/material/styles";

type FeatureCard = {
  icon: string;
  title?: string;
  description?: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
  ...other
}: FeatureCard) {
  const theme = useTheme()
  return (
    <Card
      sx={{
        width: { xs: "calc(50% - 8px)", md: "calc(25% - 18px)" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pt: 4,
        textAlign: "center",
        backgroundColor: theme.palette.palette_style.background.paper
      }}
      {...other}
    >
      <Avatar
        sx={{ bgcolor: "#54A6FB11", height: "64px", width: "64px" }}
        aria-label="recipe"
      >
        {icon}
      </Avatar>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
