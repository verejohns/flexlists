import React, { useState, useEffect } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  TablePagination,
} from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import Head from "next/head";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { supportService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { SupportTicket } from "src/models/Support";
import { getLocalDateFromString } from "src/utils/convertUtils";
import { useTheme } from "@mui/material/styles";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

type SupportProps = {
  translations: TranslationText[];
  message: any;
  setFlashMessage: (message: any) => void;
};

const Support = ({ translations, message, setFlashMessage }: SupportProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [body, setBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

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

  const styles = {
    tableCell: {
      whiteSpace: { xs: "nowrap", md: "wrap" },
      overflow: "hidden",
      maxWidth: "256px",
      textOverflow: "ellipsis",
    },
    tableHeadCell: {
      color: theme.palette.palette_style.text.primary,
      background: theme.palette.palette_style.background.table_header_footer,
    },
  };

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const fetchSupportTickets = async () => {
    const getSupportTicketResponse = await supportService.getSupportTickets();

    if (isSucc(getSupportTicketResponse)) {
      setTickets(getSupportTicketResponse.data);
    } else {
      setFlashMessage({ message: t("Something Wrong"), type: "error" });
      return;
    }
  };

  const handleSubmit = async () => {
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
      clearSupportTicket();
      fetchSupportTickets();
    } else {
      setFlashMessage({ message: t("Something Wrong"), type: "error" });
      return;
    }
  };

  const clearSupportTicket = () => {
    setSubject("");
    setCategory("");
    setBody("");
  };

  const detailSupportTicket = (secret: string) => {
    router.push(`/main/support/${secret}`);
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

  return (
    <MainLayout removeFooter={true} translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>

      <Box sx={{ p: { xs: 1, md: 3 } }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pb: 2,
              borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
            }}
          >
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
            <Box
              sx={{
                marginLeft: 1,
                textTransform: "uppercase",
                fontWeight: 800,
                lineHeight: "24px",
              }}
            >
              {t("Create New Ticket")}
            </Box>
          </Box>
          <Box sx={{ marginTop: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: "40%",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                {t("Subject")}
              </Box>
              <TextField
                style={{ width: "100%", marginBottom: 15 }}
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
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: "40%",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                {t("Category")}
              </Box>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel shrink={true} id="select_category">
                  {t("Category")}
                </InputLabel>
                <Select
                  labelId="select_category"
                  label={t("Category")}
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as string);
                  }}
                  size="small"
                  notched={true}
                >
                  {categories.map((category: any) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: "40%",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  fontWeight: 700,
                }}
              >
                {t("Body")}
              </Box>
              <TextField
                style={{ width: "100%" }}
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
                rows={5}
                required
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "end", marginTop: 2 }}>
              <Button
                sx={{ marginLeft: 1 }}
                color="primary"
                onClick={handleSubmit}
                variant="contained"
                type="submit"
              >
                {t("Submit Ticket")}
              </Button>
            </Box>
          </Box>
        </Box>
        <Box sx={{ paddingTop: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pb: 2,
              borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
            }}
          >
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
          <TableContainer component={Paper} sx={{ maxHeight: 430 }}>
            <Table
              sx={{ minWidth: 320 }}
              stickyHeader
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={styles?.tableHeadCell} align="left">
                    {t("When")}
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
                    ? tickets.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : tickets
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
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={tickets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(Support);
