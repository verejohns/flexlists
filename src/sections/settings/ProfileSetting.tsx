import {
  Avatar,
  Button,
  Grid,
  TextField,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { UserProfile } from "src/models/UserProfile";
import { setFlashMessage } from "src/redux/actions/authAction";
import { setUserProfile } from "src/redux/actions/userActions";
import { accountService } from "flexlists-api";
import { fileService } from "flexlists-api";
import { downloadUserAvatarUrl } from "src/utils/flexlistHelper";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { Language } from "src/models/Language";
import { getLanguage, storeLanguage } from "src/utils/localStorage";
import { LocalStorageConst } from "src/constants/StorageConsts";
import Cookies from "js-cookie";
import { createFileObject, FileImpl } from "flexlists-api";

const AvatarImg = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
}));

type ProfileSettingProps = {
  translations: TranslationText[];
  userProfile?: any;
  languages: Language[];
  setUserProfile: (userProfile: UserProfile | undefined) => void;
  setFlashMessage: (mesage: FlashMessageModel) => void;
};

const ProfileSetting = ({
  translations,
  userProfile,
  languages,
  setFlashMessage,
  setUserProfile,
}: ProfileSettingProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const defaultLanguage = "en-US";
  const router = useRouter();
  const theme = useTheme();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>();

  useEffect(() => {
    async function getUserProfile() {
      const response = await accountService.getProfile();

      if (isSucc(response) && response.data) {
        let profile = Object.assign({}, response.data);
        if (profile && !profile.language) {
          profile.language = defaultLanguage;
        }
        setCurrentUserProfile(profile);
      } else
        setFlashMessage({
          message: (response as FlexlistsError).message,
          type: "error",
        });
    }

    if (router.isReady) {
      getUserProfile();
    }
  }, [router.isReady]);

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (currentUserProfile) {
      setCurrentUserProfile({
        ...currentUserProfile,
        firstName: event.target.value,
      });
      setIsDirty(true);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUserProfile) {
      setCurrentUserProfile({
        ...currentUserProfile,
        email: event.target.value,
      });
      setIsDirty(true);
    }
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (currentUserProfile) {
      setCurrentUserProfile({
        ...currentUserProfile,
        lastName: event.target.value,
      });
      setIsDirty(true);
    }
  };

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    if (currentUserProfile) {
      setCurrentUserProfile({
        ...currentUserProfile,
        phoneNumber: newPhoneNumber,
      });
      setIsDirty(true);
    }
  };

  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };

  const onSubmit = async () => {
    setIsSubmit(true);

    let _errors: { [key: string]: string | boolean } = {};
    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };
    let newFirstName = await frontendValidate(
      ModelValidatorEnum.User,
      FieldValidatorEnum.firstName,
      currentUserProfile?.firstName,
      _errors,
      _setErrors,
      true
    );

    if (
      isFrontendError(
        FieldValidatorEnum.firstName,
        _errors,
        setErrors,
        setError
      )
    )
      return;

    let newLastName = await frontendValidate(
      ModelValidatorEnum.User,
      FieldValidatorEnum.lastName,
      currentUserProfile?.lastName,
      _errors,
      _setErrors,
      true
    );

    if (
      isFrontendError(FieldValidatorEnum.lastName, _errors, setErrors, setError)
    )
      return;

    let newEmail = await frontendValidate(
      ModelValidatorEnum.User,
      FieldValidatorEnum.email,
      currentUserProfile?.email,
      _errors,
      _setErrors,
      true
    );

    if (isFrontendError(FieldValidatorEnum.email, _errors, setErrors, setError))
      return;

    let newPhoneNumber: string =
      currentUserProfile && currentUserProfile.phoneNumber
        ? currentUserProfile.phoneNumber
        : "";

    if (newPhoneNumber.length > 3) {
      newPhoneNumber = await frontendValidate(
        ModelValidatorEnum.User,
        FieldValidatorEnum.phoneNumber,
        newPhoneNumber,
        _errors,
        _setErrors,
        true
      );

      if (
        isFrontendError(
          FieldValidatorEnum.phoneNumber,
          _errors,
          setErrors,
          setError
        )
      )
        return;
    } else {
      newPhoneNumber = "";
    }

    const response = await accountService.updateProfile(
      newEmail,
      newFirstName,
      newLastName,
      newPhoneNumber,
      currentUserProfile?.avatarUrl,
      currentUserProfile?.language
    );

    if (isSucc(response)) {
      setFlashMessage({
        message: "Update profile successfully",
        type: "success",
      });
      setIsDirty(false);

      let newCurrentProfile = Object.assign({}, currentUserProfile);
      newCurrentProfile.avatarUrl = response.data?.avatarUrl;

      setUserProfile(newCurrentProfile);
      storeLanguage(currentUserProfile?.language || defaultLanguage);
      Cookies.set(
        LocalStorageConst.Language,
        currentUserProfile?.language || defaultLanguage
      );
      router.replace(router.asPath);
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
      setIsDirty(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      //let response = await uploadUserAvatar(formData, setProgress);

      const file = event.target.files[0];

      if (currentUserProfile) {
        setCurrentUserProfile({
          ...currentUserProfile,
          avatarUrl: createFileObject(file.name, file, file.type, file.size),
        });
        setIsDirty(true);
      }
      // if (isSucc(response) && response.data && response.data.fileId) {
      //   let newCurrentProfile = Object.assign({}, currentUserProfile);
      //   newCurrentProfile.avatarUrl = response.data.fileId;

      //   setCurrentUserProfile(newCurrentProfile);

      //   setIsDirty(true);
      // } else {
      //   setFlashMessage({
      //     message: (response as FlexlistsError).message,
      //     type: "error",
      //   });
      // }
    }
  };

  const handleDeleteAvatar = () => {
    if (currentUserProfile) {
      setCurrentUserProfile({ ...currentUserProfile, avatarUrl: "" });
      setIsDirty(true);
    }
  };

  const handleLanguageChange = async (event: SelectChangeEvent) => {
    if (currentUserProfile) {
      setCurrentUserProfile({
        ...currentUserProfile,
        language: event.target.value,
      });
      setIsDirty(true);
    }
  };

  return userProfile ? (
    <Box mt={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: { xs: 88, md: 128 },
            height: { xs: 88, md: 128 },
            border: "solid 6px #fff",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,0.1)",
            fontSize: 40,
            textTransform: "uppercase",
            position: "relative",
            backgroundColor:
              userProfile?.color ||
              theme.palette.palette_style.background.calendarItem,
            "&:hover .overlay": {
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
            },
          }}
        >
          {currentUserProfile?.avatarUrl &&
          currentUserProfile?.avatarUrl !== "" ? (
            <AvatarImg
              src={
                currentUserProfile?.avatarUrl instanceof FileImpl
                  ? URL.createObjectURL(currentUserProfile?.avatarUrl.data)
                  : downloadUserAvatarUrl(currentUserProfile?.avatarUrl)
              }
            />
          ) : (
            <Box>
              {currentUserProfile?.firstName.charAt(0)}
              {currentUserProfile?.lastName.charAt(0)}
            </Box>
          )}
        </Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            ml: { xs: 0, sm: 2 },
          }}
        >
          <Button component="label" variant="contained">
            {t("Choose File")}
            <input
              type="file"
              accept={`.jpg,.png,.jpeg`}
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button variant="outlined" onClick={handleDeleteAvatar}>
            {t("Delete Avatar")}
          </Button>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          {/* <Typography variant="subtitle2">First Name</Typography> */}
          <TextField
            label={t("First Name")}
            fullWidth
            value={currentUserProfile?.firstName}
            onChange={handleFirstNameChange}
            error={
              isSubmit && isFrontendError(FieldValidatorEnum.firstName, errors)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* <Typography variant="subtitle2">Last Name</Typography> */}
          <TextField
            label={t("Last Name")}
            fullWidth
            value={currentUserProfile?.lastName}
            onChange={handleLastNameChange}
            error={
              isSubmit && isFrontendError(FieldValidatorEnum.lastName, errors)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {/* <Typography variant="subtitle2">Email</Typography> */}
          <TextField
            label={t("Email")}
            fullWidth
            value={currentUserProfile?.email}
            type="email"
            onChange={handleEmailChange}
            error={
              isSubmit && isFrontendError(FieldValidatorEnum.email, errors)
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* <Typography variant="subtitle2">Phone Number</Typography> */}
          <MuiTelInput
            value={currentUserProfile?.phoneNumber}
            onChange={handlePhoneNumberChange}
            defaultCountry="NL"
            fullWidth
            label={t("Phone number")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {currentUserProfile && languages && currentUserProfile?.language && (
            <Select
              id="lst_type"
              value={currentUserProfile?.language}
              onChange={(e) => handleLanguageChange(e)}
              fullWidth
            >
              {languages.map((language) => {
                return (
                  <MenuItem
                    sx={{ width: "100%" }}
                    key={language.id}
                    value={language.id}
                  >
                    <Box
                      component="img"
                      alt={t(language.name)}
                      src={language.icon}
                      sx={{ width: 28, mr: 2, float: "left" }}
                    />

                    {t(language.name)}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </Grid>
      </Grid>
      {/* <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2">Email</Typography>
          <TextField
            fullWidth
            value={userProfile?.email}
            type="email"
            onChange={handleEmailChange}
            error={
              isSubmit && isFrontendError(FieldValidatorEnum.email, errors)
            }
          />
        </Grid>
      </Grid> */}
      {/* <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2">Phone Number</Typography>
          <MuiTelInput
            value={userProfile?.phoneNumber}
            onChange={handlePhoneNumberChange}
            defaultCountry="NL"
            fullWidth
          />
        </Grid>
      </Grid> */}
      <Button
        sx={{ mt: 2 }}
        disabled={!isDirty}
        variant="contained"
        onClick={() => {
          onSubmit();
        }}
      >
        {t("Update Settings")}
      </Button>
    </Box>
  ) : (
    <></>
  );
};

const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
  languages: state.admin.languages,
});

const mapDispatchToProps = {
  setFlashMessage,
  setUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetting);
