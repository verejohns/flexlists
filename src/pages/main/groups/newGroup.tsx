import React, { useState } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import WysiwygEditor from "src/components/wysiwyg/wysiwygEditor";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { PATH_MAIN } from "src/routes/paths";
import { groupService } from "flexlists-api";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { setFlashMessage } from "src/redux/actions/authAction";
import { connect } from "react-redux";
import { GetServerSideProps } from "next";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { fileService, createFileObject } from "flexlists-api";
import GroupAvatar from "src/components/avatar/GroupAvatar";

type NewGroupProps = {
  translations: TranslationText[];
  setFlashMessage: (message: FlashMessageModel) => void;
};

const NewGroup = ({ translations, setFlashMessage }: NewGroupProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [currentGroup, setCurrentGroup] = useState<{
    name: string;
    description: string;
    avatarUrl?: string;
  }>({ name: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>("");

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGroup = Object.assign({}, currentGroup);

    newGroup.name = event.target.value;
    setCurrentGroup(newGroup);
  };

  const onDescriptionChange = (newValue: string) => {
    const newGroup = Object.assign({}, currentGroup);

    newGroup.description = newValue;
    setCurrentGroup(newGroup);
  };

  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };

  const handleSubmit = async () => {
    setIsSubmit(true);

    let _errors: { [key: string]: string | boolean } = {};
    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };
    let newGroupName = await frontendValidate(
      ModelValidatorEnum.Group,
      FieldValidatorEnum.name,
      currentGroup.name,
      _errors,
      _setErrors,
      true
    );

    if (isFrontendError(FieldValidatorEnum.name, _errors, setErrors, setError))
      return;

    const createGroupResponse = await groupService.createUserGroup(
      newGroupName,
      currentGroup.description,
      file
        ? createFileObject(file.name, file, file.type, file.size)
        : currentGroup.avatarUrl
    );

    if (
      isSucc(createGroupResponse) &&
      createGroupResponse.data &&
      createGroupResponse.data.groupId
    ) {
      // if (file) {
      //   const formData = new FormData();

      //   formData.append("file", file);

      //   const response = await uploadGroupAvatar(
      //     createGroupResponse.data.groupId,
      //     formData,
      //     setProgress
      //   );
      // }

      await router.push({
        pathname: `${PATH_MAIN.groups}/${createGroupResponse.data.groupId}`,
      });
    } else {
      setError((createGroupResponse as FlexlistsError).message);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files && event.target.files[0];
      setFile(selectedFile || null);

      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewURL(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewURL("");
      }
    }
  };

  const handleDeleteAvatar = () => {
    const newGroup = Object.assign({}, currentGroup);

    newGroup.avatarUrl = "";
    setCurrentGroup(newGroup);
  };

  return (
    <MainLayout
      removeFooter={true}
      disableOverflow={false}
      translations={translations}
    >
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
        }}
      >
        <Box sx={{ py: 4, mx: 2, flexGrow: 1 }}>
          <Typography variant="h4">{t("Create New Group")}</Typography>
          <Divider sx={{ my: 2 }} light />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: "15px",
              mb: "20px",
            }}
          >
            <GroupAvatar
              avatarUrl={previewURL}
              name={""}
              color={""}
              size={128}
              isDownloadMemory={true}
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
                onClick={handleDeleteAvatar}
              >
                {t("Delete Icon")}
              </Button>
            </Box>
          </Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t("Name")}
              <Typography component={"span"} sx={{ color: "red" }}>
                *
              </Typography>
            </Typography>
            <TextField
              required
              fullWidth
              id="fullWidth"
              value={currentGroup.name}
              onChange={onNameChange}
              error={
                isSubmit && isFrontendError(FieldValidatorEnum.name, errors)
              }
            />
          </Box>
          <Box sx={{ mb: "25px" }}>
            <Typography variant="subtitle2" gutterBottom>
              {t("Description")}
            </Typography>
            <WysiwygEditor
              value={currentGroup.description}
              setValue={(newValue) => onDescriptionChange(newValue)}
            />
          </Box>

          {/* <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Icon
            </Typography>
            <IconUploadButton />
          </Box> */}
          <Button
            variant="contained"
            sx={{ width: { xs: "100%", md: "auto" } }}
            type="submit"
            onClick={() => handleSubmit()}
          >
            {t("Create Group")}
          </Button>
          <Button
            variant="outlined"
            sx={{ width: { xs: "100%", md: "auto" }, ml: 1 }}
            href="./"
          >
            {t("Cancel")}
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  setFlashMessage,
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("groups", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewGroup);
