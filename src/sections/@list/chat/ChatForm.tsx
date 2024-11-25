import { useState, useEffect } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { ChatType } from "src/enums/ChatType";
import { View, ViewChat } from "src/models/SharedModels";
import { useRouter } from "next/router";
import { listChatService } from "flexlists-api";
import {
  FlexlistsError,
  FlexlistsSuccess,
  isSucc,
} from "src/models/ApiResponse";
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
import SupportHeader from "src/components/header/SupportHeader";

type ChatFormProps = {
  chatType: ChatType;
  id: number | string;
  currentView: View;
  userProfile: UserProfile;
  translations: TranslationText[];
  onlineStatus?: boolean;
  setFlashMessage: (message: FlashMessageModel) => void;
  handleClose: () => void;
};

const ChatForm = ({
  currentView,
  userProfile,
  chatType,
  id,
  translations,
  onlineStatus,
  setFlashMessage,
  handleClose,
}: ChatFormProps) => {
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
      // refreshMessages();
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
    if (chatType === ChatType.Support)
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[0] = teamMessage;

        return newMessages;
      });
  }, [onlineStatus]);

  // const refreshMessages = async () => {
  //   if (chatType === ChatType.Support) {
  //     const supportResponse = await supportService.getSupportTicket(id as string);

  //     if (isSucc(supportResponse) && supportResponse.data) {
  //       const { id, description,supportTicketThreads, ownerId, createdAt } = supportResponse.data;

  //       setMessages([{ id, message: description, ownerId, createdAt }]);
  //     }
  //     else {
  //       setFlashMessage({ message: supportResponse.message, type: 'error' })
  //     }
  //   } else {
  //     let chatResponse: FlexlistsError | FlexlistsSuccess<any[]>;

  //     if (chatType === ChatType.View) {
  //       chatResponse = await listChatService.getViewChat(id as number, 0, 100000000);
  //     } else {
  //       chatResponse = await listChatService.getContentChat(currentView.id, id as number, 0, 100000000);
  //     }
  //     if (isSucc(chatResponse) && chatResponse.data) {
  //       setMessages(chatResponse.data);
  //     }
  //     else {
  //       setFlashMessage({ message: chatResponse.message, type: 'error' })
  //     }
  //   }
  // };

  const fetchData = async (isRefresh: boolean = false) => {
    if (chatType === ChatType.Support) {
      const supportResponse = await supportService.getSupportTicket(
        id as string
      );

      if (isSucc(supportResponse) && supportResponse.data) {
        // const { id, description, ownerId, createdAt } = supportResponse.data;
        // if (supportResponse.data.supportTicketThreads.length === 0) setHasMore(false);
        if (!isRefresh) {
          setTicket(supportResponse.data);
        }
        // setMessages([{ id, message: description, ownerId, createdAt }]);
        if (chatType === ChatType.Support)
          setRefreshMessages(
            [teamMessage].concat(
              supportResponse.data.supportTicketThreads ?? []
            )
          );
        else
          setRefreshMessages(supportResponse.data.supportTicketThreads ?? []);
      } else {
        if (!isRefresh) {
          setFlashMessage({ message: supportResponse.message, type: "error" });
        }
      }
    } else {
      let chatResponse: FlexlistsError | FlexlistsSuccess<any[]>;

      if (chatType === ChatType.View) {
        chatResponse = await listChatService.getViewChat(
          id as number,
          page,
          limit
        );
      } else {
        chatResponse = await listChatService.getContentChat(
          currentView.id,
          id as number,
          page,
          limit
        );
      }
      if (isSucc(chatResponse) && chatResponse.data) {
        if (chatResponse.data.length === 0) {
          setHasMore(false);
        } else {
          setRefreshMessages(chatResponse.data);
          // setMessages((prevPosts) => [...prevPosts, ...chatResponse.data]);
          // setPage((prevPage) => prevPage + 1);
        }
      } else {
        if (!isRefresh) {
          setFlashMessage({ message: chatResponse.message, type: "error" });
        }
      }
    }
  };

  const handleMessage = async () => {
    if (!message) return;

    if (chatType === ChatType.Support) {
      const createTicketMessageResponse =
        await supportService.createTicketMessage(id as string, message, "Open");

      if (isSucc(createTicketMessageResponse)) {
        const { id, message, ownerId, author, createdAt } =
          createTicketMessageResponse.data;
        const newMessage = { id, message, author, ownerId, createdAt };

        setMessages([...messages, newMessage]);
        // refreshMessages();
      } else {
        setFlashMessage({ message: "Something went wrong!", type: "error" });
        return;
      }
    } else {
      let addChatResponse: FlexlistsError | FlexlistsSuccess<ViewChat>;
      if (chatType === ChatType.View) {
        addChatResponse = await listChatService.chatInView(
          id as number,
          message
        );
      } else {
        addChatResponse = await listChatService.chatInContent(
          currentView.id,
          id as number,
          message
        );
      }
      if (isSucc(addChatResponse)) {
        setMessages([...messages, addChatResponse.data!]);
        // refreshMessages();
      }
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
    return userId === userProfile?.id;
  };

  const getTime = (date?: Date) => {
    return date != null ? new Date(date).getTime() : 0;
  };

  return (
    <Box>
      {chatType === ChatType.Support && (
        <SupportHeader
          onlineStatus={onlineStatus || false}
          label={t("support (Staff)")}
        />
      )}
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Box
          onClick={handleClose}
          component="span"
          className="svg-color"
          sx={{
            width: 20,
            height: 20,
            display: "inline-block",
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/arrow_back.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/arrow_back.svg) no-repeat center / contain`,
            cursor: "pointer",
            marginRight: 2,
          }}
        />
        {chatType === ChatType.Support ? (
          <Typography variant="h6">
            {t("Your Ticket")}: <b>{ticket?.subject}</b>
          </Typography>
        ) : (
          <Typography variant="h6">{t("Comments")}</Typography>
        )}
      </Box>
      <Box
        sx={{
          // border: `1px solid ${theme.palette.palette_style.border.default}`,
          borderRadius: "5px",
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>{t("Loading")}</h4>}
          height={`${
            windowHeight - (chatType === ChatType.Support ? 193 : 142)
          }px`}
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
                    {chatType === ChatType.Support ? (
                      <Box>{`${message.author}`}</Box>
                    ) : (
                      <Box>
                        {`${message.ownerInfo?.firstName} ${message.ownerInfo?.lastName}`}
                      </Box>
                    )}
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
              {chatType !== ChatType.Support && message.over && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 24,
                    display: "flex",
                    justifyContent: "right",
                  }}
                >
                  <Box
                    component="span"
                    className="svg-color"
                    sx={{
                      width: 12,
                      height: 12,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.text.primary,
                      mask: `url(/assets/icons/reply.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/reply.svg) no-repeat center / contain`,
                      cursor: "pointer",
                      marginRight: 1,
                    }}
                  />
                  <Box
                    component="span"
                    className="svg-color"
                    sx={{
                      width: 12,
                      height: 12,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.text.primary,
                      mask: `url(/assets/icons/check_circle.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/check_circle.svg) no-repeat center / contain`,
                      cursor: "pointer",
                      marginRight: 1,
                    }}
                  />
                  <Box
                    component="span"
                    className="svg-color"
                    sx={{
                      width: 12,
                      height: 12,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.text.primary,
                      mask: `url(/assets/icons/footer/delete_list.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/footer/delete_list.svg) no-repeat center / contain`,
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </InfiniteScroll>
        <Box
          sx={{
            display: "flex",
            p: 1.5,
            borderTop: `1px solid ${theme.palette.palette_style.border.default}`,
            position: "relative",
            // marginTop: 3,
          }}
        >
          <Box
            sx={{
              marginRight: 1,
              marginTop: 1,
            }}
          >
            <Avatar
              label={`${userProfile.firstName.charAt(
                0
              )}${userProfile.lastName.charAt(0)}`}
              avatarUrl={userProfile.avatarUrl || ""}
              color={userProfile.color || ""}
              size={40}
              toolTipLabel={userProfile.name}
            />
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
  currentView: state.view.currentView,
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatForm);
