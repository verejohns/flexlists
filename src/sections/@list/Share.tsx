import {
  Modal,
  Typography,
  Box,
  FormLabel,
  TextField,
  Divider,
  Button,
  Grid,
  Tab,
  Select,
  MenuItem,
  Tabs,
  Autocomplete,
  Alert,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import UserListAccess from "src/sections/list-access/UserListAccess";
import GroupListAccess from "src/sections/list-access/GroupListAccess";
import { SelectChangeEvent } from "@mui/material/Select";
import ManageKeys from "src/sections/share-list/ManageKeys";
import { connect } from "react-redux";
import { RoleLabel } from "src/enums/ShareEnumLabels";
import { Role } from "src/enums/SharedEnums";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import GroupsIcon from "@mui/icons-material/Groups";
import { useRouter } from "next/router";
import { accountService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { validateEmail } from "src/utils/validateUtils";
import { listViewService } from "flexlists-api";
import {
  GetKeysForViewOutputDto,
  GetUserContactsOutputDto,
  GetUserGroupsOutputDto,
  GetViewGroupsOutputDto,
} from "src/models/ApiOutputModels";
import {
  getAllViewUsers,
  setViewGroups,
  setViewUsers,
} from "src/redux/actions/viewActions";
import { groupService } from "flexlists-api";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { View } from "src/models/SharedModels";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import RightPanel from "src/components/right-panel/RightPanel";
import { useTheme } from "@mui/material/styles";
import { convertToNumber } from "src/utils/convertUtils";

type ShareListProps = {
  open: boolean;
  translations: TranslationText[];
  handleClose: () => void;
  users: any[];
  viewGroups: any[];
  setViewUsers: (newUsers: any[]) => void;
  setViewGroups: (newViewGroups: GetViewGroupsOutputDto[]) => void;
  styles?: any;
  setFlashMessage: (message: FlashMessageModel) => void;
  currentView: View;
  panelWidth?: string;
  getAllViewUsers: (viewId: number) => void;
};

const style = {
  position: "absolute" as "absolute",
  padding: 2,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", md: "50%" },
  maxHeight: "80vh",
  backgroundColor: "white",
  border: "none",
  borderRadius: "8px",
  overflowY: "scroll",
  display: "flex",
  flexDirection: "column",
};

const scaleUp = {
  hidden: {
    x: "-50%",
    y: "-50%",
    scale: 0.5,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      type: "spring",
      damping: 30,
      stiffness: 700,
    },
  },
  close: {
    opacity: 0,
  },
};

const ShareList = ({
  open,
  translations,
  handleClose,
  users,
  viewGroups,
  setViewUsers,
  setViewGroups,
  styles,
  setFlashMessage,
  currentView,
  panelWidth,
  getAllViewUsers,
}: ShareListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("Users");
  var roles: { name: string; label: string }[] = [];
  RoleLabel.forEach((value, key) => {
    roles.push({ name: key, label: value });
  });
  const closeModal = () => {
    handleClose();
  };
  const shareTabs: any[] = [
    {
      value: "Users",
      icon: <PersonIcon />,
      component: (
        <ShareUsers
          translations={translations}
          users={users}
          roles={roles}
          setViewUsers={setViewUsers}
          setFlashMessage={setFlashMessage}
          currentView={currentView}
        />
      ),
    },
    {
      value: "Groups",
      icon: <GroupsIcon />,
      component: (
        <ShareGroups
          viewGroups={viewGroups}
          roles={roles}
          setViewGroups={setViewGroups}
          setFlashMessage={setFlashMessage}
          currentView={currentView}
          translations={translations}
          getAllViewUsers={getAllViewUsers}
        />
      ),
    },
    {
      value: "Keys",
      icon: <KeyIcon />,
      component: (
        <ShareKeys
          roles={roles.filter((x) => x.name !== Role.FullAccess)}
          currentView={currentView}
          translations={translations}
        />
      ),
    },
  ];
  const changeTab = (value: any) => {
    setCurrentTab(value);
  };

  styles = {
    modal: {
      position: "absolute" as "absolute",
      padding: 2,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: "80%", md: "50%" },
      maxHeight: "80vh",
      backgroundColor: "white",
      border: "none",
      borderRadius: "8px",
      overflowY: "scroll",
      display: "flex",
      flexDirection: "column",
    },
    tab: {
      minWidth: "fit-content",
      flex: 1,
    },
  };

  return (
    <RightPanel open={open} handleClose={closeModal} panelWidth="700px">
      <Box
        sx={{ mx: 2, my: 2, height: "calc(100vh - 100px)", overflowY: "auto" }}
      >
        <Typography gutterBottom variant="h5">
          {t("Share")}
        </Typography>
        <Box borderBottom={"solid 1px"} sx={{ mb: 1 }} borderColor={"divider"}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            // allowScrollButtonsMobile
            onChange={(e, value) => changeTab(value)}
          >
            {shareTabs.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={tab.value}
                icon={tab.icon}
                value={tab.value}
                sx={styles?.tab}
              />
            ))}
          </Tabs>
        </Box>

        {shareTabs.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Box>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          right: 0,
          p: 2,
          background: theme.palette.palette_style.background.default,
          width: { xs: "100%", lg: panelWidth ?? "700px" },
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={closeModal} variant="outlined">
          Close
        </Button>
      </Box>
    </RightPanel>
  );
};
type ShareUsersProps = {
  translations: TranslationText[];
  users: any[];
  roles: { name: string; label: string }[];
  setViewUsers: (newUsers: any[]) => void;
  styles?: any;
  setFlashMessage: (message: FlashMessageModel) => void;
  currentView: View;
};
const ShareUsers = ({
  translations,
  users,
  roles,
  setViewUsers,
  styles,
  setFlashMessage,
  currentView,
}: ShareUsersProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [role, setRole] = useState<Role>(Role.ReadOnly);
  const handleSelectRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as Role);
  };
  const [contacts, setContacts] = useState<GetUserContactsOutputDto[]>([]);
  const [invitedEmail, setInvitedEmail] = useState<any>("");
  // const [submit, setSubmit] = useState<boolean>(false);
  const [isEmailValid, setEmailValid] = useState(false);
  const [emailDirty, setEmailDirty] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      var contactsResponse = await accountService.getUserContacts();
      if (isSucc(contactsResponse) && contactsResponse.data) {
        setContacts(contactsResponse.data);
      }
    }
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);
  const setError = (message: string) => {
    setFlashMessage({ message: message, type: "error" });
  };
  const onSubmit = async () => {
    if (!currentView.id) {
      setFlashMessage({ message: "View id is not valid", type: "error" });
      return;
    }
    setIsSubmit(true);
    let _errors: { [key: string]: string | boolean } = {};

    const _setErrors = (e: { [key: string]: string | boolean }) => {
      _errors = e;
    };
    let newEmail = await frontendValidate(
      ModelValidatorEnum.GenericTypes,
      FieldValidatorEnum.email,
      invitedEmail,
      _errors,
      _setErrors,
      true
    );
    if (isFrontendError(FieldValidatorEnum.email, _errors, setErrors, setError))
      return;

    var existContact = contacts.find((x) => x.email === invitedEmail);

    if (existContact) {
      let inviteToUserResponse = await listViewService.inviteUserToView(
        currentView.id,
        existContact.userId,
        role
      );
      if (isSucc(inviteToUserResponse)) {
        setFlashMessage({
          message: `Invite to ${invitedEmail} sent`,
          type: "success",
        });
      } else {
        setFlashMessage({
          message: (inviteToUserResponse as FlexlistsError).message,
          type: "error",
        });
      }
    } else {
      let inviteToEmailResponse = await listViewService.inviteEmailToView(
        currentView.id,
        invitedEmail,
        role
      );
      if (isSucc(inviteToEmailResponse)) {
        setFlashMessage({
          message: `Invite to ${invitedEmail} sent`,
          type: "success",
        });
      } else {
        setFlashMessage({
          message: (inviteToEmailResponse as FlexlistsError).message,
          type: "error",
        });
      }
    }
  };

  styles = {
    shareFormWrapper: {
      display: "flex",
      alignItems: { xs: "center", md: "flex-end" },
      justifyContent: "space-evenly",
      gap: 2,
      flexDirection: { xs: "column", md: "row" },
    },
    accessRole: {
      display: "flex",
      flexDirection: "column",
      flex: { xs: "unset", md: 1.05 },
      width: { xs: "100%", md: "unset" },
    },
    usersGroupsKeys: {
      display: "flex",
      flexDirection: "column",
      flex: { xs: "unset", md: 2 },
      width: { xs: "100%", md: "unset" },
    },
    buttonWrapper: {
      width: "100%",
      flex: 1,
    },
    button: {
      height: "40px",
    },
  };
  return (
    <>
      <Typography variant="subtitle2" sx={{ py: 2 }}>
        {t("Invite User")}
      </Typography>

      {/* <Grid container spacing={2}>
        <Grid item xs={3} sx={{ display: "flex", flexDirection: "column" }}>
          <FormLabel>
            <Typography variant="body2">{t("Access Role")}</Typography>
          </FormLabel>
          <Select size="small" value={role} onChange={handleSelectRoleChange}>
            {roles &&
              roles.map((role, index) => {
                return (
                  <MenuItem key={index} value={role.name}>
                    {role.label}
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
        <Grid item xs={7} sx={{ display: "flex", flexDirection: "column" }}>
          <FormLabel>
            <Typography variant="body2">Users</Typography>
          </FormLabel>
          <Autocomplete
            sx={{ marginTop: "23px" }}
            size="small"
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            onInputChange={async (event, newInputValue) => {
              setIsSubmit(false);
              setInvitedEmail(newInputValue);

              let _errors: { [key: string]: string | boolean } = {};

              const _setErrors = (e: { [key: string]: string | boolean }) => {
                _errors = e;
              };
              await frontendValidate(
                ModelValidatorEnum.GenericTypes,
                FieldValidatorEnum.email,
                newInputValue,
                _errors,
                _setErrors,
                true
              );
              setErrors(_errors);
            }}
            options={contacts.map((option) => option.email)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Invite contacts or invite by email ..."
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                required
                error={
                  (emailDirty || isSubmit) &&
                  isFrontendError(FieldValidatorEnum.email, errors)
                }
                onBlur={() => setEmailDirty(true)}
                sx={styles?.textField}
              />
            )}
          />
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", alignItems: "flex-end" }}>
          <Button variant="contained" fullWidth onClick={() => onSubmit()}>
            Invite
          </Button>
        </Grid>
      </Grid> */}
      <Box sx={styles?.shareFormWrapper}>
        <Box sx={styles?.accessRole}>
          <FormLabel>
            <Typography variant="body2">{t("Access Role")}</Typography>
          </FormLabel>
          <Select size="small" value={role} onChange={handleSelectRoleChange}>
            {roles &&
              roles.map((role, index) => {
                return (
                  <MenuItem key={index} value={role.name}>
                    {role.label}
                  </MenuItem>
                );
              })}
          </Select>
        </Box>
        <Box sx={styles?.usersGroupsKeys}>
          <FormLabel>
            <Typography variant="body2">{t("Users")}</Typography>
          </FormLabel>
          <Autocomplete
            // sx={{ marginTop: "23px" }}
            size="small"
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            onInputChange={async (event, newInputValue) => {
              setIsSubmit(false);
              setInvitedEmail(newInputValue);

              let _errors: { [key: string]: string | boolean } = {};

              const _setErrors = (e: { [key: string]: string | boolean }) => {
                _errors = e;
              };
              await frontendValidate(
                ModelValidatorEnum.GenericTypes,
                FieldValidatorEnum.email,
                newInputValue,
                _errors,
                _setErrors,
                true
              );
              setErrors(_errors);
            }}
            options={contacts.map((option) => option.email)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("Invite Contacts")}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                required
                error={
                  (emailDirty || isSubmit) &&
                  isFrontendError(FieldValidatorEnum.email, errors)
                }
                onBlur={() => setEmailDirty(true)}
                sx={styles?.textField}
              />
            )}
          />
        </Box>
        <Box sx={styles?.buttonWrapper}>
          <Button
            sx={styles?.button}
            variant="contained"
            fullWidth
            onClick={() => onSubmit()}
          >
            {t("Invite")}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mt: 3, mb: 1 }}></Divider>
      <Typography sx={{ pt: 1 }} variant="subtitle2">
        {t("All Users")}
      </Typography>
      <UserListAccess users={users} roles={roles} translations={translations} />
    </>
  );
};

type ShareGroupsProps = {
  translations: TranslationText[];
  viewGroups: GetViewGroupsOutputDto[];
  roles: { name: string; label: string }[];
  setViewGroups: (newViewGroups: GetViewGroupsOutputDto[]) => void;
  styles?: any;
  setFlashMessage: (message: FlashMessageModel) => void;
  currentView: View;
  getAllViewUsers: (viewId: number) => void;
};
const ShareGroups = ({
  translations,
  viewGroups,
  roles,
  setViewGroups,
  styles,
  setFlashMessage,
  currentView,
  getAllViewUsers,
}: ShareGroupsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [role, setRole] = useState<Role>(Role.ReadOnly);
  const [submit, setSubmit] = useState<boolean>(false);
  const [groups, setGroups] = useState<GetUserGroupsOutputDto[]>([]);
  const [currentGroup, setCurrentGroup] =
    useState<GetUserGroupsOutputDto | null>();
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  useEffect(() => {
    async function fetchData() {
      var response = await groupService.getUserGroups();

      if (isSucc(response) && response.data) {
        setGroups(response.data);
      }
    }
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);
  const handleSelectRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as Role);
  };
  const onGroupChange = (newGroup: GetUserGroupsOutputDto | null) => {
    setCurrentGroup(newGroup);
  };
  const onsubmit = async () => {
    setSubmit(true);

    if (!currentGroup || !currentGroup.groupId) {
      setError("Group required");
      setSuccessMessage("");
      return;
    }
    var response = await listViewService.addTableViewToGroup(
      currentGroup.groupId,
      currentView.id,
      role
    );
    if (isSucc(response)) {
      setError("");
      setSuccessMessage(t("Group Added"));
      var newViewGroups: GetViewGroupsOutputDto[] = Object.assign(
        [],
        viewGroups
      );
      newViewGroups.push({
        groupId: currentGroup.groupId,
        name: currentGroup.name,
        role: role,
      });
      setViewGroups(newViewGroups);
      setCurrentGroup(null);
      getAllViewUsers(currentView.id);
    } else {
      setSuccessMessage("");
      setError((response as FlexlistsError).message);
    }
  };
  styles = {
    shareFormWrapper: {
      display: "flex",
      alignItems: { xs: "center", md: "flex-end" },
      justifyContent: "space-evenly",
      gap: 2,
      flexDirection: { xs: "column", md: "row" },
    },
    accessRole: {
      display: "flex",
      flexDirection: "column",
      flex: { xs: "unset", md: 1.05 },
      width: { xs: "100%", md: "unset" },
    },
    usersGroupsKeys: {
      display: "flex",
      flexDirection: "column",
      flex: { xs: "unset", md: 2 },
      width: { xs: "100%", md: "unset" },
    },
    buttonWrapper: {
      width: "100%",
      flex: 1,
    },
    button: {
      height: "40px",
    },
  };
  return (
    <>
      <Typography variant="subtitle2" sx={{ py: 2 }}>
        {t("Invite Group")}
      </Typography>
      <Box>{error && <Alert severity="error">{error}</Alert>}</Box>
      {/* <Box>
          {submit && successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Box> */}
      {/* <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
        <Grid item xs={3} sx={{ display: "flex", flexDirection: "column" }}>
          <FormLabel>
            <Typography variant="body2">{t("Access Role")}</Typography>
          </FormLabel>
          <Select size="small" value={role} onChange={handleSelectRoleChange}>
            {roles &&
              roles.map((role, index) => {
                return (
                  <MenuItem key={index} value={role.name}>
                    {role.label}
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
        {groups && (
          <Grid item xs={7} sx={{ display: "flex", flexDirection: "column" }}>
            <FormLabel>
              <Typography variant="body2">{t("Groups")}</Typography>
            </FormLabel>
            <Autocomplete
              size="small"
              id="combo-box-groups"
              filterSelectedOptions={true}
              options={groups.filter(
                (x) => !viewGroups.find((g) => g.groupId === x.groupId)
              )}
              getOptionLabel={(option) => option.name}
              fullWidth
              value={currentGroup ?? null}
              onChange={(event, newInputValue) => {
                onGroupChange(newInputValue);
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" label={t("Search Groups")} />
              )}
            />
          </Grid>
        )}

        <Grid item xs={2} sx={{ display: "flex", alignItems: "flex-end" }}>
          <Button variant="contained" fullWidth onClick={() => onsubmit()}>
            {t("Add Group")}
          </Button>
        </Grid>
      </Grid> */}
      <Box sx={styles?.shareFormWrapper}>
        <Box sx={styles?.accessRole}>
          <FormLabel>
            <Typography variant="body2">{t("Access Role")}</Typography>
          </FormLabel>
          <Select size="small" value={role} onChange={handleSelectRoleChange}>
            {roles &&
              roles.map((role, index) => {
                return (
                  <MenuItem key={index} value={role.name}>
                    {role.label}
                  </MenuItem>
                );
              })}
          </Select>
        </Box>
        <Box sx={styles?.usersGroupsKeys}>
          <FormLabel>
            <Typography variant="body2">{t("Groups")}</Typography>
          </FormLabel>
          <Autocomplete
            size="small"
            id="combo-box-groups"
            filterSelectedOptions={true}
            options={groups.filter(
              (x) => !viewGroups.find((g) => g.groupId === x.groupId)
            )}
            getOptionLabel={(option) => option.name}
            fullWidth
            value={currentGroup ?? null}
            onChange={(event, newInputValue) => {
              onGroupChange(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} size="small" label={t("Search Groups")} />
            )}
          />
        </Box>
        <Box sx={styles?.buttonWrapper}>
          <Button
            sx={styles?.button}
            variant="contained"
            fullWidth
            onClick={() => onsubmit()}
          >
            {t("Add Group")}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mt: 3, mb: 1 }}></Divider>
      <Typography sx={{ pt: 1 }} variant="subtitle2">
        {t("All Groups")}
      </Typography>
      <GroupListAccess
        roles={roles}
        viewGroups={viewGroups}
        setViewGroups={setViewGroups}
      />
    </>
  );
};
type ShareKeysProps = {
  translations: TranslationText[];
  roles: { name: string; label: string }[];
  currentView: View;
  styles?: any;
};
const ShareKeys = ({
  roles,
  translations,
  currentView,
  styles,
}: ShareKeysProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [role, setRole] = useState<Role>(Role.ReadOnly);
  const [keyName, setKeyName] = useState<string>("");
  const [viewKeys, setViewKeys] = useState<GetKeysForViewOutputDto[]>([]);
  const [error, setError] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  useEffect(() => {
    async function fetchData() {
      var response = await listViewService.getKeysForView(currentView.id);
      if (isSucc(response) && response.data) {
        setViewKeys(response.data);
      }
    }
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);
  const onKeyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyName(event.target.value);
  };
  const handleSelectRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as Role);
  };
  const onSubmit = async () => {
    setSubmit(true);
    var response = await listViewService.addKeyToView(
      currentView.id,
      role,
      keyName
    );
    if (isSucc(response)) {
      var newViewKeys: GetKeysForViewOutputDto[] = Object.assign([], viewKeys);
      newViewKeys.push({
        keyId: response.data.keyId,
        key: response.data.key,
        role: role,
        name: keyName,
      });
      setViewKeys(newViewKeys);
      setKeyName("");
      setRole(Role.ReadOnly);
    } else {
      setError((response as FlexlistsError).message);
    }
  };
  const onUpdateViewKeys = (newViewKeys: GetKeysForViewOutputDto[]) => {
    setViewKeys(newViewKeys);
  };
  styles = {
    shareFormWrapper: {
      display: "flex",
      alignItems: { xs: "center", md: "flex-end" },
      justifyContent: "space-evenly",
      gap: 2,
      flexDirection: { xs: "column", md: "row" },
    },
    accessRole: {
      display: "flex",
      flexDirection: "column",
      flex: { xs: "unset", md: 1.05 },
      width: { xs: "100%", md: "unset" },
    },
    usersGroupsKeys: {
      display: "flex",
      flexDirection: "column",
      flex: { xs: "unset", md: 2 },
      width: { xs: "100%", md: "unset" },
    },
    buttonWrapper: {
      width: "100%",
      flex: 1,
    },
    button: {
      height: "40px",
    },
  };
  return (
    <>
      <Box>{error && <Alert severity="error">{error}</Alert>}</Box>
      <Typography variant="subtitle2" sx={{ py: 2 }}>
        {t("Create Keys")}
      </Typography>
      {/* <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
        <Grid item xs={3} sx={{ display: "flex", flexDirection: "column" }}>
          <FormLabel>
            <Typography variant="body2">{t("Access Role")}</Typography>
          </FormLabel>
          <Select value={role} size="small" onChange={handleSelectRoleChange}>
            {roles &&
              roles.map((role, index) => {
                return (
                  <MenuItem key={index} value={role.name}>
                    {role.label}
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
        <Grid item xs={6} sx={{ display: "flex", flexDirection: "column" }}>
          <FormLabel>
            <Typography variant="body2">{t("Info")}</Typography>
          </FormLabel>
          <TextField
            size="small"
            placeholder={t("Name Key")}
            value={keyName}
            onChange={onKeyNameChange}
          ></TextField>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            // display: "flex",
            // alignItems: "flex-start",
            background: "wheat",
            height: "36px",
          }}
        >
          <Button variant="contained" fullWidth onClick={() => onSubmit()}>
            {t("Create Key")}
          </Button>
        </Grid>
      </Grid> */}
      <Box sx={styles?.shareFormWrapper}>
        <Box sx={styles?.accessRole}>
          <FormLabel>
            <Typography variant="body2">{t("Access Role")}</Typography>
          </FormLabel>
          <Select value={role} size="small" onChange={handleSelectRoleChange}>
            {roles &&
              roles.map((role, index) => {
                return (
                  <MenuItem key={index} value={role.name}>
                    {role.label}
                  </MenuItem>
                );
              })}
          </Select>
        </Box>
        <Box sx={styles?.usersGroupsKeys}>
          <FormLabel>
            <Typography variant="body2">{t("Info")}</Typography>
          </FormLabel>
          <TextField
            fullWidth
            size="small"
            placeholder={t("Name Key")}
            value={keyName}
            onChange={onKeyNameChange}
          />
        </Box>
        <Box sx={styles?.buttonWrapper}>
          <Button
            variant="contained"
            sx={styles?.button}
            fullWidth
            onClick={() => onSubmit()}
          >
            {t("Create Key")}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mt: 3, mb: 1 }}></Divider>
      <Typography sx={{ pt: 1, pb: 1 }} variant="subtitle2">
        {t("All Keys")}
      </Typography>
      <ManageKeys
        viewKeys={viewKeys}
        roles={roles}
        onUpdateViewKeys={(newViewKeys) => onUpdateViewKeys(newViewKeys)}
        currentView={currentView}
        translations={translations}
      />
    </>
  );
};
const mapStateToProps = (state: any) => ({
  users: state.view.users,
  viewGroups: state.view.viewGroups,
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setViewUsers,
  setViewGroups,
  setFlashMessage,
  getAllViewUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareList);
