import { useState, useEffect } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Drawer,
  Box,
  Typography,
  TextField,
  Link,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "src/hooks/useResponsive";
import { connect } from "react-redux";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { supportService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import ChatForm from "./chat/ChatForm";
import { ChatType } from "src/enums/ChatType";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import SupportHeader from "src/components/header/SupportHeader";

interface RowFormProps {
  open: boolean;
  translations: TranslationText[];
  onClose: () => void;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
}

const SupportPanel = ({
  open,
  translations,
  onClose,
  setFlashMessage,
}: RowFormProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const tabs = [
    {
      title: t("Feedback"),
      icon: <ThumbUpAltOutlinedIcon sx={{ mr: 1 }} />,
      action: "feedback",
    },
    {
      title: t("Support"),
      icon: <ConfirmationNumberOutlinedIcon sx={{ mr: 1 }} />,
      action: "support",
    },
  ];
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
  const learnFroms = [
    {
      label: t("Google"),
      value: "google",
    },
    {
      label: t("Bing"),
      value: "bing",
    },
    {
      label: t("Already a member"),
      value: "already_member",
    },
    {
      label: t("Colleague"),
      value: "colleague",
    },
    {
      label: t("Friend"),
      value: "friend",
    },
    {
      label: t("Other"),
      value: "other",
    },
  ];
  const whatFors = [
    {
      label: t("Work"),
      value: "work",
    },
    {
      label: t("Personal"),
      value: "personal",
    },
  ];
  const theme = useTheme();
  const isDesktop = useResponsive("up", "lg");
  const [windowHeight, setWindowHeight] = useState(0);
  const [tab, setTab] = useState<string>(tabs[0].action);
  const [feedback, setFeedback] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [learnFrom, setLearnFrom] = useState("");
  const [otherLearnFrom, setOtherLearnFrom] = useState("");
  const [whatFor, setWhatFor] = useState("");
  const [job, setJob] = useState("");
  const [company, setCompany] = useState("");
  const [improve, setImprove] = useState("");
  const [reference, setReference] = useState("");
  const [mode, setMode] = useState<string>();
  const [onlineStatus, setOnlineStatus] = useState(false);

  const SUPPORT_ONLINE_REAL_TIME_CYCLE = parseInt(
    process.env.NEXT_PUBLIC_FLEXLIST_SUPPORT_ONLINE_REAL_TIME_CYCLE || "2"
  );

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    clearForm();
  }, [tab]);

  useEffect(() => {
    setTab(tabs[0].action);
    clearForm();
    setMode("support");
  }, [open]);

  useEffect(() => {
    if (tab === "support") {
      checkSupportOnline();

      const interval = setInterval(async () => {
        checkSupportOnline();
      }, SUPPORT_ONLINE_REAL_TIME_CYCLE * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [tab]);

  const handleCloseModal = () => {
    onClose();
  };

  const handleAction = (action: string) => {
    setTab(action);
  };

  const handleSubmitSupport = async () => {
    if (tab === "support") {
      if (subject === "") {
        setFlashMessage({ message: t("Subject Required"), type: "error" });
        return;
      }
      if (category === "") {
        setFlashMessage({ message: t("Category Required"), type: "error" });
        return;
      }
      if (body === "") {
        setFlashMessage({ message: t("Body Required"), type: "error" });
        return;
      }

      const createSupportTicketResponse =
        await supportService.createSupportTicket(subject, category, body);

      if (isSucc(createSupportTicketResponse)) {
        setFlashMessage({
          message: createSupportTicketResponse.message,
          type: "success",
        });
        setSecret(createSupportTicketResponse.data.secret);
        setMode("chat");
        clearForm();
      } else {
        setFlashMessage({ message: t("Something Wrong"), type: "error" });
        return;
      }
    } else if (tab === "feedback") {
      if (feedback === "") {
        setFlashMessage({ message: t("Feedback Required"), type: "error" });
        return;
      }

      let body = "";

      if (learnFrom)
        body +=
          `How did you learn of Flexlists.com?: ${
            learnFrom === "other" ? otherLearnFrom : learnFrom
          }` + "\n";
      if (whatFor)
        body += `what do you use Flexlists.com for?: ${whatFor}` + "\n";
      if (job) body += `What is your job?: ${job}` + "\n";
      if (company) body += `Which company do you work for?: ${company}` + "\n";
      if (improve)
        body += `What would you like to see improved?: ${improve}` + "\n";
      if (reference)
        body += `Can we use you as a reference?: ${reference}` + "\n";

      body += `Feedback: ${feedback}`;

      const createFeedbackTicketResponse =
        await supportService.createSupportTicket("Feedback", "Other", body);

      if (isSucc(createFeedbackTicketResponse)) {
        setFlashMessage({
          message: createFeedbackTicketResponse.message,
          type: "success",
        });
        clearForm();
      } else {
        setFlashMessage({ message: t("Something Wrong"), type: "error" });
        return;
      }
    }
  };

  const clearForm = () => {
    setSubject("");
    setCategory("");
    setBody("");
    setFeedback("");
    setLearnFrom("");
    setOtherLearnFrom("");
    setWhatFor("");
    setJob("");
    setCompany("");
    setImprove("");
    setReference("");
  };

  const checkSupportOnline = async () => {
    const response = await supportService.getOnline();

    if (isSucc(response)) {
      setOnlineStatus(response.data);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleCloseModal}
      PaperProps={{
        sx: {
          width: { xs: "100%", lg: "500px" },
          border: "none",
          // height: `${windowHeight}px`,
          backgroundColor: theme.palette.palette_style.background.default,
        },
      }}
    >
      {mode === "support" && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            px: { xs: 1, md: 3 },
            // marginTop: 4,
            py: 2,
            borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
          }}
        >
          {tabs.map((el: any) => (
            <Box
              key={el.title}
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                handleAction(el.action);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="span"
                  className="svg-color"
                  sx={{
                    width: 24,
                    height: 24,
                    display: "grid",
                    placeContent: "center",
                    color:
                      el.action === tab
                        ? theme.palette.palette_style.text.selected
                        : theme.palette.palette_style.text.primary,
                    mr: { xs: 0.2, md: 0.5 },
                  }}
                >
                  {el.icon}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color:
                      el.action === tab
                        ? theme.palette.palette_style.text.selected
                        : theme.palette.palette_style.text.primary,
                  }}
                >
                  {el.title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      <DialogContent sx={{ p: mode === "chat" ? 0 : "" }}>
        {mode === "support" && tab === "feedback" && (
          <Box sx={{ textAlign: "justify" }}>
            <Typography
              variant="caption"
              color={theme.palette.palette_style.text.primary}
              sx={{ fontSize: 14 }}
            >
              {t("Feedback Header")}
            </Typography>
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel shrink={true} id="select_learn_from">
                {t("How did you learn of Flexlists.com?")}
              </InputLabel>
              <Select
                labelId="select_learn_from"
                label={t("How did you learn of Flexlists.com?")}
                value={learnFrom}
                onChange={(event: SelectChangeEvent) => {
                  setLearnFrom(event.target.value as string);
                  setOtherLearnFrom("");
                }}
                fullWidth
                size="small"
                notched={true}
              >
                {learnFroms.map((item: any) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {learnFrom === "other" && (
              <TextField
                sx={{ mt: 2 }}
                fullWidth
                label={t("Other")}
                InputLabelProps={{ shrink: true }}
                name="other_learn_from"
                size="small"
                type={"text"}
                onChange={(e) => {
                  setOtherLearnFrom(e.target.value);
                }}
                value={otherLearnFrom}
              />
            )}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel shrink={true} id="select_what_for">
                {t("What do you use Flexlists.com for?")}
              </InputLabel>
              <Select
                labelId="select_what_for"
                label={t("What do you use Flexlists.com for?")}
                value={whatFor}
                onChange={(event: SelectChangeEvent) => {
                  setWhatFor(event.target.value as string);
                }}
                fullWidth
                size="small"
                notched={true}
              >
                {whatFors.map((item: any) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label={t("What is your job?")}
              InputLabelProps={{ shrink: true }}
              name="job"
              size="small"
              type={"text"}
              onChange={(e) => {
                setJob(e.target.value);
              }}
              value={job}
            />
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label={t("Which company do you work for?")}
              InputLabelProps={{ shrink: true }}
              name="company"
              size="small"
              type={"text"}
              onChange={(e) => {
                setCompany(e.target.value);
              }}
              value={company}
            />
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label={t("What would you like to see improved?")}
              InputLabelProps={{ shrink: true }}
              name="improve"
              size="small"
              type={"text"}
              onChange={(e) => {
                setImprove(e.target.value);
              }}
              value={improve}
            />
            <FormControl sx={{ mt: 2 }}>
              <FormLabel
                id="select_reference"
                sx={{ color: theme.palette.palette_style.text.primary }}
              >
                {t("Can we use you as a reference?")}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="select_reference"
                name="reference"
                value={reference}
                onChange={(event) => {
                  setReference(event?.target.value);
                }}
                sx={{ color: theme.palette.palette_style.text.primary }}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label={t("Yes")}
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label={t("No")}
                />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label={t("Feedback")}
              InputLabelProps={{ shrink: true }}
              name="feedback"
              size="small"
              type={"text"}
              onChange={(e) => {
                setFeedback(e.target.value);
              }}
              value={feedback}
              multiline
              rows={4}
              required
              sx={{
                mt: 3,
              }}
            />
            <Typography
              variant="caption"
              color={theme.palette.palette_style.text.primary}
            >
              {t("Feedback Description")}
            </Typography>
          </Box>
        )}
        {mode === "support" && tab === "support" && (
          <>
            {!onlineStatus && (
              <>
                <SupportHeader
                  onlineStatus={onlineStatus}
                  label={t("Support Offline")}
                />
                <Box
                  sx={{
                    mt: 2,
                    mb: 3.5,
                    color: theme.palette.palette_style.text.selected,
                    textAlign: "justify",
                  }}
                >
                  {t("Support Offline Description")}
                </Box>
              </>
            )}
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
              label={t("Body")}
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
            <Box sx={{ textAlign: "right" }}>
              <Link
                variant="subtitle2"
                underline="hover"
                sx={{
                  cursor: "pointer",
                  color: theme.palette.palette_style.text.selected,
                }}
                href="/main/support"
              >
                {t("To Your Support Tickets")}
              </Link>
            </Box>
          </>
        )}
        {mode === "chat" && (
          <ChatForm
            chatType={ChatType.Support}
            id={secret}
            translations={translations}
            onlineStatus={onlineStatus}
            handleClose={handleCloseModal}
          />
        )}
      </DialogContent>

      {mode === "support" && (
        <DialogActions
          sx={{
            p: "1.25rem",
            borderTop: `1px solid ${theme.palette.palette_style.border.default}`,
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              width: "100%",
            }}
          >
            <Button onClick={handleCloseModal}>{t("Cancel")}</Button>
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
    </Drawer>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportPanel);
