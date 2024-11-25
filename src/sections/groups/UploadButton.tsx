import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";

const IconUploadButton: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Perform upload logic here
      console.log("Uploading file:", selectedFile);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <input
        type="file"
        accept=".jpg,.png"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <Typography sx={{ mr: 2 }}>
        Upload file from your local storage.
      </Typography>
      <label htmlFor="file-upload">
        <Button component="span">Add File</Button>
      </label>
      <Button
        sx={{ ml: 2 }}
        variant="outlined"
        color="primary"
        onClick={handleUpload}
      >
        Start Upload
      </Button>
    </Box>
  );
};

export default IconUploadButton;
