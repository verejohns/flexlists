import React, { useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { htmlToMarkdown, markdownToHtml } from "src/utils/parserHelper";
import { formats, modules } from "./wysiwygConfig";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const styles = {};
type MarkdownEditorProps = {
  markdown: string;
  setMarkdown: (editValue: string) => void;
};
const MarkdownEditor = ({
  markdown: markdown,
  setMarkdown: setMarkdown,
}: MarkdownEditorProps) => {
  const [value, setValue] = useState<string>(markdownToHtml(markdown || ""));
  const handleEditorChange = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
    setMarkdown(htmlToMarkdown(newValue));
  };

  return (
    <Box
      sx={{
        "& .ql-editor": {
          height: "250px",
        },
        "& .ql-toolbar.ql-snow": {
          borderColor: "rgba(0,0,0,0.1)",
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        },
      }}
    >
      <ReactQuill
        // style={styles}
        modules={modules}
        formats={formats}
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

export default MarkdownEditor;
