import { alpha, useTheme, styled } from "@mui/material/styles";
import * as React from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  //   Accordion,
} from "@mui/material";
import { LandingPricingPlans } from "../landing";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  //   border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    // borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : theme.palette.palette_style.background.paper,
  boxShadow: "0 0 12px 0 rgba(0, 0, 0, 0.1)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  //   borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

type MainSolutionsProps = {
  translations: TranslationText[];
};

const MainPricing = ({
  translations
}: MainSolutionsProps) => {
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };

  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, md: 8 },
        textAlign: { xs: "center", md: "left" },
      }}
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
            spacing={3}
            sx={{
              minHeight: "60vh",
              alignItems: "center",
              justifyContent: "space-between",
              py: 6,
            }}
          >
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                alignItems: "center",
                mt: { xs: 4, md: 0 },
              }}
            >
              <Box>
                <Typography variant="h3" sx={{ mb: { xs: 1, md: 3 } }}>
                  {t("Section1 Title")}
                </Typography>

                <Typography
                  sx={{
                    mb: { xs: 1, md: 5 },
                    color: isLight ? "text.secondary" : "common.white",
                  }}
                >
                  {t("Section1 Description")}
                </Typography>
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
                    maxHeight: "50%",
                    float: "right",
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
          spacing={2}
          sx={{
            minHeight: { xs: "20vh", md: "60vh" },
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row-reverse",
          }}
        >
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", alignItems: "center", mt: { xs: 4, md: 0 } }}
          >
            <Box>
              <Typography variant="h3" sx={{ mb: { xs: 1, md: 3 } }}>
                {t("Section2 Title")}
              </Typography>

              <Typography
                sx={{
                  mb: { xs: 1, md: 5 },
                  color: isLight ? "text.secondary" : "common.white",
                }}
              >
                {t("Section2 Description")}
              </Typography>
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

        <Grid
          container
          spacing={3}
          sx={{
            minHeight: { xs: "20vh", md: "60vh" },
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", alignItems: "center", mt: { xs: 4, md: 0 } }}
          >
            <Box>
              <Typography variant="h3" sx={{ mb: { xs: 1, md: 3 } }}>
                {t("Section3 Title")}
              </Typography>

              <Typography
                sx={{
                  mb: { xs: 1, md: 5 },
                  color: isLight ? "text.secondary" : "common.white",
                }}
              >
                {t("Section3 Description")}
              </Typography>
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

        <Grid
          container
          spacing={3}
          sx={{
            minHeight: { xs: "20vh", md: "60vh" },
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row-reverse",
            mt: { xs: 4, md: 0 },
          }}
        >
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box>
              <Typography variant="h3" gutterBottom>
                {t("Section4 Title")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("Section4 Description")}
              </Typography>
              <Box
                sx={{
                  height: "4px",
                  width: "150px",
                  backgroundColor: theme.palette.palette_style.primary.main,
                  my: 2,
                }}
              ></Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                >
                  <AccordionSummary
                    aria-controls="panel1d-content"
                    id="panel1d-header"
                    sx={{background: theme.palette.palette_style.background.paper}}
                  >
                    <Typography>{t("Section4 Item1 Title")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ background: theme.palette.palette_style.background.default}}>
                    <Typography>
                      {t("Section4 Item1 Description")}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <AccordionSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                    sx={{background: theme.palette.palette_style.background.paper}}
                  >
                    <Typography>{t("Section4 Item2 Title")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ background: theme.palette.palette_style.background.default}}>
                    <Typography>
                      {t("Section4 Item2 Description")}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "panel3"}
                  onChange={handleChange("panel3")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                    sx={{background: theme.palette.palette_style.background.paper}}
                  >
                    <Typography>{t("Section4 Item3 Title")}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ background: theme.palette.palette_style.background.default}}>
                    <Typography>
                      {t("Section4 Item3 Description")}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
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
                src={t("Section4 Image")}
                sx={{
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ minHeight: "60vh", pb: 2 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ pt: 6, pb: 2, textAlign: "center" }}
          >
            {t("Section5 Title")}
          </Typography>

          <Grid container spacing={3} sx={{ alignItems: "center" }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: { xs: "100%", md: 345 }, background: theme.palette.palette_style.background.paper }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={t("Section5 Item1 Image")}
                    alt="card img"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {t("Section5 Item1 Title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("Section5 Item1 Description")}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: { xs: "100%", md: 345 }, background: theme.palette.palette_style.background.paper }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={t("Section5 Item2 Image")}
                    alt="card img"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {t("Section5 Item2 Title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("Section5 Item2 Description")}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: { xs: "100%", md: 345 }, background: theme.palette.palette_style.background.paper }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={t("Section5 Item3 Image")}
                    alt="card img"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {t("Section5 Item3 Title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("Section5 Item3 Description")}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ maxWidth: { xs: "100%", md: 345 }, background: theme.palette.palette_style.background.paper }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={t("Section5 Item4 Image")}
                    alt="card img"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {t("Section5 Item4 Title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("Section5 Item4 Description")}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default MainPricing;