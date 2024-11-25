import { Box, Typography, Container, Grid, Button, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import { setReturnUrl } from "src/redux/actions/adminAction";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { PATH_AUTH } from "src/routes/paths";
import { setMessage } from "src/redux/actions/authAction";
import LockIcon from '@mui/icons-material/Lock';
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

interface UnauthorizedProps {
  setReturnUrl: (returnUrl: any) => void;
  setMessage: (message: any) => void;
  translations: TranslationText[];
}
function Unauthorized({ setReturnUrl, setMessage,translations }: UnauthorizedProps) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();

  const theme = useTheme();
  const styles = {
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
        backgroundColor: "#fcfeff",
        border: "none",
        color: "#666",
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
  const gotoLogin = async () => {
    setReturnUrl({ pathname: router.pathname, query: router.query });
    setMessage(null);
    await router.push({ pathname: PATH_AUTH.login });
  };
  const gotoRegister = async () => {
    setReturnUrl({ pathname: router.pathname, query: router.query });
    setMessage(null);
    await router.push({ pathname: PATH_AUTH.register });
  };
  const gotoHomePage = async () => {
    await router.push({ pathname: "/" });
  };
  return (
    <Box>
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
              src="/assets/logo.png"
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
          <EmailIcon /> {t("Contact support")}
        </Link>
      </Container>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          // minHeight: "calc(50vh - 96px)",
          minHeight:"calc(100vh - 96px)"
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            // md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems:"center",
              gap: { xs: 1, md: 3 },
            }}
          >
            <Box sx={{border:"1px solid #54a6fb", borderRadius:500}}>
              <LockIcon sx={{fontSize: 96, color: theme.palette.palette_style.text.selected, m: 4}}/>
           </Box>
            <Typography
            variant="h1"
              sx={{
                // fontSize: { xs: 64, md: 96 },
                fontWeight: 700,
                textAlign:"center"
                // color: theme.palette.palette_style.text.selected,
              }}
            >
              {t("Access denied")}
            </Typography>
            <Typography variant="body1" gutterBottom textAlign={"center"}>
              You currently do not have permission to access to list. <br /> Contact an administrator of the list to get permissions or try to log in.
            </Typography>
            {/* <Typography variant="body1" gutterBottom>
              Don&apos;t worry, we&apos;ve sent out a search party to bring it back. In
              the meantime, why not enjoy a cup of virtual coffee and try
              exploring our other pages? Happy hunting!
            </Typography> */}
            <Box sx={{ display:"flex", gap: 2, alignItems:"center"}}>
              {/* <TextField
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
              /> */}
              <Button onClick={gotoLogin} size="large" variant="contained">
                {t("Login")}
              </Button>
              <Button onClick={gotoRegister} size="large" variant="outlined">
                {t("Register")}
              </Button>
            </Box>
            <Button onClick={gotoHomePage} size="large" variant="text">
            {t("Back to homepage")}
            </Button>
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
                <Link href="" onClick={gotoHomePage}>
                  <ArrowBackOutlinedIcon
                    sx={{
                      color: theme.palette.background.paper,
                      fontSize: 40,
                    }}
                  />
                </Link>
              </Box>
              <Link
                onClick={gotoHomePage}
                href=""
                sx={{ ...styles?.link, ...{ color: "#333" } }}
              >
                Back to homepage
              </Link>
            </Box> */}
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Box
              sx={styles?.image}
              component="img"
              alt="Logo"
              src="/assets/illustrations/coffee.png"
            />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
}
const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  setReturnUrl,
  setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Unauthorized);
