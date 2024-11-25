import React, { useState, useEffect } from "react";
import MainLayout from "src/layouts/admin";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import Head from "next/head";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { supportService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { SupportTicket, TicketMessage } from "src/models/Support";
import { getLocalDateFromString } from "src/utils/convertUtils";
import { useTheme } from "@mui/material/styles";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { UserProfile } from "src/models/UserProfile";
import { SystemRole } from "src/enums/SystemRole";
import { AuthValidate } from "src/models/AuthValidate";
import { setApiResponseStatus } from "src/redux/actions/adminAction";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";

type SupportProps = {
  translations: TranslationText[];
  userProfile: UserProfile | undefined;
  authValidate: AuthValidate | undefined;
  setApiResponseStatus: (status: ApiResponseStatus) => void;
  setFlashMessage: (message: any) => void;
};

const Support = ({
  translations,
  userProfile,
  authValidate,
  setApiResponseStatus,
  setFlashMessage,
}: SupportProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const theme = useTheme();
  const [online, setOnline] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const styles = {
    tableCell: {
      whiteSpace: { xs: "nowrap", md: "wrap" },
      overflow: "hidden",
      maxWidth: "256px",
      textOverflow: "ellipsis",
      py: 0.5,
    },
    tableHeadCell: {
      color: theme.palette.palette_style.text.primary,
      background: theme.palette.palette_style.background.table_header_footer,
    },
  };

  const ADMIN_TICKET_INTERVAL = parseInt(
    process.env.NEXT_PUBLIC_FLEXLIST_ADMIN_TICKET_INTERVAL || "10"
  );

  useEffect(() => {
    if (
      router.isReady &&
      !isLoaded &&
      ((authValidate && !authValidate.isUserValidated) ||
        (userProfile && userProfile.systemRole !== SystemRole.Support))
    ) {
      setApiResponseStatus(ApiResponseStatus.Unauthorized);
      return;
    }

    if (
      router.isReady &&
      userProfile &&
      userProfile.systemRole === SystemRole.Support
    ) {
      getOnlineStatus();
      fetchSupportTickets();

      const interval = setInterval(async () => {
        getOnlineStatus();
        fetchSupportTickets();
      }, ADMIN_TICKET_INTERVAL * 1000);

      setIsLoaded(true);

      return () => {
        clearInterval(interval);
      };
    }

    if (router.isReady) {
      setIsLoaded(true);
    }
  }, [router.isReady, userProfile, authValidate]);

  const getOnlineStatus = async () => {
    const _online = await supportService.getOnline();

    if (isSucc(_online)) setOnline(_online.data);
  };

  const fetchSupportTickets = async () => {
    const getSupportTicketResponse =
      await supportService.getSupportTicketsStaff();

    if (isSucc(getSupportTicketResponse)) {
      const ticketsResponse = getSupportTicketResponse.data;
      const sortedByDateTickets = ticketsResponse.sort(
        (a: SupportTicket, b: SupportTicket) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      const sortedByUnansweredTickets = sortedByDateTickets
        .filter((ticket: SupportTicket) => checkUnansweredTicket(ticket))
        .concat(
          sortedByDateTickets.filter(
            (ticket: SupportTicket) => !checkUnansweredTicket(ticket)
          )
        );

      setTickets(sortedByUnansweredTickets);
    }
  };

  const checkUnansweredTicket = (ticket: SupportTicket) => {
    const messages = ticket.supportTicketThreads;

    if (messages.length > 0) return !messages[messages.length - 1].staffMember;

    return false;
  };

  const detailSupportTicket = (secret: string) => {
    router.push(`/admin/support/${secret}`);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filterMessage = (ticket: SupportTicket) => {
    return ticket.supportTicketThreads.find(
      (message: TicketMessage) => message.message.indexOf(search) !== -1
    );
  };

  const filterTickets = () => {
    return !search
      ? tickets
      : tickets.filter(
          (ticket: SupportTicket) =>
            ticket.subject.indexOf(search) !== -1 ||
            ticket.name.indexOf(search) !== -1 ||
            ticket.email.indexOf(search) !== -1 ||
            filterMessage(ticket)
        );
  };

  const handleChangeStatus = async (status: boolean) => {
    const setStatusResponse = await supportService.setOnline(status);

    if (isSucc(setStatusResponse)) setOnline(status);
  };

  return (
    <MainLayout removeFooter={true}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>

      <Box sx={{ p: { xs: 1, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
            borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
            marginTop: 1,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <ConfirmationNumberOutlinedIcon
              sx={{ color: theme.palette.palette_style.text.selected }}
            />
            <Box
              sx={{
                marginLeft: 1,
                textTransform: "uppercase",
                lineHeight: "24px",
                fontWeight: 700,
              }}
            >
              {t("Your Tickets")}
            </Box>
          </Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={online}
                  onChange={(e) => handleChangeStatus(e.target.checked)}
                />
              }
              label="Support Online"
            />
          </FormGroup>
          <TextField
            style={{ width: "200px" }}
            label={t("Search")}
            InputLabelProps={{ shrink: true }}
            size="small"
            type={"text"}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
          />
        </Box>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "calc(100vh - 215px)" }}
        >
          <Table sx={{ minWidth: 320 }} stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("When")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Email")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Name")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Subject")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Status")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="right">
                  {t("Manage")}
                </TableCell>
              </TableRow>
            </TableHead>
            {page + 1 && (
              <TableBody>
                {(rowsPerPage > 0
                  ? filterTickets().slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filterTickets()
                ).map((ticket: any) => (
                  <TableRow
                    key={ticket.id}
                    sx={{
                      background:
                        theme.palette.mode === "light"
                          ? theme.palette.palette_style.background.paper
                          : "rgba(17,34,51,.75)",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={styles?.tableCell} align="left">
                      {getLocalDateFromString(ticket.createdAt)}
                    </TableCell>
                    <TableCell sx={styles?.tableCell} align="left">
                      {ticket.email}
                    </TableCell>
                    <TableCell sx={styles?.tableCell} align="left">
                      {ticket.name}
                    </TableCell>
                    <TableCell sx={styles?.tableCell} align="left">
                      {ticket.subject}
                    </TableCell>
                    <TableCell sx={styles?.tableCell} align="left">
                      {ticket.status}
                    </TableCell>
                    <TableCell sx={styles?.tableCell} align="right">
                      <Button
                        variant="text"
                        onClick={() => {
                          detailSupportTicket(ticket.secret);
                        }}
                      >
                        {t("Detail")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={filterTickets().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("support", context);
};

const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
  authValidate: state.admin.authValidate,
});

const mapDispatchToProps = {
  setFlashMessage,
  setApiResponseStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Support);
