import React from "react";
import MainLayout from "src/layouts/docs/MainLayout";
import { Typography, Container, Box, Grid, Button } from "@mui/material";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { validateToken } from "src/utils/tokenUtils";
import MainContents from "src/components/documentation/docs/adding-new-list/MainContents";
import Head from "next/head";
import { useRouter } from "next/router";

type DocsAddingNewListProps = {
  translations: TranslationText[];
};

const DocsAddingNewList = ({ translations }: DocsAddingNewListProps) => {
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const pathname = router.pathname;
  const isExisting = pathname.includes("/existing");
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
                onClick={async () => {
                  await router.push({
                    pathname: isExisting
                      ? "/auth/loginExisting"
                      : "/auth/register",
                  });
                }}
              >
                {t("Try Demo Button")}
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              {/* <Box
                component={"img"}
                src={t("Main Image")}
                alt="placeholder"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  boxShadow: "0 0 12px 0 rgba(0,0,0,.1)",
                  mt: { xs: 2, md: 0 },
                }}
              /> */}
              <div className="iframeWrapper" dangerouslySetInnerHTML={{ __html: t("Main Image") }} />
              {/* <iframe
                width="800"
                height="600"
                src="https://www.youtube.com/embed/X80jOMN7U6s?si=sUwHxAeE-O6PAKxK"
                title="YouTube video player"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen={true}
              ></iframe> */}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <MainContents translations={translations} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("existing docs adding new content", context);
};

export default DocsAddingNewList;
