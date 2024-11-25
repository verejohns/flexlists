import { Button, Grid, Typography, Box } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/FacebookRounded";

export default function SocialLogin() {
  return (
    <>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              height: "1px",
              background: "#eee",
              width: "100%",
            }}
          ></Box>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              paddingInline: "1rem",
            }}
          >
            or
          </Typography>
          <Box
            sx={{
              height: "1px",
              background: "#eee",
              width: "100%",
            }}
          ></Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1" textAlign="center">
          Sign in with
        </Typography>
      </Grid>
      <Grid
        container
        columnSpacing={2}
        sx={{
          marginBlock: "1rem",
        }}
        id="social_btns"
      >
        <Grid item xs={4}>
          {
            <Button
              onClick={() => {
                alert("Test");
              }}
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                width: "100%",
                display: {xs: 'block', md: "flex"},
                justifyContent: "center",
                padding: ".825rem 0",
                textTransform: "capitalize",
                color: '#0D0934',
                borderColor: '#0D0934'
              }}
            >
              <Typography>Google</Typography>
            </Button>
          }
        </Grid>

        <Grid item xs={4}>
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            sx={{
              width: "100%",
              display: {xs: 'block', md: "flex"},
              justifyContent: "center",
              padding: ".825rem 0",
              textTransform: "capitalize",
              color: '#0D0934',
              borderColor: '#0D0934'
            }}
          >
            <Typography>GitHub</Typography>
          </Button>
        </Grid>

        <Grid item xs={4}>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{
              width: "100%",
              display: {xs: 'block', md: "flex"},
              justifyContent: "center",
              padding: ".825rem 0",
              textTransform: "capitalize",
              color: '#0D0934',
              borderColor: '#0D0934'
            }}
          >
            <Typography>Facebook</Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
