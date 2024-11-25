import { Button, Box, Container, Typography, Grid, List } from "@mui/material";
import { useRouter } from "next/router";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { ArrowOutward as DiscoverMoreIcon } from "@mui/icons-material/";
import { motion } from "framer-motion";
import { TranslationText } from "src/models/SharedModels";
import { useTheme } from "@mui/material/styles";
import { setIsExistingFlow } from "src/utils/localStorage";

type ContentProps = {};

export default function LandingHero({
  translations,
}: ContentProps & { translations: TranslationText[] }) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const isExisting = router.pathname.includes("/existing");
  const theme = useTheme();
  const gotoSignup = async () => {
    await router.push({
      pathname: "/auth/register",
    });
  };
  const gotoHome = async () => {
    setIsExistingFlow(false);
    await router.push("/");
  };
  return (
    <Box
      sx={{
        mt: { xs: "64px", md: "88px" },
        minHeight: "calc(100vh - 144px)",
      }}
    >
      <Box
        sx={{
          background: theme.palette.palette_style.background.default,
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 3,
              py: { xs: 4, md: 16 },
              px: 2,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* <Typography variant="h1">
              Manage your data in easy and flexible way.
            </Typography> */}
            <Typography
              variant="h2"
              component={motion.h2}
              initial={{ opacity: 1 }}
              //exit={{ opacity: 0 }}
              //whileInView={{ opacity: 1 }}
              // transition={{ delay: 0.2, duration: 1 }}
            >
              {t("Title")}
            </Typography>
            <Typography
              variant="body1"
              component={motion.span}
              initial={{ opacity: 1 }}
              //whileInView={{ opacity: 1 }}
              //transition={{ delay: 1.2, duration: 1 }}
              dangerouslySetInnerHTML={{ __html: t("Body") }}
            >
              {/* <span dangerouslySetInnerHTML={{ __html: t("Body") }} /> */}
            </Typography>
            {/* <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
              >
                <Typography variant="body1">&#9989; Tasks </Typography>
                <Typography variant="body1">&#9989; Addresses </Typography>
                <Typography variant="body1">&#9989; Todos </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
              >
                <Typography variant="body1">&#9989; Wishes </Typography>
                <Typography variant="body1">&#9989; Movies </Typography>
                <Typography variant="body1">&#9989; Books </Typography>
                <Typography variant="body1">&#9989; Songs </Typography>
              </Box>
            </List> */}
            <Box
              component={motion.div}
              initial={{ x: 0, opacity: 1 }}
              // whileInView={{ x: 0, opacity: 1 }}
              // transition={{ duration: 1, delay: 0.5 }}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 1, md: 3 },
                width: { xs: "100%", md: "600px" },
                mt: { xs: 0, md: 4 },
                mb: { xs: 4, md: 0 },
              }}
            >
              {!isExisting && (
                <Button
                  size="large"
                  variant="contained"
                  sx={{
                    flex: 1,
                    fontSize: 16,
                  }}
                  onClick={async () => await router.push("/auth/register")}
                >
                  {t("Welcome back! Login")}
                </Button>
              )}
              {isExisting && (
                <>
                  <Button
                    size="large"
                    variant="contained"
                    sx={{
                      flex: 1,
                      fontSize: 16,
                    }}
                    onClick={() => {
                      gotoHome();
                    }}
                  >
                    {t("I've never used Flexlists")}
                  </Button>
                  <Button
                    size="large"
                    variant="contained"
                    sx={{
                      flex: 1,
                      fontSize: 16,
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? theme.palette.palette_style.text.black
                          : theme.palette.palette_style.text.white,
                      color:
                        theme.palette.mode === "light"
                          ? theme.palette.palette_style.text.white
                          : theme.palette.palette_style.text.black,
                      "&:hover": {
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.palette_style.text.white
                            : theme.palette.palette_style.text.black,
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,.1)"
                            : "rgba(0,0,0,.1)",
                      },
                    }}
                    // style={{ backgroundColor: "darkgreen" }}
                    onClick={async () =>
                      await router.push("/auth/loginExisting")
                    }
                  >
                    {t("I am an existing user")}
                  </Button>
                </>
              )}
              {!isExisting && (
                <Button
                  size="large"
                  variant="text"
                  onClick={async () => await router.push("/auth/login")}
                  sx={{
                    flex: 1,
                    fontSize: 16,
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.palette_style.text.black
                        : theme.palette.palette_style.text.white,
                    color:
                      theme.palette.mode === "light"
                        ? theme.palette.palette_style.text.white
                        : theme.palette.palette_style.text.black,
                    "&:hover": {
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.palette_style.text.white
                          : theme.palette.palette_style.text.black,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,.1)"
                          : "rgba(0,0,0,.1)",
                    },
                  }}
                >
                  {t("Sign up free now")}
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
              )}
            </Box>
          </Box>
        </Container>
      </Box>
      <Container
        maxWidth="xl"
        sx={{ position: "relative", minHeight: { xs: "30vh", md: "80vh" } }}
        component={motion.div}
        initial={{ y: 0, opacity: 1 }}
        // whileInView={{ y: 0, opacity: 1 }}
        // transition={{ duration: 1, delay: 2.2 }}
      >
        <Box
          component={motion.img}
          alt="hero-img"
          src={t("Main Image")}
          sx={{
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.1)",
            maxWidth: "100%",
            maxHeight: "100%",
            position: "absolute",
            top: { xs: "-24px", md: "-64px" },
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: 2,
          }}
        />
      </Container>

      {/* <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          width: "100%",
          minHeight: 88,
          backgroundColor: "#fafafa",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="img"
              alt="Logo"
              src="\assets\home\nike.png"
              height={64}
              sx={{ opacity: 0.2 }}
            />
            <Box
              component="img"
              alt="Logo"
              src="\assets\home\nike.png"
              height={64}
              sx={{ opacity: 0.2 }}
            />
            <Box
              component="img"
              alt="Logo"
              src="\assets\home\nike.png"
              height={64}
              sx={{ opacity: 0.2 }}
            />
            <Box
              component="img"
              alt="Logo"
              src="\assets\home\nike.png"
              height={64}
              sx={{ opacity: 0.2 }}
            />
            <Box
              component="img"
              alt="Logo"
              src="\assets\home\nike.png"
              height={64}
              sx={{ opacity: 0.2 }}
            />
          </Box>
        </Container>
      </Box> */}
    </Box>
  );
}
