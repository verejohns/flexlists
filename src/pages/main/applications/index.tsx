import React, { useState, useEffect } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  AlertColor,
  TablePagination,
  Link,
} from "@mui/material";
import { useRouter } from "next/router";
import { PATH_MAIN } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import Head from "next/head";
import { Application } from "src/models/SharedModels";
import { isSucc } from "src/models/ApiResponse";
import { applicationService } from "flexlists-api";
import { setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { useTheme } from "@mui/material/styles";
import ApplicationIcon from "src/components/avatar/ApplicationIcon";
import ComingSoon from "src/pages/ComingSoon";
import ApplicationDetailPanel from "src/sections/@application/ApplicationDetailPanel";
import {
  setOpenPanel,
  setSelectedId,
} from "src/redux/actions/applicationActions";

type ApplicationProps = {
  translations: TranslationText[];
  message: any;
  setOpenPanel: (value: boolean) => void;
  setSelectedId: (value: number) => void;
  setMessage: (message: any) => void;
};

const Applications = ({
  translations,
  message,
  setOpenPanel,
  setSelectedId,
  setMessage,
}: ApplicationProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [windowHeight, setWindowHeight] = useState(0);

  const APPLICATION_COMPLETED =
    process.env.NEXT_PUBLIC_FLEXLIST_APPLICATION_COMPLETED || "no";

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
    const checkMessage = () => {
      if (message?.message) {
        setFlash(message);
      }
    };

    checkMessage();
  }, [message]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    fetchApplications();
  }, [router.isReady]);

  const fetchApplications = async () => {
    if (APPLICATION_COMPLETED === "no") return;

    const response = await applicationService.getApplications();

    if (isSucc(response) && response.data) {
      if (response.data.length > 0) {
        setApplications(response.data);
      } else {
        setMessage({
          message: t("No Applications"),
          type: "success",
        });

        await router.push(PATH_MAIN.newApplication);
      }
    } else {
      setFlashMessage(response?.data?.message);
    }
  };

  const flashHandleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  const setFlashMessage = (message: string, type: string = "error") => {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  };

  const editApplication = (id: number) => {
    router.push(`/main/applications/${id}`);
  };

  const deleteApplication = async (id: number) => {
    const response = await applicationService.deleteApplication(id);

    if (isSucc(response) && response.data) {
      setFlashMessage("Deleted application successfully!", "success");
      await fetchApplications();
    } else {
      setFlashMessage(response?.data?.message);
    }
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

  const handleClickName = (id: number) => {
    setOpenPanel(true);
    setSelectedId(id);
  };

  return (
    <MainLayout removeFooter={true} translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
      {APPLICATION_COMPLETED === "no" && (
        <ComingSoon
          title={t("Applications Coming Soon")}
          description={t(
            "Stay tuned for exciting updates! Click for more information."
          )}
          link="/documentation/roadmap/coming_soon_applications"
        />
      )}
      <Box sx={{ px: { xs: 0.5, md: 2 }, pt: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", pb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {t("Applications")}
          </Typography>
          <Button
            onClick={() => {
              router.push(PATH_MAIN.newApplication);
            }}
            variant="contained"
          >
            + {t("Add Application")}
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: { xs: windowHeight - 210, md: windowHeight - 193 } }}
        >
          <Table sx={{ minWidth: 320 }} stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Name")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Descripiton")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Icon")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="right">
                  {t("Manage")}
                </TableCell>
              </TableRow>
            </TableHead>
            {page + 1 && (
              <TableBody>
                {(rowsPerPage > 0
                  ? applications.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : applications
                ).map((application: Application) => (
                  <TableRow
                    key={application.id}
                    sx={{
                      background:
                        theme.palette.mode === "light"
                          ? theme.palette.palette_style.background.paper
                          : "rgba(17,34,51,.75)",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={styles?.tableCell} align="left">
                      <Link
                        onClick={() => handleClickName(application.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        {application.name}
                      </Link>
                    </TableCell>
                    <TableCell sx={styles?.tableCell} align="left">
                      {application.description}
                    </TableCell>
                    <TableCell sx={styles?.tableCell} align="left">
                      <ApplicationIcon application={application} size={40} />
                    </TableCell>

                    <TableCell sx={styles?.tableCell} align="right">
                      <Button
                        variant="text"
                        onClick={() => {
                          editApplication(application.id);
                        }}
                      >
                        {t("Edit")}
                      </Button>
                      <Button
                        sx={{ color: "#eb2027" }}
                        variant="text"
                        onClick={() => {
                          deleteApplication(application.id);
                        }}
                      >
                        {t("Delete")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={applications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            ".MuiTablePagination-toolbar": {
              p: 0,
            },
          }}
        />
      </Box>
      <Snackbar
        open={flash !== undefined}
        autoHideDuration={6000}
        onClose={flashHandleClose}
      >
        <Alert
          onClose={flashHandleClose}
          severity={flash?.type as AlertColor}
          sx={{ width: "100%" }}
        >
          {flash?.message}
        </Alert>
      </Snackbar>
      <ApplicationDetailPanel translations={translations} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("applications", context);
};

const mapStateToProps = (state: any) => ({
  message: state.view.message,
});

const mapDispatchToProps = {
  setOpenPanel,
  setSelectedId,
  setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Applications);
