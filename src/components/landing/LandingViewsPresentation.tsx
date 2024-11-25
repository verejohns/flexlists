import React from "react";
import { Box, Container, Typography } from "@mui/material";
import TabView from "./tab-view/TabView";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type ViewsPresentationProps = {
  translations: TranslationText[];
};

const ViewsPresentation = ({
  translations
}: ViewsPresentationProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="xl">
        <Typography gutterBottom variant="h2" sx={{ textAlign: "center" }}>
          {t("Section5 Title")}
        </Typography>
        <Typography
          gutterBottom
          variant="body1"
          sx={{ textAlign: "center", my: { xs: 2, md: 4 } }}
        >
          {t("Section5 Description")}
        </Typography>
        <TabView translations={translations} />
      </Container>
    </Box>
  );
};

export default ViewsPresentation;
