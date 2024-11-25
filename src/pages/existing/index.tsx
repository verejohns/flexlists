import { styled } from "@mui/material/styles";
// import Page from '../../components/Page';
import {
  LandingHero,
  LandingWeHelpYou,
  LandingQuickCreate,
  LandingPricingPlans,
  LandingTrustedBy,
  LandingCTA,
} from "src/components/landing";
import MainLayout from "src/layouts/main/MainLayout";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { Errors, FlexlistsError, isSucc } from "src/utils/responses";
import { authService } from "flexlists-api";
import { parse, serialize } from "cookie";
import { validateToken } from "src/utils/tokenUtils";
import Head from "next/head";

// const RootStyle = styled(Page)({
//   height: '100%'
// });

declare module "@mui/material/styles/createPalette" {
  interface Palette {
    palette_style?: any;
  }
}

const ContentStyle = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.default,
}));

type HomeProps = {
  translations: TranslationText[];
};

const Home = ({ translations }: HomeProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  return (
    <MainLayout translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
      <LandingHero translations={translations} />
      <LandingWeHelpYou translations={translations} />
      <LandingTrustedBy translations={translations} />
      <LandingQuickCreate translations={translations} />
      {/* <LandingPricingPlans /> */}
      <LandingCTA translations={translations} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const verifyToken = await validateToken(context);

  if (verifyToken) {
    return verifyToken;
  }
  return await getTranslations("existing landing page", context);
};

export default Home;
