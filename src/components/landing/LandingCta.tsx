import { Box, Container, Typography, Button } from "@mui/material";
import { ArrowOutward as DiscoverMoreIcon } from "@mui/icons-material/";
import React from "react";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";

type LandingCTAProps = {
  translations: TranslationText[];
};

const LandingCTA = ({ translations }: LandingCTAProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const pathname = router.pathname;
  const isExisting = pathname.includes("/existing");
  const existing = pathname.replace("/existing", "");
  const theme = useTheme();

  return (
    <Box sx={{ m: 2 }}>
      <Container
        maxWidth="xl"
        sx={{
          // background:
          //   "linear-gradient(315deg, hsla(211, 95%, 66%, 1) 0%, hsla(211, 56%, 49%, 1) 71%)",
          backgroundColor: theme.palette.palette_style.background.cta_section,
          py: 8,
          textAlign: "center",
          borderRadius: 4,
          color: "#fff",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            px: { xs: 4, md: 8 },
          }}
        >
          {t("Section6 Description1")}
          <br />
          {t("Section6 Description2")}
        </Typography>
        <Button
          size="large"
          variant="text"
          onClick={async () => {
            await router.push({
              pathname: isExisting ? "/auth/loginExisting" : "/auth/register",
            });
          }}
          sx={{
            fontSize: 16,
            backgroundColor: "#fff",
            color: "#111",
            mt: 4,
            px: 8,
            transition: "all ease .5s",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#111",
            },
          }}
        >
          {t("Try now")}{" "}
          <DiscoverMoreIcon
            sx={{
              ml: 1,
              transform: "rotate(45deg)",
              transition: "transform ease .5s",
              ".MuiButton-text:hover &": {
                transform: "rotate(0)",
              },
            }}
          />
        </Button>
        <Typography variant="body2" sx={{ mt: 4 }}>
          {t("Section6 Footer")}
        </Typography>
      </Container>
    </Box>
  );
};

export default LandingCTA;
