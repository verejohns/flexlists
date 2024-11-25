import React, { useState, useEffect } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { supportService } from "flexlists-api";
import Head from "next/head";
import { SupportTicket, TicketMessage } from "src/models/Support";
import { getLocalDateTimeFromString } from "src/utils/convertUtils";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { useTheme } from "@mui/material/styles";
import { areListsEqual } from "src/utils/arraryHelper";
import sanitizeHtml from "sanitize-html";

type SupportDetailProps = {
  translations: TranslationText[];
  message: any;
  setFlashMessage: (message: any) => void;
};
function convertURLsToLinks(text: string) {
  text = sanitizeHtml(text, { allowedTags: [""] });

  // Regular expression to match URLs
  const urlRegex = /http[s]?:\/\/.*?(?=\s|$)/g;

  return text
    .replace(urlRegex, (url: string) => {
      // Remove trailing period if it exists
      let app = "";
      if (url.endsWith(".")) {
        url = url.slice(0, -1);
        app = ".";
      }

      // Return the URL replaced with a hyperlink
      return `<a href="${url}" target="_blank">${url}</a>` + app;
    })
    .replace(/\n/g, "<br />");
}
const SupportDetail = ({
  translations,
  message,
  setFlashMessage,
}: SupportDetailProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const statuses = [
    {
      label: t("Open"),
      value: "Open",
    },
    {
      label: t("Resolved"),
      value: "Resolved",
    },
  ];
  const router = useRouter();
  const [status, setStatus] = useState(statuses[0].value);
  const [newMessage, setNewMessage] = useState("");
  const [ticket, setTicket] = useState<SupportTicket>();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const theme = useTheme();
  const CHAT_REAL_TIME_CYCLE = parseInt(
    process.env.NEXT_PUBLIC_FLEXLIST_CHAT_REAL_TIME_CYCLE || "2"
  );
  const [refreshMessages, setRefreshMessages] = useState<TicketMessage[]>([]);
  useEffect(() => {
    if (router.isReady && router.query.secret) {
      fetchSupportTicket(router.query.secret as string);
    }
  }, [router.isReady]);
  useEffect(() => {
    const interval = setInterval(async () => {
      fetchRefreshMessages();
    }, CHAT_REAL_TIME_CYCLE * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (
      !areListsEqual(
        refreshMessages.map((m) => m.id),
        messages.map((m: any) => m.id)
      )
    ) {
      setMessages(refreshMessages);
    }
  }, [refreshMessages]);
  const fetchRefreshMessages = async () => {
    if (router.isReady && router.query.secret) {
      const response = await supportService.getSupportTicket(
        router.query.secret as string,
        true
      );
      if (isSucc(response) && response.data) {
        setRefreshMessages(response.data.supportTicketThreads ?? []);
      }
    }
  };
  const fetchSupportTicket = async (secret: string) => {
    const response = await supportService.getSupportTicket(secret, true);

    if (isSucc(response) && response.data) {
      setTicket(response.data);
      setStatus(response.data.status);
      setMessages(response.data.supportTicketThreads);
    } else {
      setFlashMessage({ message: t("Something Wrong"), type: "error" });
    }
  };

  const backToTickets = () => {
    router.push(`/main/support`);
  };

  const handleSubmit = async () => {
    // if (newMessage === '') {
    //   setFlashMessage({ message: t("Message Required"), type: "error" });
    //   return;
    // }

    const createTicketMessageResponse =
      await supportService.createTicketMessage(
        router.query.secret as string,
        newMessage,
        status
      );

    if (isSucc(createTicketMessageResponse)) {
      setFlashMessage({
        message: createTicketMessageResponse.message,
        type: "success",
      });
      clearTicketMessage();
      fetchSupportTicket(router.query.secret as string);
    } else {
      setFlashMessage({ message: t("Something Wrong"), type: "error" });
      return;
    }
  };
  const handleSubmitAnClose = async () => {
    const createTicketMessageResponse =
      await supportService.createTicketMessage(
        router.query.secret as string,
        newMessage,
        "Resolved"
      );

    if (isSucc(createTicketMessageResponse)) {
      setFlashMessage({
        message: createTicketMessageResponse.message,
        type: "success",
      });
      clearTicketMessage();
      fetchSupportTicket(router.query.secret as string);
    } else {
      setFlashMessage({ message: t("Something Wrong"), type: "error" });
      return;
    }
  };
  const clearTicketMessage = () => {
    setNewMessage("");
    setStatus(statuses[0].value);
  };

  return (
    <MainLayout removeFooter translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>

      <Box sx={{ p: { xs: 1, md: 3 } }}>
        {ticket && (
          <Box sx={{ paddingTop: 1 }}>
            <Box
              sx={{
                display: { md: "flex" },
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* <Box
                component="span"
                className="svg-color"
                sx={{
                  width: 24,
                  height: 24,
                  display: 'inline-block',
                  backgroundImage: 'url(/assets/icons/header/light.svg)',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
              /> */}
                <ConfirmationNumberOutlinedIcon
                  sx={{ color: theme.palette.palette_style.text.selected }}
                />
                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                  {t("Your Ticket")} : <b>{ticket.subject}</b>
                </Typography>
              </Box>
              <Box
                sx={{
                  marginTop: { xs: 1, md: "inherit" },
                  textAlign: { xs: "right", md: "inherit" },
                }}
              >
                <Button
                  color="primary"
                  onClick={backToTickets}
                  variant="outlined"
                  type="submit"
                >
                  {t("Back to Tickets")}!
                </Button>
              </Box>
            </Box>
            <Box>
              <Box
                sx={{ display: "flex", marginTop: 3, alignItems: "flex-start" }}
              >
                <Box sx={{ width: { xs: "100%", md: "40%" } }}>
                  {t("Ticket")} ({t("Category")})
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "60%" },
                    marginTop: { xs: 2, md: 0 },
                    border: `solid 1px ${theme.palette.palette_style.border.default}`,
                    borderRadius: "6px",
                  }}
                >
                  <Typography sx={{ p: 2 }} variant="subtitle2">
                    {ticket.category}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginTop: 3,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    width: "25%",
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                  }}
                >
                  {t("Status")}
                </Box>
                <FormControl
                  fullWidth
                  sx={{ width: { xs: "100%", md: "60%" } }}
                >
                  <InputLabel id="select_status">{t("Status")}</InputLabel>
                  <Select
                    labelId="select_status"
                    label={t("Status")}
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as string);
                    }}
                  >
                    {statuses.map((status: any) => (
                      <MenuItem value={status.value} key={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: { md: "flex" },
                  marginTop: 3,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ width: { xs: "100%", md: "25%" } }}>
                  {t("Description")}{" "}
                  {/*<b>{getLocalDateTimeFromString(ticket.createdAt)}</b>*/}:
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "60%" },
                    marginTop: { xs: 2, md: 0 },
                    border: `solid 1px ${theme.palette.palette_style.border.default}`,
                    borderRadius: "6px",
                    p: 2,
                  }}
                >
                  {ticket.description}
                </Box>
              </Box>
              <Box
                sx={{
                  display: { md: "flex" },
                  marginTop: 3,
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ width: { xs: "100%", md: "25%" } }}>Created at:</Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "60%" },
                    marginTop: { xs: 2, md: 0 },
                    border: `solid 1px ${theme.palette.palette_style.border.default}`,
                    borderRadius: "6px",
                    p: 2,
                  }}
                >
                  <b>{getLocalDateTimeFromString(ticket.createdAt)}</b>
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: 3,
                  borderBottom: `solid 1px ${theme.palette.palette_style.border.default}`,
                  pb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", md: "25%" },
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                    }}
                  >
                    {t("New Message")}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: "100%", md: "60%" },
                      marginTop: { xs: 1, md: "inherit" },
                    }}
                  >
                    <TextField
                      style={{ width: "100%" }}
                      label={t("New Message")}
                      InputLabelProps={{ shrink: true }}
                      name="newMessage"
                      size="small"
                      type={"text"}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                      }}
                      value={newMessage}
                      multiline
                      rows={5}
                      required
                    />
                  </Box>
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}
                >
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    variant="contained"
                    type="submit"
                  >
                    {t("Submit")}
                  </Button>
                  <Button
                    sx={{ marginLeft: 3 }}
                    color="primary"
                    onClick={handleSubmitAnClose}
                    disabled={status === "Resolved"}
                    variant="contained"
                    type="submit"
                  >
                    {t("Submit & Close")}
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 3, maxHeight: "360px", overflowY: "auto" }}>
              {/* <Typography variant="subtitle1">Messages:</Typography> */}
              {messages.map((thread: TicketMessage) => (
                <Box
                  sx={{
                    display: { md: "flex" },
                    marginTop: 1,
                    justifyContent: "space-between",
                  }}
                  key={thread.id}
                >
                  <Box sx={{ width: { xs: "100%", md: "25%" } }}>
                    <b>{thread.author}</b> on{" "}
                    <b>{getLocalDateTimeFromString(thread.createdAt)}</b>:
                  </Box>
                  <Box
                    sx={{
                      width: { xs: "100%", md: "60%" },
                      marginTop: { xs: 0.3, md: 0 },
                      border: `solid 1px ${theme.palette.palette_style.border.default}`,
                      borderRadius: "6px",
                      p: 2,
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: convertURLsToLinks(thread.message),
                      }}
                    ></div>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("support", context);
};

const mapStateToProps = (state: any) => ({
  message: state.view.message,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(SupportDetail);
