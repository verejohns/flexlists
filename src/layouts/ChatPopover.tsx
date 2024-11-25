import { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Popover,
  TextField,
  FormControl,
  InputLabel,
  Select,
  DialogActions,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { useTheme } from "@mui/material/styles";
import AnonymousChatForm from "src/sections/@list/chat/AnonymousChatForm";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { supportService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import {
  getAnonymousTicketSecret,
  setAnonymousTicketSecret,
} from "src/utils/cookieUtils";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import SupportHeader from "src/components/header/SupportHeader";

type ChatPopoverProps = {
  translations: TranslationText[];
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
};

export const ChatPopover = ({
  translations,
  setFlashMessage,
}: ChatPopoverProps) => {
  const t = (key: string): string => {
    if (!translations) {
      return key;
    }
    return getTranslation(key, translations);
  };
  const theme = useTheme();

  const [open, setOpen] = useState(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [mode, setMode] = useState<string>("support");
  const [onlineStatus, setOnlineStatus] = useState(false);

  const SUPPORT_ONLINE_REAL_TIME_CYCLE = parseInt(
    process.env.NEXT_PUBLIC_FLEXLIST_SUPPORT_ONLINE_REAL_TIME_CYCLE || "2"
  );

  const categories = [
    {
      label: t("Billing"),
      value: "Billing",
    },
    {
      label: t("Other"),
      value: "Other",
    },
    {
      label: t("General"),
      value: "General",
    },
    {
      label: t("Technical"),
      value: "Technical",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      let oldSecret = getAnonymousTicketSecret();
      if (oldSecret) {
        const supportResponse = await supportService.getSupportTicket(
          oldSecret
        );
        if (isSucc(supportResponse) && supportResponse.data) {
          if (supportResponse.data.status === "Resolved") {
            oldSecret = "";
            setAnonymousTicketSecret("", {}, {});
          }
        }
      }
      if (oldSecret) {
        setMode("chat");
        setSecret(oldSecret);
      } else setMode("support");

      clearForm();
    }

    if (open) {
      fetchData();
      checkSupportOnline();

      const interval = setInterval(async () => {
        checkSupportOnline();
      }, SUPPORT_ONLINE_REAL_TIME_CYCLE * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [open]);

  const handleClose = async () => {
    setOpen(null);

    const supportResponse = await supportService.getSupportTicket(secret);

    if (isSucc(supportResponse) && supportResponse.data) {
      if (supportResponse.data.status === "Resolved")
        setAnonymousTicketSecret("", {}, {});
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setCategory("");
    setBody("");
  };

  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };

  const handleSubmitSupport = async () => {
    let _errors: { [key: string]: string | boolean } = {};

    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };
    if (name === "") {
      setFlashMessage({ message: t("Name Required"), type: "error" });
      return;
    }
    let newEmail = await frontendValidate(
      ModelValidatorEnum.GenericTypes,
      FieldValidatorEnum.email,
      email,
      _errors,
      _setErrors,
      true
    );
    if (isFrontendError(FieldValidatorEnum.email, _errors, undefined, setError))
      return;
    // if (email === '') {
    //   setFlashMessage({ message: t("Email Required"), type: "error" });
    //   return;
    // }
    if (subject === "") {
      setFlashMessage({ message: t("Subject Required"), type: "error" });
      return;
    }
    if (category === "") {
      setFlashMessage({ message: t("Category Required"), type: "error" });
      return;
    }
    if (body === "") {
      setFlashMessage({ message: t("Message Required"), type: "error" });
      return;
    }

    const createSupportTicketResponse =
      await supportService.createSupportTicketAnon(
        name,
        newEmail,
        subject,
        category,
        body
      );

    if (isSucc(createSupportTicketResponse)) {
      setFlashMessage({
        message: createSupportTicketResponse.message,
        type: "success",
      });
      setSecret(createSupportTicketResponse.data.secret);
      setAnonymousTicketSecret(createSupportTicketResponse.data.secret, {}, {});
      setMode("chat");
      clearForm();
    } else {
      setFlashMessage({ message: t("Something Wrong"), type: "error" });
      return;
    }
  };

  const checkSupportOnline = async () => {
    const response = await supportService.getOnline();

    if (isSucc(response)) {
      setOnlineStatus(response.data);
    }
  };

  return (
    <Box sx={{ position: "fixed", right: "40px", bottom: "50px" }}>
      <Box
        sx={{
          backgroundColor: theme.palette.palette_style.background.selected,
          borderRadius: "50%",
          padding: "16px 14px 7px 14px",
          cursor: "pointer",
        }}
        onClick={(event: any) => {
          setOpen(event.currentTarget);
        }}
      >
        <Box
          component="span"
          className="svg-color"
          sx={{
            width: 24,
            height: 24,
            display: "inline-block",
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/header/chat.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/header/chat.svg) no-repeat center / contain`,
          }}
        />
      </Box>
      <Popover
        id="chat_popover"
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 400,
            height: "70vh",
            backgroundColor: theme.palette.palette_style.background.paper,
          },
        }}
      >
        <SupportHeader
          onlineStatus={onlineStatus}
          label={t("support (Staff)")}
          handleClose={handleClose}
        />
        <DialogContent sx={{ p: mode === "chat" ? 0 : "" }}>
          {mode === "support" && (
            <Box>
              <Typography
                variant="body2"
                component={"label"}
                sx={{
                  mb: 4,
                  fontSize: 15,
                  color: theme.palette.palette_style.text.selected,
                }}
              >
                {t("To contact support, please fill the fields below.")}
              </Typography>
              <TextField
                fullWidth
                style={{ marginBottom: 25, marginTop: 32 }}
                label={t("Name")}
                InputLabelProps={{ shrink: true }}
                name="name"
                size="small"
                type={"text"}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                required
              />
              <TextField
                fullWidth
                style={{ marginBottom: 25 }}
                label={t("Email")}
                InputLabelProps={{ shrink: true }}
                name="email"
                size="small"
                type={"email"}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                required
              />
              <TextField
                fullWidth
                style={{ marginBottom: 25 }}
                label={t("Subject")}
                InputLabelProps={{ shrink: true }}
                name="subject"
                size="small"
                type={"text"}
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                value={subject}
                required
              />
              <FormControl fullWidth sx={{ marginBottom: 3 }} required>
                <InputLabel shrink={true} id="select_category">
                  {t("Category")}
                </InputLabel>
                <Select
                  fullWidth
                  labelId="select_category"
                  label={t("Category")}
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as string);
                  }}
                  notched={true}
                  size="small"
                >
                  {categories.map((category: any) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                sx={{ mb: 2 }}
                label={t("Message")}
                InputLabelProps={{ shrink: true }}
                name="body"
                size="small"
                type={"text"}
                onChange={(e) => {
                  setBody(e.target.value);
                }}
                value={body}
                multiline
                rows={4}
                required
              />
            </Box>
          )}
          {mode === "chat" && (
            <AnonymousChatForm
              id={secret}
              translations={translations}
              onlineStatus={onlineStatus}
            />
          )}
        </DialogContent>
        {mode === "support" && (
          <DialogActions
            sx={{
              p: "1.25rem",
              borderTop: `1px solid ${theme.palette.palette_style.border.default}`,
              justifyContent: "space-between",
              position: "absolute",
              width: "100%",
              bottom: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
              }}
            >
              <Button onClick={handleClose}>{t("Cancel")}</Button>
              <Button
                sx={{ marginLeft: 3 }}
                color="primary"
                onClick={handleSubmitSupport}
                variant="contained"
                type="submit"
              >
                {t("Submit")}
              </Button>
            </Box>
          </DialogActions>
        )}
      </Popover>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  languages: state.admin.languages,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopover);
