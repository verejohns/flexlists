import {
  Modal,
  Typography,
  Box,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  TextField,
  InputAdornment,
  Divider,
  Button,
  Snackbar,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import NewReleaseIcon from "@mui/icons-material/NewReleases";
import { motion } from "framer-motion";
import { listViewService } from "flexlists-api";
import { isErr } from "src/models/ApiResponse";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useTheme } from "@mui/material/styles";
import CopyClipboard from "src/components/clipboard/CopyClipboard";
import useResponsive from "../../hooks/useResponsive";

type PublishListProps = {
  id: number;
  name: string;
  open: boolean;
  translations: TranslationText[];
  handleClose: () => void;
};

const scaleUp = {
  hidden: {
    x: "-50%",
    y: "-50%",
    scale: 0.5,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      type: "spring",
      damping: 30,
      stiffness: 700,
    },
  },
  close: {
    opacity: 0,
  },
};

const PublishList = ({
  id,
  name,
  open,
  translations,
  handleClose,
}: PublishListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [code, setCode] = useState("");
  const [copyOpen, setCopyOpen] = useState(false);
  const [selected, setSelected] = useState("iframe");
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const style = {
    position: "absolute" as "absolute",
    padding: 2,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "80%", md: "50%" },
    maxHeight: "80vh",
    backgroundColor: theme.palette.palette_style.background.default,
    border: "none",
    borderRadius: "8px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  const closeModal = () => {
    handleClose();
  };

  useEffect(() => {
    async function setStart() {
      if (!code && id) {
        const url = await getShareURLAsync("html");
        setCode(`<iframe src="${url}" width="100%" height="100%"></iframe>`);
      }
    }
    setStart();
  }, [code, id]);

  const getShareURLAsync = async (format: string) => {
    const url = await listViewService.getShareURL(id, format);
    if (isErr(url)) {
      return "";
    }
    return url.data!;
  };

  const handleCopyClose = () => {
    setCopyOpen(false);
  };

  const handleCopyOpen = (open: boolean) => {
    setCopyOpen(open);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={copyOpen}
        onClose={handleCopyClose}
        message="Copied to clipboard"
        autoHideDuration={1000}
      />
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component={motion.div}
          variants={scaleUp}
          initial="hidden"
          animate="visible"
          exit="close"
        >
          <Typography
            gutterBottom
            variant="h5"
            sx={{ my: 1, color: theme.palette.palette_style.text.primary }}
          >
            {t("Publish")}
          </Typography>
          <Typography
            gutterBottom
            variant="body2"
            sx={{ my: 1, color: theme.palette.palette_style.text.primary }}
          >
            {t("Publish Description")}
          </Typography>
          <Divider sx={{ my: 1 }}></Divider>
          <FormControl sx={{ my: 1 }}>
            <FormLabel
              id="demo-radio-buttons-group-label"
              sx={{ color: theme.palette.palette_style.text.primary }}
            >
              {t("Publish As")}
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="iframe"
              name="radio-buttons-group"
              sx={{ color: theme.palette.palette_style.text.primary }}
            >
              <FormControlLabel
                value="iframe"
                control={<Radio />}
                checked={selected === "iframe"}
                onChange={async (event: any, checked: boolean) => {
                  if (checked) {
                    const url = await getShareURLAsync("html");
                    setCode(
                      `<iframe src="${url}" width="100%" height="100%"></iframe>`
                    );
                    setSelected("iframe");
                  }
                }}
                label={<Typography variant="body2">IFrame</Typography>}
              />
              <FormControlLabel
                value="javascript"
                control={<Radio />}
                checked={selected === "javascript"}
                onChange={async (event: any, checked: boolean) => {
                  if (checked) {
                    const url = await getShareURLAsync("js");
                    setCode(`<script src="${url}"></script>`);
                    setSelected("javascript");
                  }
                }}
                label={
                  <Typography variant="body2">Static JavaScript</Typography>
                }
              />
              <FormControlLabel
                value="dynamic-javascript"
                control={<Radio />}
                checked={selected === "dynamic-javascript"}
                onChange={async (event: any, checked: boolean) => {
                  if (checked) {
                    const url = await getShareURLAsync("js");
                    const widgetURI =
                      "/api/export/widgets/flexlists-react-table-widget.js";
                    // url looks like;  http://localhost:3003/api/export/xxx.js
                    // get the http://domain from the url;
                    const domain = url.split("/").slice(0, 3).join("/");
                    // now get the xxx (key) from the url ;
                    const key = url.split("/").slice(-1)[0].split(".")[0];
                    setCode(
                      `
                      <html lang="ja">
                        <head>
                          <meta charset="UTF-8" />
                          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                          <title>Flexlists.com, showing list ${name}</title>
                          <script src="${domain}${widgetURI}"></script>
                        </head>
                        <body>
                          <h3>${name}</h3>
                          <script>
                            const host = '${domain}'
                            const apiKey = '${key}'
                            const widget = new EmbeddedWidget(host, apiKey, 'test');
                            widget.mount();
                          </script>
                        </body>
                      </html>
                      `.trim()
                    );
                    setSelected("dynamic-javascript");
                  }
                }}
                label={
                  <Typography variant="body2">
                    Dynamic JavaScript <NewReleaseIcon />
                  </Typography>
                }
              />
              <FormControlLabel
                value="json"
                control={<Radio />}
                checked={selected === "json"}
                onChange={async (event: any, checked: boolean) => {
                  if (checked) {
                    const url = await getShareURLAsync("json");
                    setCode(`${url}`);
                    setSelected("json");
                  }
                }}
                label={<Typography variant="body2">JSON</Typography>}
              />
              {/* <FormControlLabel
              value="other"
              control={<Radio />}
              label={<Typography variant="body2">Other</Typography>}
            /> */}
            </RadioGroup>
          </FormControl>
          <TextField
            size="small"
            value={code}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isDesktop ? (
                    <CopyClipboard
                      open={copyOpen}
                      data={code}
                      setOpen={handleCopyOpen}
                    />
                  ) : (
                    <CopyClipboard data={code} />
                  )}
                </InputAdornment>
              ),
            }}
            sx={{ my: 1 }}
          />
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ my: 2, width: "max-content" }}
          >
            {t("Close")}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PublishList;
