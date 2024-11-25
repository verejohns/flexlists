import React, { useState, useEffect } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import {
  Box,
  Button,
  Typography,
  Divider,
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
} from "@mui/material";
import { useRouter } from "next/router";
import { PATH_MAIN } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { validateToken } from "src/utils/tokenUtils";
import Head from "next/head";
import { Integration } from "src/models/SharedModels";
import { isSucc } from "src/models/ApiResponse";
import { integrationService } from "flexlists-api";
import { setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import ComingSoon from "src/pages/ComingSoon";
import { useTheme } from "@mui/material/styles";

type IntegrationsProps = {
  translations: TranslationText[];
  message: any;
  setMessage: (message: any) => void;
};

const dummyIntegrations = [
  {
    id: 1,
    name: "Email on change",
    description:
      "When a person do something notify everyoneWhen a person do something notify everyoneWhen a person do something notify everyoneWhen a person do something notify everyoneWhen a person do something notify everyone",
    type: "Email",
    trigger: "create,update,read,delete",
    email: "email@example.com",
  },
];

const Integrations = ({
  translations,
  message,
  setMessage,
}: IntegrationsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);

  const styles = {
    tableCell: {
      whiteSpace: { xs: "nowrap", md: "wrap" },
      overflow: "hidden",
      maxWidth: "256px",
      textOverflow: "ellipsis",
    },
    tableHeadCell: {
      color: theme.palette.palette_style.text.primary,
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
    // fetchIntegrations();
    setIntegrations(dummyIntegrations);
  }, [router.isReady]);

  const fetchIntegrations = async () => {
    const response = await integrationService.getIntegrations();

    if (isSucc(response) && response.data) {
      if (response.data.length > 0) {
        setIntegrations(response.data);
      } else {
        setMessage({
          message: t("No Integrations"),
          type: "success",
        });
        await router.push(PATH_MAIN.newIntegration);
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

  const editIntegration = (id: number) => {
    router.push(`/main/integrations/${id}`);
  };

  const deleteIntegration = async (id: number) => {
    const response = await integrationService.deleteIntegration(id);

    if (isSucc(response) && response.data) {
      await fetchIntegrations();
    } else {
      setFlashMessage(response?.data?.message);
    }
  };

  return (
    <MainLayout removeFooter={true} translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
      <ComingSoon
        title={t("External Integrations Coming Soon")}
        description={t(
          "Stay tuned for exciting updates! Click for more information."
        )}
        link="/documentation/roadmap/coming_soon_integrations"
      />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          {t("Integrations")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t("Welcome")}
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 320 }} aria-label="simple table">
            <TableHead
              sx={{
                background:
                  theme.palette.palette_style.background.table_header_footer,
              }}
            >
              <TableRow>
                <TableCell sx={styles?.tableHeadCell}>{t("Name")}</TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Descripiton")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Type")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Trigger")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="left">
                  {t("Emails")}
                </TableCell>
                <TableCell sx={styles?.tableHeadCell} align="right">
                  {t("Manage")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                background:
                  theme.palette.mode === "light"
                    ? theme.palette.palette_style.background.paper
                    : "rgba(17,34,51,.75)",
              }}
            >
              {integrations.map((integration: Integration) => (
                <TableRow
                  key={integration.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={styles?.tableCell}>
                    {integration.name}
                  </TableCell>
                  <TableCell sx={styles?.tableCell} align="left">
                    {integration.description}
                  </TableCell>
                  <TableCell sx={styles?.tableCell} align="left">
                    {integration.type}
                  </TableCell>
                  <TableCell sx={styles?.tableCell} align="left">
                    {integration.trigger}
                  </TableCell>
                  <TableCell sx={styles?.tableCell} align="left">
                    {integration.email}
                  </TableCell>
                  <TableCell sx={styles?.tableCell} align="right">
                    <Button
                      variant="text"
                      onClick={() => {
                        editIntegration(integration.id);
                      }}
                    >
                      {t("Edit")}
                    </Button>
                    <Button
                      sx={{ color: "#eb2027" }}
                      variant="text"
                      onClick={() => {
                        deleteIntegration(integration.id);
                      }}
                    >
                      {t("Delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ mb: 2 }} />
        <Button
          onClick={() => {
            router.push(PATH_MAIN.newIntegration);
          }}
          variant="contained"
        >
          + {t("Add Integration")}
        </Button>
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
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const verifyToken = await validateToken(context);

  // if(verifyToken){
  //   return verifyToken;
  // }

  return await getTranslations("integrations", context);
};

const mapStateToProps = (state: any) => ({
  message: state.view.message,
});

const mapDispatchToProps = {
  setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Integrations);
