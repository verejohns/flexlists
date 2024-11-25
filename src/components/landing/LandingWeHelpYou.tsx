import { useTheme } from "@mui/material/styles";
import { Box, Grid, Button, Container, Typography } from "@mui/material";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useRouter } from "next/router";

type LandingWeHelpYouProps = {
  translations: TranslationText[];
};

const LandingWeHelpYou = ({ translations }: LandingWeHelpYouProps) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 8 } }}
    >
      <Box
        sx={
          {
            // backgroundColor: "#fafafa",
          }
        }
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={5}
            sx={{
              minHeight: "80vh",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box>
                <Typography
                  component="p"
                  variant="overline"
                  sx={{ mb: 2, color: "info.main" }}
                >
                  {t("Solutions")}
                </Typography>

                <Typography variant="h3" sx={{ mb: 3 }}>
                  {t("Section1 Title")}
                </Typography>

                <Typography
                  sx={{
                    mb: 5,
                    color: isLight ? "text.secondary" : "common.white",
                  }}
                >
                  {t("Section1 Description")}
                </Typography>

                <Button
                  size="large"
                  variant="contained"
                  onClick={async () => await router.push("/auth/register")}
                >
                  {t("Discover More Button")}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} dir="ltr">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  justifyContent: "center",
                }}
              >
                <Box
                  component={"img"}
                  alt="We help you simplify your workflow."
                  src={t("Section1 Image")}
                  sx={{
                    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Grid
          container
          spacing={5}
          sx={{
            minHeight: "80vh",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row-reverse",
          }}
        >
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box>
              <Typography
                component="p"
                variant="overline"
                sx={{ mb: 2, color: "info.main" }}
              >
                {t("Solutions")}
              </Typography>

              <Typography variant="h3" sx={{ mb: 3 }}>
                {t("Section2 Title")}
              </Typography>

              <Typography
                sx={{
                  mb: 5,
                  color: isLight ? "text.secondary" : "common.white",
                }}
              >
                {t("Section2 Description")}
              </Typography>

              <Button
                size="large"
                variant="contained"
                onClick={async () => await router.push("/auth/register")}
              >
                {t("Discover More Button")}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} dir="ltr">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                justifyContent: "center",
              }}
            >
              <Box
                component={"img"}
                alt="We help you simplify your workflow."
                src={t("Section2 Image")}
                sx={{
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="xl">
        <Grid
          container
          spacing={5}
          sx={{
            minHeight: "80vh",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box>
              <Typography
                component="p"
                variant="overline"
                sx={{ mb: 2, color: "info.main" }}
              >
                {t("Solutions")}
              </Typography>

              <Typography variant="h3" sx={{ mb: 3 }}>
                {t("Section3 Title")}
              </Typography>

              <Typography
                sx={{
                  mb: 5,
                  color: isLight ? "text.secondary" : "common.white",
                }}
              >
                {t("Section3 Description")}
              </Typography>

              <Button
                size="large"
                variant="contained"
                onClick={async () => await router.push("/auth/register")}
              >
                {t("Discover More Button")}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} dir="ltr">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                justifyContent: "center",
              }}
            >
              <Box
                component={"img"}
                alt="We help you simplify your workflow."
                src={t("Section3 Image")}
                sx={{
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingWeHelpYou;
