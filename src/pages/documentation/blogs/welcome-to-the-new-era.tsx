import React from "react";
import { Container, Typography, Box, Link, Divider } from "@mui/material";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import MainLayout from "src/layouts/docs/MainLayout";
import Head from "next/head";
import { GetServerSideProps } from "next";

type PostTemplateProps = {
  translations: TranslationText[];
};

const WelcomeToTheNewEra = ({ translations }: PostTemplateProps) => {
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
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
        }}
      >
        <Container maxWidth="lg">
          <Box
            component={"img"}
            sx={{ maxWidth: { xs: "100%", md: "80%" }, margin: "0 auto" }}
            src={t("Post Hero Image")}
          />
          <Box sx={{ mt: 4 }}>
            {/* <Link
              href={t("Post Category Link")}
              sx={{ textDecoration: "none" }}
            > */}
            <Typography variant="body1" textTransform={"uppercase"}>
              {t("Post Category")}
            </Typography>
            {/* </Link> */}
            <Typography sx={{ my: 2 }} variant="h2">
              {t("Post Title")}
            </Typography>
            <Typography variant="body1">{t("Post Date")}</Typography>
          </Box>
        </Container>

        <Container maxWidth="md" sx={{ mt: 4, fontSize: 18 }}>
          <div dangerouslySetInnerHTML={{ __html: t("Post Content") }} />

          <Divider light sx={{ mt: 4 }} />
          <Typography sx={{ my: 4 }} variant="body1">
            <span>{t("Author")} </span>
            {t("Post Author Name")}{" "}
          </Typography>
        </Container>
      </Box>
    </MainLayout>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("welcome-to-the-new-era", context);
};
export default WelcomeToTheNewEra;
