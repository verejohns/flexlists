import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@mui/material/styles";

const ReactQuill = dynamic(
  () => {
    return import("react-quill");
  },
  { ssr: false }
);

const HTMLEditor = ({
  id,
  name,
  value,
  handleChange,
  preview,
  isPrint,
  isError,
}: {
  id: number;
  name: string;
  value: string;
  handleChange: (newValue: string) => void;
  preview?: boolean;
  isPrint?: boolean;
  isError?: boolean;
}) => {
  const theme = useTheme();

  return !preview ? (
    <Box
      key={id}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
        height: "300px",
        paddingBottom: "50px",
        ".ql-toolbar.ql-snow, .ql-container.ql-snow": {
          borderColor: isError ? theme.palette.palette_style.error.main : theme.palette.palette_style.border.HTMLeditor
        },
        ".ql-toolbar .ql-stroke": {
          fill: "none",
          stroke: theme.palette.mode === "light" ? "#666" : "#fff",
        },
        ".ql-toolbar .ql-fill, .ql-toolbar .ql-stroke.ql-fill": {
          // fill: "#fff",
          fill: theme.palette.mode === "light" ? "#666" : "#fff",
          // stroke: "none"
        },
        ".ql-toolbar .ql-picker": {
          // color: "#fff",
          color: theme.palette.mode === "light" ? "#666" : "#fff",
        },
        ".ql-toolbar .ql-picker-options": {
          border: "none !important",
          color: theme.palette.mode === "light" ? "#666" : "#fff",
          background: theme.palette.palette_style.background.paper,
        },
      }}
    >
      <Typography
        variant="body2"
        component={"label"}
        sx={{
          textTransform: "capitalize",
          fontSize: 12,
          position: "absolute",
          top: "-10px",
          left: "10px",
          zIndex: 2,
          px: 0.5,
          background: theme.palette.palette_style.background.default,
          color: isError ? theme.palette.palette_style.error.main : theme.palette.palette_style.text.renderFieldLabel,

        }}
      >
        {name}
      </Typography>
      <ReactQuill
        theme="snow"
        value={value}
        style={{ width: "100%", height: "100%" }}
        onChange={handleChange}
      />
    </Box>
  ) : !isPrint ? (
    <div className="focusedNeed" tabIndex={8}>
      <Box
        key={id}
        className="markdownBox"
        sx={{
          width: "100%",
          border: "1px solid rgba(158, 158, 158, 0.32)",
          p: 2,
          position: "relative",
          borderRadius: "6px",
          ".focusedNeed:focus &": {
            // border: "2px solid #1976d2",
          },
          "&:hover": {
            // border: "1px solid rgba(0, 0, 0, 0.87)",
          },
        }}
      >
        <Typography
          variant="body2"
          component={"label"}
          sx={{
            textTransform: "capitalize",
            fontSize: 12,
            position: "absolute",
            top: "-10px",
            left: "10px",
            zIndex: 2,
            px: 0.5,
            background: theme.palette.palette_style.background.default,
            color:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.7)",
            ".focusedNeed:focus &": {
              // color: "#1976d2",
              // top: "-11px",
              // left: "9px",
            },
          }}
        >
          {name}
        </Typography>
        <Box
          className="htmlViewer"
          dangerouslySetInnerHTML={{
            __html: value?.toString(),
          }}
          sx={{
            ".focusedNeed:focus &": {
              margin: "-1px",
            },
          }}
        />
      </Box>
    </div>
  ) : (
    <div className="focusedNeed" tabIndex={8}>
      <Box
        key={id}
        className="markdownBox"
        sx={{
          width: "100%",
          border: "0px solid rgba(158, 158, 158, 0.32)",
          p: 0,
          position: "relative",
          borderRadius: "6px",
          ".focusedNeed:focus &": {
            // border: "2px solid #1976d2",
          },
          "&:hover": {
            // border: "1px solid rgba(0, 0, 0, 0.87)",
          },
        }}
      >
        <Typography
          variant="body2"
          component={"label"}
          sx={{
            textTransform: "capitalize",
            fontSize: 12,
            position: "absolute",
            top: "-10px",
            left: "10px",
            zIndex: 2,
            px: 0.5,
            background: theme.palette.palette_style.background.default,
            color:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.7)",
            ".focusedNeed:focus &": {
              // color: "#1976d2",
              // top: "-11px",
              // left: "9px",
            },
          }}
        >
          {name}
        </Typography>
        <Box
          className="htmlViewer"
          dangerouslySetInnerHTML={{
            __html: value?.toString(),
          }}
          sx={{
            ".focusedNeed:focus &": {
              margin: "-1px",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default HTMLEditor;
