import { useState, useEffect } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { View, ViewChat } from "src/models/SharedModels";
import { useRouter } from "next/router";
import { isSucc } from "src/models/ApiResponse";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserProfile } from "src/models/UserProfile";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { supportService } from "flexlists-api";
import { SupportTicket } from "src/models/Support";
import { areListsEqual } from "src/utils/arraryHelper";
import Avatar from "src/components/avatar/Avatar";

type AnonymousChatFormProps = {
  id: number | string;
  userProfile: UserProfile;
  translations: TranslationText[];
  onlineStatus: boolean;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const AnonymousChatForm = ({
  userProfile,
  id,
  translations,
  onlineStatus,
  setFlashMessage,
}: AnonymousChatFormProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();
  const [messages, setMessages] = useState<ViewChat[]>([]);
  const [message, setMessage] = useState("");
  const [windowHeight, setWindowHeight] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(100000000);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [ticket, setTicket] = useState<SupportTicket>();
  const [refreshMessages, setRefreshMessages] = useState<ViewChat[]>([]);

  const CHAT_REAL_TIME_CYCLE = parseInt(
    process.env.NEXT_PUBLIC_FLEXLIST_CHAT_REAL_TIME_CYCLE || "2"
  );

  const SUPPORT_ONLINE_MESSAGE = t("Support Online Message");
  const SUPPORT_OFFLINE_MESSAGE = t("Support Offline Message");
  const teamMessage = {
    id: 0,
    message: onlineStatus ? SUPPORT_ONLINE_MESSAGE : SUPPORT_OFFLINE_MESSAGE,
    author: "support (Staff)",
    ownerId: 0,
    createdAt: new Date(),
  };

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  useEffect(() => {
    const interval = setInterval(async () => {
      fetchData(true);
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

  useEffect(() => {
    const element = document.getElementsByClassName(
      "infinite-scroll-component"
    )[0];
    element.scrollTop = element.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages[0] = teamMessage;

      return newMessages;
    });
  }, [onlineStatus]);

  const fetchData = async (isRefresh: boolean = false) => {
    const supportResponse = await supportService.getSupportTicket(id as string);

    if (isSucc(supportResponse) && supportResponse.data) {
      if (!isRefresh) {
        setTicket(supportResponse.data);
      }

      setRefreshMessages(
        [teamMessage].concat(supportResponse.data.supportTicketThreads ?? [])
      );
    } else {
      if (!isRefresh) {
        setFlashMessage({ message: supportResponse.message, type: "error" });
      }
    }
  };

  const handleMessage = async () => {
    if (!message) return;

    const createTicketMessageResponse =
      await supportService.createTicketMessage(id as string, message, "Open");

    if (isSucc(createTicketMessageResponse)) {
      const { id, message, ownerId, author, createdAt } =
        createTicketMessageResponse.data;
      const newMessage = { id, message, author, ownerId, createdAt };

      setMessages([...messages, newMessage]);
    } else {
      setFlashMessage({ message: "Something went wrong!", type: "error" });
      return;
    }

    setMessage("");
  };

  const handleMessageOver = (id: number, value: boolean) => {
    setMessages(
      messages.map((message: any) => {
        if (message.id === id) message.over = value;
        return message;
      })
    );
  };

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      await handleMessage();
    }
  };

  const getDifference = (time?: Date) => {
    const now = dayjs();
    const difference = now.diff(time, "second");
    const min = Math.floor(difference / 60);
    const hour = Math.floor(min / 60);
    const date = Math.floor(hour / 24);

    return difference < 60
      ? "just now"
      : date
      ? `${date} day${date > 1 ? "s" : ""} ago`
      : hour
      ? `${hour} hour${hour > 1 ? "s" : ""} ago`
      : `${min} min${min > 1 ? "s" : ""} ago`;
  };

  const isOwner = (userId: number): boolean => {
    return userId === ticket?.ownerId;
  };

  return (
    <Box sx={{}}>
      <Box sx={{ display: "flex", alignItems: "center", pl: 2, pt: 2 }}>
        <Typography variant="h6">
          {t("Your Ticket")}: <b>{ticket?.subject}</b>
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: "5px",
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>{t("Loading")}</h4>}
          height={"calc(70vh - 178px)"}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b></b>
            </p>
          }
        >
          {messages.map((message: ViewChat, index) => (
            <Box
              key={`${index}-${message.id}-message`}
              sx={{
                display: "flex",
                justifyContent: isOwner(message.ownerId) ? "right" : "left",
                p: 2,
                "&:hover": { backgroundColor: "#EEF7FF" },
                position: "relative",
              }}
              onMouseOver={() => {
                handleMessageOver(message.id, true);
              }}
              onMouseOut={() => {
                handleMessageOver(message.id, false);
              }}
            >
              <Box sx={{ width: "82%" }}>
                {!isOwner(message.ownerId) && (
                  <Box sx={{ display: "flex" }}>
                    <Box
                      sx={{
                        marginRight: 1,
                      }}
                    >
                      <Avatar
                        label={
                          message.ownerInfo
                            ? `${message.ownerInfo.firstName.charAt(
                                0
                              )}${message.ownerInfo.lastName.charAt(0)}`
                            : `${message.author?.charAt(0)}`
                        }
                        avatarUrl={
                          message.ownerInfo ? message.ownerInfo.avatarUrl : ""
                        }
                        color=""
                        size={24}
                        toolTipLabel={
                          message.ownerInfo
                            ? message.ownerInfo.userName
                            : message.author || ""
                        }
                      />
                    </Box>
                    <Box>{`${message.author}`}</Box>
                  </Box>
                )}
                <Box
                  sx={{
                    marginTop: 1,
                    borderRadius: "10px",
                    backgroundColor: isOwner(message.ownerId)
                      ? "#54A6FB"
                      : "#003249",
                    color: "white",
                    p: 1.2,
                  }}
                >
                  {message.message}
                </Box>
                <Box
                  sx={{
                    marginTop: 1,
                    color: "rgba(102, 102, 102, 0.4)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    textAlign: isOwner(message.ownerId) ? "right" : "left",
                  }}
                >
                  {getDifference(message.createdAt)}
                </Box>
              </Box>
            </Box>
          ))}
        </InfiniteScroll>
        <Box
          sx={{
            display: "flex",
            p: 1.5,
            borderTop: `1px solid ${theme.palette.palette_style.border.default}`,
            position: "relative",
          }}
        >
          <Box
            sx={{
              marginRight: 1,
              marginTop: 1,
            }}
          >
            {userProfile && (
              <Avatar
                label={`${userProfile.firstName.charAt(
                  0
                )}${userProfile.lastName.charAt(0)}`}
                avatarUrl={userProfile.avatarUrl || ""}
                color={userProfile.color || ""}
                size={40}
                toolTipLabel={userProfile.name}
              />
            )}
          </Box>

          <form onSubmit={(e) => e.preventDefault()} id="new_message_form">
            <TextField
              label={t("Reply")}
              name="message"
              value={message}
              size="medium"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => handleKeyPress(e)}
              fullWidth
            />
            <Box
              sx={{
                borderRadius: 50,
                backgroundColor: "#54A6FB",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                width: 32,
                height: 32,
                top: 24,
                right: 22,
                cursor: "pointer",
              }}
            >
              <Box
                component="span"
                className="svg-color"
                sx={{
                  width: 16,
                  height: 16,
                  display: "inline-block",
                  bgcolor: "white",
                  mask: `url(/assets/icons/send.svg) no-repeat center / contain`,
                  WebkitMask: `url(/assets/icons/send.svg) no-repeat center / contain`,
                }}
                onClick={() => handleMessage()}
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AnonymousChatForm);
