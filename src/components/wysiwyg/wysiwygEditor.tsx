import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { formats, modules } from "./wysiwygConfig";
import {useTheme} from "@mui/material/styles";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const styles = {};
type WysiwygEditorProps = {
  value: string;
  setValue: (editValue: string) => void;
};
const WysiwygEditor = ({ value, setValue }: WysiwygEditorProps) => {
  const handleEditorChange = (newValue: string) => {
    setValue(newValue);
  };
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        "& .ql-editor": {
          height: "250px",
        },
        ".ql-toolbar.ql-snow, .ql-container.ql-snow": {
          borderColor: theme.palette.mode === "light" ? "#ccc" : "rgba(255, 255, 255, 0.23)"
        },
        ".ql-toolbar .ql-stroke": {
          fill: "none",
          stroke: theme.palette.mode === "light" ? "#666" : "#fff",
        } ,
        ".ql-toolbar .ql-fill, .ql-toolbar .ql-stroke.ql-fill": {
          // fill: "#fff",
          fill: theme.palette.mode === "light" ? "#666" : "#fff",
          // stroke: "none"
        },
        ".ql-toolbar .ql-picker": {
          // color: "#fff",
          color: theme.palette.mode === "light" ? "#666" : "#fff",

        },
      }}
    >
      <ReactQuill
        // style={styles}
        modules={modules}
        formats={formats}
        style={{ width: "100%", height: "100%" }}
        value={value}
        onChange={(newValue, delta, source) => {
          if (source === "user") {
            handleEditorChange(newValue);
          }
        }}
      />
    </Box>
  );
};

export default WysiwygEditor;
