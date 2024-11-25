import React from "react";
import { Box, Link, Typography, Alert, Button } from "@mui/material";
type ArchiveViewProps = {
  open: boolean;
  handleClose: () => void;
};

const ArchiveView = ({ open, handleClose }: ArchiveViewProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "40%",
        position: "absolute",
        bottom: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#222",
        borderRadius: "8px",
        px: 3,
        py: 2,
      }}
      
    >
      {/* <Alert
        action={
          <Button color="inherit" size="small">
            UNDO
          </Button>
        }
        sx={{ width: "100%" }}
        severity="info"
      >
        *Name of View* is archived.
      </Alert> */}
      <Typography variant="body1" sx={{ color: "#fff" }}>
        *Name of View* is archived.
      </Typography>
      <Link
        sx={{
          color: "#fff",
          textDecoration: "underline",
          cursor: "pointer",
          "&:hover": { color: "#fff", opacity: ".75" },
        }}
      >
        Undo
      </Link>
    </Box>
  );
};
export default ArchiveView;
