import {
  Box,
  Typography,
  TextField,
  Container,
  Grid,
  InputAdornment,
  Link,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EmailIcon from "@mui/icons-material/Email";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useRouter } from "next/router";

interface Custom501Props {
  styles?: any;
}
export default function Custom501({ styles }: Custom501Props) {
  const theme = useTheme();
  // const router = useRouter();
  // const [open, setOpen] = useState(false);
  // const [currentErrorKey, setCurrentErrorKey] = useState<string>("");
  // useEffect(() => {
  //   if (router.isReady && router.query && router.query.key) {
  //     setCurrentErrorKey(router.query.key as string);
  //   }
  // }
  //   , [router.isReady, router.query]);
  // const handleClick = async () => {
  //   await navigator.clipboard.writeText(currentErrorKey);
  //   setOpen(true);
  // };
  styles = {
    image: {
      width: 660,
      objectFit: "contain",
      float: "right",
    },
    FormLogoWrapper: {
      display: "flex",
    },
    FormLogo: {
      width: 60,
      height: 45,
      objectFit: "contain",
      marginTop: "2px",
    },
    textField: {
      "& .MuiInputBase-root": {
        backgroundColor:
          theme.palette.mode === "light" ? "#fcfeff" : "rgba(255,255,255,.1)",
        color: theme.palette.mode === "light" ? "#111" : "#fff",
        border: "none",
        boxShadow: "-4px 0 12px 0 rgba(0,0,0,0.1)",
      },

      "& ::placeholder": {
        color: "#ccc",
      },

      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "none",
        },
      },
    },
    link: {
      color: theme.palette.palette_style.text.selected,
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
  };
  return (
    <Box sx={{ background: theme.palette.palette_style.background.default }}>
      <Container
        sx={{
          height: 96,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        maxWidth="xl"
      >
        <Box sx={styles?.FormLogoWrapper}>
          <Link href="/">
            <Box
              component="img"
              sx={styles?.FormLogo}
              alt="Logo"
              src={
                theme.palette.mode === "light"
                  ? "/assets/logo.png"
                  : "/assets/logo_dark.png"
              }
            />
          </Link>
        </Box>
        <Link
          sx={{
            ...styles?.link,
            ...{ display: "flex", alignItems: "center", gap: 0.5 },
          }}
          href="mailto:support@flexlists.com"
        >
          <EmailIcon /> Contact support
        </Link>
      </Container>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "calc(100vh - 96px)",
        }}
      >
        <Grid
          container
          sx={{
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: { xs: 1, md: 3 },
            }}
          >
            <Box
              sx={{
                fontSize: { xs: 64, md: 96 },
                fontWeight: 800,
                color: theme.palette.palette_style.text.selected,
              }}
            >
              501
            </Box>
            <Typography variant="h4" gutterBottom>
              Server&apos;s Doing the Disco Dance &ndash; Groovy Maintenance
              Mode
            </Typography>
            <Typography variant="body1" gutterBottom>
              Our server tried to go retro with a 501 error.
              <br />
              We&apos;re dusting off and upgrading, promise!
            </Typography>
            {/* <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                sx={{ ...styles?.textField }}
                value={currentErrorKey}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      sx={{ cursor: "pointer" }}
                      onClick={handleClick}
                      position="start"
                    >
                      <ContentPasteIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption">
                Send us this code to make sure what happened
              </Typography>
              <Snackbar
                sx={{
                  position: "absolute",
                  bottom: "-100% !important",
                  width: "100%",
                  left: { xs: 0, md: "100% !important" },
                  transform: { md: "translateX(-100%)" },
                }}
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message="Copied to clipboard"
              />
            </Box> */}
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 6 }}>
              <Box
                sx={{
                  height: 64,
                  width: 88,
                  backgroundColor: theme.palette.palette_style.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link href="/">
                  <ArrowBackOutlinedIcon
                    sx={{
                      color: theme.palette.palette_style.text.white,
                      fontSize: 40,
                    }}
                  />
                </Link>
              </Box>
              <Link
                href="/"
                sx={{ ...styles?.link, ...{ color: theme.palette.palette_style.text.primary } }}
              >
                Back to homepage
              </Link>
            </Box> */}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={styles?.image}
              component="img"
              alt="Logo"
              src={
                theme.palette.mode === "light"
                  ? "/assets/illustrations/coffee.png"
                  : "/assets/illustrations/coffeeDark.png"
              }
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
