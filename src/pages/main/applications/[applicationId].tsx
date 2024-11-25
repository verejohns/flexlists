import React, { useState, useEffect } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  AlertColor,
  Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import { PATH_MAIN } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { TranslationText } from "src/models/SharedModels";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { isSucc, FlexlistsError } from "src/models/ApiResponse";
import { setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { applicationService } from "flexlists-api";
import { isInteger } from "src/utils/validateUtils";
import Head from "next/head";
import GroupAvatar from "src/components/avatar/GroupAvatar";
import { fileService } from "flexlists-api";

type NewApplicationProps = {
  translations: TranslationText[];
  message: any;
  setMessage: (message: any) => void;
};

const NewApplication = ({
  translations,
  message,
  setMessage,
}: NewApplicationProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchApplication(applicationId: number) {
      const response = await applicationService.getApplication(applicationId);

      if (isSucc(response) && response.data) {
        setName(response.data.name);
        setDescription(response.data.description);
        setIcon(response.data.icon);
        setColor(response.data.color);
      } else {
        setFlashMessage(response?.data?.message);
      }
    }

    if (
      router.isReady &&
      router.query.applicationId &&
      isInteger(router.query.applicationId)
    ) {
      fetchApplication(parseInt(router.query.applicationId as string));
    }
  }, [router.isReady]);

  useEffect(() => {
    const checkMessage = () => {
      if (message?.message) {
        setFlash(message);
      }
    };

    checkMessage();
  }, [message]);

  const flashHandleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };

  const setFlashMessage = (message: string, type: string = "error") => {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  };

  const handleEdit = async () => {
    const updateApplicationResponse =
      await applicationService.updateApplication(
        parseInt(router.query.applicationId as string),
        name,
        description
      );

    if (isSucc(updateApplicationResponse) && updateApplicationResponse.data) {
      router.push(PATH_MAIN.applications);
    } else {
      setFlashMessage(updateApplicationResponse.message);
      return;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();

      formData.append("file", event.target.files[0]);
      //will have to create a new uploadFile for application
      const response = await fileService.uploadFile(1, formData, setProgress);

      if (isSucc(response) && response.data && response.data.fileId) {
        console.log(response.data, "response.data");
        setIcon(response.data.fileId);
      } else {
        setFlashMessage((response as FlexlistsError).message);
      }
    }
  };

  return (
    <MainLayout removeFooter translations={translations}>
      <Head>
        <title>{t("Page Title")}</title>
        <meta name="description" content={t("Meta Description")} />
        <meta name="keywords" content={t("Meta Keywords")} />
      </Head>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4">{t("Manage Application")}</Typography>
        <Divider sx={{ mt: 1, mb: 3 }} light />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mt: "15px" }}>
            <GroupAvatar
              avatarUrl={icon}
              name={name}
              color={color}
              size={128}
            />
            <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
              <Button component="label" variant="contained">
                {t("Choose File")}
                <input
                  type="file"
                  accept={`.jpg,.png,.jpeg`}
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => {
                  setIcon("");
                }}
              >
                {t("Delete Icon")}
              </Button>
            </Box>
          </Box>
          <TextField
            required
            fullWidth
            label={t("Name")}
            InputLabelProps={{ shrink: true }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            fullWidth
            multiline
            label={t("Description")}
            rows={8}
            InputLabelProps={{ shrink: true }}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                router.push(PATH_MAIN.applications);
              }}
            >
              {t("Back To Applications")}
            </Button>
            <Button variant="contained" onClick={handleEdit}>
              {t("Edit")}
            </Button>
          </Box>
        </Box>
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
  return await getTranslations("applications", context);
};

const mapStateToProps = (state: any) => ({
  message: state.view.message,
});

const mapDispatchToProps = {
  setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewApplication);
