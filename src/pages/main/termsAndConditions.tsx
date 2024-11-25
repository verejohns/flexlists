import React from "react";
import { Box, Container, Typography } from "@mui/material";
import TermsTabs from "src/sections/terms-and-conditions/TermsTabs";
function TermsAndConditions() {
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 0, md: 4 } }}>
      <Box
        sx={{
          p: 4,
          background: "linear-gradient(120deg, #54A6FB, #3B80C8)",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" gutterBottom color={"white"} fontWeight={300}>
          Terms and Conditions Flexlists.com
        </Typography>
        <Typography variant="body1" color={"white"}>
          Last updated Dec 2, 2023
        </Typography>
      </Box>
      <TermsTabs />
    </Container>
  );
}

export default TermsAndConditions;
