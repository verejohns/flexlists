import { Box, Container, Typography, Grid, Button } from "@mui/material";
import React from "react";
import MainLayout from "src/layouts/main/MainLayout";
import MainPricing from "src/components/pricing/MainPricing";
import { LandingPricingPlans } from "src/components/landing";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import Head from "next/head";
import PricingTable from "src/components/pricing/PricingTable";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
type SolutionsProps = {
  translations: TranslationText[];
};

const Pricing = ({ translations }: SolutionsProps) => {
  const router = useRouter();
  const theme = useTheme();
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
  const [openComparison, setOpenComparison] = React.useState(false);
  return (
    <MainLayout translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
      <Box
        sx={{
          mt: { xs: "5px", md: "10px" },
          background: theme.palette.palette_style.background.default,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Container maxWidth="xl">
          <LandingPricingPlans
            translations={translations}
            isExisting={true}
            openComparison={() => setOpenComparison(!openComparison)}
          />
          <Box sx={{ py: 4 }} hidden={!openComparison}>
            <Box sx={{ px: 4, py: 8 }}>
              <Typography variant="h2" gutterBottom>
                {t("Plan comparison")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("Compare our plans and check which one suits you best.")}
              </Typography>
            </Box>
            <PricingTable translations={translations} />
          </Box>
          {/* <Grid
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
              <Button variant="contained">{t("Try Demo Button")}</Button>
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
                }}
              />
            </Grid>
          </Grid> */}
        </Container>
      </Box>
      {/* <MainPricing translations={translations} /> */}
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("existing pricing", context);
};

export default Pricing;
