import React, { useEffect } from "react";
import { Container, Box, Typography, Button, Grid } from "@mui/material";
import MainLayout from "src/layouts/view/MainLayout";
import GroupCard from "src/sections/groups/groupCard";
import { GetUserGroupsOutputDto } from "src/models/ApiOutputModels";
import { useRouter } from "next/router";
import { fetchGroups } from "src/redux/actions/groupAction";
import { connect } from "react-redux";
import { PATH_MAIN } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import Head from 'next/head';

type allGroupsProps = {
  translations: TranslationText[];
  groups: GetUserGroupsOutputDto[];
  fetchGroups: () => void;
};

const AllGroups = ({
  translations,
  groups,
  fetchGroups
}: allGroupsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      fetchGroups();
    }
  }, [router.isReady]);
  
  return (
    <MainLayout removeFooter={true} translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
      <Container
        sx={{
          py: 3,
          maxWidth: "inherit !important",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{t("All Groups")}</Typography>
          <Button
            size="medium"
            variant="contained"
            onClick={() => {
              router.push(PATH_MAIN.newGroup);
            }}
          >
            {t("Create New Group")}
          </Button>
        </Box>
        <Grid
          container
          spacing={3}
          sx={{
            pt: 3,
          }}
        >
          {groups &&
            groups.map((group, index) => {
              return (
                <Grid item xs={12} sm={6} md={2} key={index}>
                  <GroupCard
                    groupId={group.groupId}
                    title={group.name}
                    description={group.description}
                    avatarUrl={group.avatarUrl}
                    color={group.color || ''}
                  ></GroupCard>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </MainLayout>
  );
};

const mapStateToProps = (state: any) => ({
  groups: state.group.groups
});

const mapDispatchToProps = {
  fetchGroups
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("groups", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(AllGroups);
