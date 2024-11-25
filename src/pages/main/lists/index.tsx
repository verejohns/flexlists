import { useTheme } from "@mui/material/styles";
import { Alert, AlertColor, Box, Snackbar, Tab, Tabs } from "@mui/material";
import MainLayout from "src/layouts/view/MainLayout";
import Views from "src/sections/@view/views";
import { setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ArchiveIcon from '@mui/icons-material/Archive';
import { GetServerSideProps } from "next";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import Head from 'next/head';

type ListPageProps = {
  message: any;
  translations: TranslationText[];
  setMessage: (message: any) => void;
};

const styles = {
  tab: {
    minWidth: "fit-content",
    flex: 1,
  },
};

const ListsPage = ({
  message,
  translations,
  setMessage
}: ListPageProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  // error handling
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined); 

  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
  }, [message]);

  const flashHandleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  const setError = (message: string) => {
    setFlashMessage(message);
  };

  const setFlashMessage = (message: string, type: string = "error") => {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  };

  return (
    <MainLayout translations={translations}>
      <Head>
        <title>{t("Lists Page Title")}</title>
        <meta name="description" content={t("Lists Meta Description")} />
        <meta name="keywords" content={t("Lists Meta Keywords")} />
      </Head>
      <Box
        sx={{
          backgroundColor: theme.palette.palette_style.background.default,
          width: "100%",
          height: { xs: "calc(100% - 8px)", lg: "100%" },
          overflow: "hidden",
        }}
      >
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
        <Box borderBottom={"solid 1px"} sx={{ mb: 1 }} borderColor={"divider"}>
          <Views isArchived = {false} isDefaultViews={true} translations={translations} />
        </Box>
      </Box>
    </MainLayout>
  );
};

const mapStateToProps = (state: any) => ({
  message: state.view.message,
});

const mapDispatchToProps = {
  setMessage,
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("lists views", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(ListsPage);
