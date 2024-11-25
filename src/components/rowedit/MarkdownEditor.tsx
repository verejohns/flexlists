import { Box, Typography, TextField } from "@mui/material";
import ReactMarkdown from "react-markdown";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import rehypeRaw from "rehype-raw";
import { useTheme } from "@mui/material/styles";

const SimpleMdeReact = dynamic(
  () => {
    return import("react-simplemde-editor");
  },
  { ssr: false }
);

const MarkdownEditor = ({
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
        "& .editor-toolbar": {
          borderColor: isError ? theme.palette.palette_style.error.main : "",
        },
        "& .CodeMirror": {
          background: theme.palette.palette_style.background.default,
          borderColor: isError
            ? `${theme.palette.palette_style.error.main} !important`
            : "",
        },
        "& .editor-toolbar button i": {
          color:
            theme.palette.mode === "light"
              ? theme.palette.palette_style.text.black
              : theme.palette.palette_style.text.white,
        },
        "& .editor-toolbar button:hover i": {
          color: theme.palette.palette_style.text.black,
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          textTransform: "capitalize",
          fontSize: "12px",
          position: "absolute",
          top: "-10px",
          left: "12px",
          background: theme.palette.palette_style.background.default,
          color: isError
            ? theme.palette.palette_style.error.main
            : theme.palette.palette_style.text.renderFieldLabel,
          zIndex: 222,
          px: 0.5,
        }}
      >
        {name}
      </Typography>
      <SimpleMdeReact
        value={value}
        style={{ width: "100%" }}
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
            background: theme.palette.palette_style.background.default,
            color:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.7)",
            zIndex: 2,
            px: 0.5,
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
          className="markdownContent"
          // sx={{
          //   ".focusedNeed:focus &": {
          //     margin: "-1px",
          //   },
          // }}
        >
          <ReactMarkdown
            remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            //rehypePlugins={[rehypeRaw as any]}
            linkTarget="_blank"
          >
            {value
              ? (() => {
                  try {
                    return (
                      value
                        .replace(/```[\s\S]*?```/g, (m) =>
                          m.replace(/\n/g, "\n ")
                        )
                        //.replace(/(?<=\n\n)(?![*-])\n/g, "&nbsp;\n ")
                        .replace(
                          /(\n)(\n)(?![*-])/g,
                          function (
                            match: any,
                            p1: any,
                            p2: any,
                            offset: any,
                            string: any
                          ) {
                            // p1 is the first captured group (two newlines)
                            // p2 is the second captured group (one newline)
                            // Check if the next character is not '-' or '*'
                            if (
                              string[offset + match.length] !== "-" &&
                              string[offset + match.length] !== "*"
                            ) {
                              // Replace only the second newline character
                              return p1 + "&nbsp;\n &nbsp;\n &nbsp;\n ";
                            } else {
                              // If the condition is not met, return the entire match (no replacement)
                              return match;
                            }
                          }
                        )
                        .replace(/(\n)/gm, "  \n")
                    );
                  } catch {}
                  return value;
                })()
              : ""}
          </ReactMarkdown>
        </Box>
      </Box>
    </div>
  ) : (
    <Box
      className="markdownWrapper"
      // sx={{
      //   ".focusedNeed:focus &": {
      //     margin: "-1px",
      //   },
      // }}
    >
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        //rehypePlugins={[rehypeRaw as any]}
        linkTarget="_blank"
      >
        {value
          ? (() => {
              try {
                return (
                  value
                    .replace(/```[\s\S]*?```/g, (m) => m.replace(/\n/g, "\n "))
                    //.replace(/(?<=\n\n)(?![*-])\n/g, "&nbsp;\n ")
                    .replace(
                      /(\n)(\n)(?![*-])/g,
                      function (
                        match: any,
                        p1: any,
                        p2: any,
                        offset: any,
                        string: any
                      ) {
                        // p1 is the first captured group (two newlines)
                        // p2 is the second captured group (one newline)
                        // Check if the next character is not '-' or '*'
                        if (
                          string[offset + match.length] !== "-" &&
                          string[offset + match.length] !== "*"
                        ) {
                          // Replace only the second newline character
                          return p1 + "&nbsp;\n &nbsp;\n &nbsp;\n ";
                        } else {
                          // If the condition is not met, return the entire match (no replacement)
                          return match;
                        }
                      }
                    )
                    .replace(/(\n)/gm, "  \n")
                );
              } catch {}
              return value;
            })()
          : ""}
      </ReactMarkdown>
    </Box>
    // <div className="focusedNeed markdownDetails" tabIndex={8}>
    //   <Box
    //     key={id}
    //     className="markdownBox"
    //     sx={{
    //       width: "100%",
    //       border: "0px solid rgba(158, 158, 158, 0.32)",
    //       p: 0,
    //       position: "relative",
    //       borderRadius: "6px",
    //       ".focusedNeed:focus &": {
    //         // border: "2px solid #1976d2",
    //       },
    //       "&:hover": {
    //         // border: "1px solid rgba(0, 0, 0, 0.87)",
    //       },
    //     }}
    //   >
    //     <Typography
    //       variant="body2"
    //       component={"label"}
    //       sx={{
    //         textTransform: "capitalize",
    //         fontSize: 12,
    //         position: "absolute",
    //         top: "-10px",
    //         left: "10px",
    //         background: theme.palette.palette_style.background.default,
    //         color:
    //           theme.palette.mode === "light"
    //             ? "rgba(0, 0, 0, 0.6)"
    //             : "rgba(255, 255, 255, 0.7)",
    //         zIndex: 2,
    //         px: 0.5,
    //         ".focusedNeed:focus &": {
    //           // color: "#1976d2",
    //           // top: "-11px",
    //           // left: "9px",
    //         },
    //       }}
    //     >
    //       {name}
    //     </Typography>
    //     <Box
    //       className="markdownWrapper"
    //       // sx={{
    //       //   ".focusedNeed:focus &": {
    //       //     margin: "-1px",
    //       //   },
    //       // }}
    //     >
    //       <ReactMarkdown
    //         remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
    //         //rehypePlugins={[rehypeRaw as any]}
    //         linkTarget="_blank"
    //       >
    //         {value
    //           ? (() => {
    //               try {
    //                 return (
    //                   value
    //                     .replace(/```[\s\S]*?```/g, (m) =>
    //                       m.replace(/\n/g, "\n ")
    //                     )
    //                     //.replace(/(?<=\n\n)(?![*-])\n/g, "&nbsp;\n ")
    //                     .replace(
    //                       /(\n)(\n)(?![*-])/g,
    //                       function (
    //                         match: any,
    //                         p1: any,
    //                         p2: any,
    //                         offset: any,
    //                         string: any
    //                       ) {
    //                         // p1 is the first captured group (two newlines)
    //                         // p2 is the second captured group (one newline)
    //                         // Check if the next character is not '-' or '*'
    //                         if (
    //                           string[offset + match.length] !== "-" &&
    //                           string[offset + match.length] !== "*"
    //                         ) {
    //                           // Replace only the second newline character
    //                           return p1 + "&nbsp;\n &nbsp;\n &nbsp;\n ";
    //                         } else {
    //                           // If the condition is not met, return the entire match (no replacement)
    //                           return match;
    //                         }
    //                       }
    //                     )
    //                     .replace(/(\n)/gm, "  \n")
    //                 );
    //               } catch {}
    //               return value;
    //             })()
    //           : ""}
    //       </ReactMarkdown>
    //     </Box>
    //   </Box>
    // </div>
  );
};
export default MarkdownEditor;
