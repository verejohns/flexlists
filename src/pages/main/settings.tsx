import React from "react";
import { Container } from "@mui/material";
import SettingTabs from "src/sections/settings/SettingTabs";
import MainLayout from "src/layouts/view/MainLayout";
import { getTranslations } from "src/utils/i18n";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";

type SettingsProps = {
  translations: TranslationText[];
};

const Settings = ({ translations }: SettingsProps) => {
  return (
    <MainLayout disableOverflow={true} translations={translations}>
      <Container
        sx={{
          boxShadow: "0 0 24px 0 rgba(0,0,0,0.05)",
          position: "relative",
          mt: 4,
          p: 0,
          pl: { md: 0 },
          overflow: "hidden",
          minHeight: "calc(100vh - 153px)",
          maxHeight: "calc(100vh - 153px)",
        }}
        maxWidth="xl"
      >
        <SettingTabs translations={translations} />
      </Container>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("settings", context);
};

export default Settings;
