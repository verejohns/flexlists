import React, { useState, useEffect } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  Switch,
  MenuItem,
  FormControlLabel,
  FormGroup,
  InputLabel,
  FormControl,
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
import { Integration } from "src/models/SharedModels";
import { isSucc } from "src/models/ApiResponse";
import { setMessage } from "src/redux/actions/viewActions";
import { connect } from "react-redux";
import { integrationService } from "flexlists-api";
import { isInteger } from "src/utils/validateUtils";

const dummyIntegration = {
  id: 1,
  name: "Email on change",
  description:
    "When a person do something notify everyoneWhen a person do something notify everyoneWhen a person do something notify everyoneWhen a person do something notify everyoneWhen a person do something notify everyone",
  type: "email",
  trigger: "create,update,read,delete",
  email: "email@example.com",
};

type NewIntegrationProps = {
  translations: TranslationText[];
  message: any;
  setMessage: (message: any) => void;
};

const NewIntegration = ({
  translations,
  message,
  setMessage,
}: NewIntegrationProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  const [oldIntegration, setOldIntegration] = useState<Integration>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [email, setEmail] = useState("");
  const [createTrigger, setCreateTrigger] = useState(false);
  const [readTrigger, setReadTrigger] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [deleteTrigger, setDeleteTrigger] = useState(false);

  useEffect(() => {
    async function fetchIntegration(integrationId: number) {
      const response = await integrationService.getIntegration(integrationId);

      if (isSucc(response) && response.data) {
        // setOldIntegration(response.data);
      } else {
        setFlashMessage(response?.data?.message);
      }
    }

    if (
      router.isReady &&
      router.query.integrationId &&
      isInteger(router.query.integrationId)
    ) {
      // fetchIntegration(convertToNumber(router.query.integrationId));
      const triggers = dummyIntegration.trigger.split(",");

      setOldIntegration(dummyIntegration);
      setName(dummyIntegration.name);
      setDescription(dummyIntegration.description);
      setType(dummyIntegration.type);
      setEmail(dummyIntegration.email);
      setCreateTrigger(triggers.includes("create"));
      setReadTrigger(triggers.includes("read"));
      setUpdateTrigger(triggers.includes("update"));
      setDeleteTrigger(triggers.includes("delete"));
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
    const triggerArray = [];

    if (createTrigger) triggerArray.push("create");
    if (readTrigger) triggerArray.push("read");
    if (updateTrigger) triggerArray.push("update");
    if (deleteTrigger) triggerArray.push("delete");

    const newIntegration = {
      name,
      description,
      type,
      trigger: triggerArray.join(","),
      email,
    };

    if (oldIntegration?.id) {
      const updateIntegrationResponse =
        await integrationService.updateIntegration(
          oldIntegration.id,
          name,
          description,
          type,
          triggerArray.join(","),
          email
        );

      if (isSucc(updateIntegrationResponse) && updateIntegrationResponse.data) {
        router.push(PATH_MAIN.integrations);
      } else {
        setFlashMessage(updateIntegrationResponse.message);
        return;
      }
    }
  };

  return (
    <MainLayout removeFooter translations={translations}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h4">{t("Edit Integration")}</Typography>
        <TextField
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
          minRows={8}
          maxRows={8}
          InputLabelProps={{ shrink: true }}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-standard-label" shrink={true}>
            {t("Type")}
          </InputLabel>
          <Select
            notched={true}
            labelId="demo-simple-select-standard-label"
            value={type}
            placeholder="Type"
            onChange={(e) => {
              setType(e.target.value);
            }}
            fullWidth
            label={t("Type")}
          >
            <MenuItem value={"email"}>{t("Email")}</MenuItem>
            <MenuItem value={"webhook"}>{t("Webhook")}</MenuItem>
          </Select>
        </FormControl>
        <FormGroup sx={{ display: "inline" }}>
          <FormControlLabel
            label={t("Create")}
            checked={createTrigger}
            onChange={(e, checked) => {
              setCreateTrigger(checked);
            }}
            control={<Switch />}
          ></FormControlLabel>
          <FormControlLabel
            label={t("Read")}
            checked={readTrigger}
            onChange={(e, checked) => {
              setReadTrigger(checked);
            }}
            control={<Switch />}
          ></FormControlLabel>
          <FormControlLabel
            label={t("Update")}
            checked={updateTrigger}
            onChange={(e, checked) => {
              setUpdateTrigger(checked);
            }}
            control={<Switch />}
          ></FormControlLabel>
          <FormControlLabel
            label={t("Delete")}
            checked={deleteTrigger}
            onChange={(e, checked) => {
              setDeleteTrigger(checked);
            }}
            control={<Switch />}
          ></FormControlLabel>
        </FormGroup>
        <TextField
          fullWidth
          multiline
          label={t("Emails")}
          minRows={4}
          maxRows={6}
          InputLabelProps={{ shrink: true }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              router.push(PATH_MAIN.integrations);
            }}
          >
            {t("Back To Integrations")}
          </Button>
          <Button variant="contained" onClick={handleEdit}>
            {t("Edit")}
          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewIntegration);
