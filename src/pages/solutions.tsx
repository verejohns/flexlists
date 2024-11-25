import { Box, Container, Typography, Grid, Button } from "@mui/material";
import React from "react";
import MainLayout from "src/layouts/main/MainLayout";
import MainSolutions from "src/components/solutions/MainSolutions";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

type SolutionsProps = {
  translations: TranslationText[];
};

const Solutions = ({ translations }: SolutionsProps) => {
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const router = useRouter();
  return (
    <MainLayout translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
      <Box
        sx={{
          mt: { xs: "64px", md: "88px" },
          background: theme.palette.palette_style.background.default,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            columnSpacing={8}
            sx={{ alignItems: "center", minHeight: "80vh", zIndex: 4 }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, md: 2 },
                justifyContent: "center",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography variant="h3" gutterBottom>
                {t("Title")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("Description")}
              </Typography>
              <Button
                variant="contained"
                onClick={async () => await router.push("/auth/register")}
              >
                {t("Try Demo Button")}
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box
                component={"img"}
                src={t("Main Image")}
                alt="placeholder"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  boxShadow: "0 0 12px 0 rgba(0,0,0,.1)",
                  mt: { xs: 2, md: 0 },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <MainSolutions translations={translations} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("existing solutions", context);
};

export default Solutions;
