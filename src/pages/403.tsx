import {
  Box,
  Typography,
  TextField,
  Container,
  Grid,
  InputAdornment,
  Button,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EmailIcon from "@mui/icons-material/Email";

interface Custom403Props {
  styles?: any;
}
export default function Custom403({ styles }: Custom403Props) {
  const theme = useTheme();
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
        backgroundColor: theme.palette.mode === "light" ? "#fcfeff" : "rgba(255,255,255,.1)",
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
              src={theme.palette.mode === "light" ? "/assets/logo.png" : "/assets/logo_dark.png"}
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
        <Grid container>
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
              403
            </Box>
            <Typography variant="h4" gutterBottom>
              Access Blocked &ndash; Our Server&apos;s Acting Like the Digital Fort Knox. Security First!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Oops, You&apos;ve Stumbled into the Server&apos;s Secret Lair! Unauthorized access detected. Maybe bring donuts next time?
            </Typography>
            {/* <Box>
              <TextField
                fullWidth
                sx={styles?.textField}
                placeholder="How can we help you?"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box> */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 6 }}>
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
                <Link href="./existingHome">
                  <ArrowBackOutlinedIcon
                    sx={{
                      color: theme.palette.palette_style.text.white,
                      fontSize: 40,
                    }}
                  />
                </Link>
              </Box>
              <Link
                href="./existingHome"
                sx={{ ...styles?.link, ...{ color: theme.palette.palette_style.text.primary } }}
              >
                Back to homepage
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={styles?.image}
              component="img"
              alt="Logo"
              src={theme.palette.mode === "light" ? "/assets/illustrations/coffee.png" : "/assets/illustrations/coffeeDark.png"}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
