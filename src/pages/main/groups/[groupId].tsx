import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/view/MainLayout";
import {
  Grid,
  Box,
  Button,
  Typography,
  Divider,
  OutlinedInput,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material/Select";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import GroupMembers from "src/sections/groups/groupMembers";
import ViewCard from "src/sections/@view/ViewCard";
import { useRouter } from "next/router";
import {
  GetGroupViewsOutputDto,
  GetUserGroupByIdOutputDto,
  GetUserGroupsOutputDto,
} from "src/models/ApiOutputModels";
import { groupService } from "flexlists-api";
import { convertToInteger } from "src/utils/convertUtils";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { connect } from "react-redux";
import CentralModal from "src/components/modal/CentralModal";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { setFlashMessage } from "src/redux/actions/authAction";
import WysiwygView from "src/components/wysiwyg/wysiwygView";
import WysiwygEditor from "src/components/wysiwyg/wysiwygEditor";
import { GetServerSideProps } from "next";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { fileService } from "flexlists-api";
import { useTheme } from "@mui/material/styles";
import GroupAvatar from "src/components/avatar/GroupAvatar";
import { createFileObject, FileImpl } from "flexlists-api";

const activeButtonStyle: React.CSSProperties = {
  // border: "1px solid #eee",
  background: "#54A6FB",
  width: "40px",
  height: "40px",
  color: "#fff",
  borderRadius: "4px",
  transition: "all ease .2s ",
};

const inactiveButtonStyle: React.CSSProperties = {
  // border: "1px solid #eee",
  background: "rgba(145, 158, 171, .08)",
  width: "40px",
  height: "40px",
  color: "#54A6FB",
  borderRadius: "4px",
  transition: "all ease .2s ",
};

const GridViewButton = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      style={active ? activeButtonStyle : inactiveButtonStyle}
      onClick={onClick}
    >
      <GridViewIcon />
    </Box>
  );
};

const ListViewButton = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      style={active ? activeButtonStyle : inactiveButtonStyle}
      onClick={onClick}
    >
      <ViewListIcon />
    </Box>
  );
};

type GroupDetailProps = {
  translations: TranslationText[];
  setFlashMessage: (flashMessage: FlashMessageModel) => void;
};

const GroupDetail = ({ translations, setFlashMessage }: GroupDetailProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();
  const [groupViews, setGroupViews] = useState<GetGroupViewsOutputDto[]>([]);
  const [filterGroupViews, setFilterGroupViews] = useState<
    GetGroupViewsOutputDto[]
  >([]);
  const [searchViewText, setSearchViewText] = useState<string>("");
  const [currentGroup, setCurrentGroup] = useState<GetUserGroupByIdOutputDto>();
  const [isRenameGroupOpenModal, setIsRenameGroupOpenModal] =
    useState<boolean>(false);
  const [isGrid, setIsGrid] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      if (router.query.groupId) {
        const getGroupViewsResponse = await groupService.getGroupViews(
          convertToInteger(router.query.groupId)
        );

        if (isSucc(getGroupViewsResponse) && getGroupViewsResponse.data) {
          setGroupViews(getGroupViewsResponse.data);
          setFilterGroupViews(getGroupViewsResponse.data);
        }

        const groupsResponse = await groupService.getUserGroupById(
          convertToInteger(router.query.groupId)
        );

        if (isSucc(groupsResponse) && groupsResponse.data) {
          setCurrentGroup(groupsResponse.data);
        }
      }
    }

    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  const handleChange = (event: SelectChangeEvent) => {};

  const handleGridView = () => {
    setIsGrid(true);
  };

  const handleListView = () => {
    setIsGrid(false);
  };

  const onOpenRenameModal = () => {
    setIsRenameGroupOpenModal(true);
  };

  const handleUpdateGroup = (newGroup: GetUserGroupsOutputDto) => {
    setCurrentGroup(newGroup);
  };

  const handleSearchView = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterViews = groupViews.filter(
      (x) => !event.target.value || x.tableViewName.includes(event.target.value)
    );

    setSearchViewText(event.target.value);
    setFilterGroupViews(filterViews);
  };

  return (
    <MainLayout translations={translations}>
      <Grid container>
        <Grid item xs={12} lg={10} sx={{ p: 2 }}>
          <Grid container rowGap={2}>
            <Grid item xs={12} md={8} lg={11}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <GroupAvatar
                  avatarUrl={currentGroup?.avatarUrl || ""}
                  name={currentGroup?.name || ""}
                  color={currentGroup?.color || ""}
                  size={128}
                  groupId={currentGroup?.groupId}
                />
                <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h6">{currentGroup?.name}</Typography>
                    </Box>
                  </Box>
                  <WysiwygView value={currentGroup?.description} />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              lg={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Button variant="contained" onClick={() => onOpenRenameModal()}>
                {t("Edit Group")}
              </Button>
            </Grid>
          </Grid>
          <Divider light sx={{ my: 2 }}></Divider>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <OutlinedInput
                id="outlined-adornment"
                placeholder="Search views"
                size="small"
                value={searchViewText}
                onChange={handleSearchView}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
              {/* <Select
                value={sort}
                variant="standard"
                defaultValue="1"
                onChange={handleChange}
                sx={{ minWidth: 120, ml: 3 }}
              >
                <MenuItem value="1">Sort by date modifed down</MenuItem>
                <MenuItem value="2">Sort by date modifed up</MenuItem>
                <MenuItem value="3">Sort by 3</MenuItem>
              </Select> */}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GridViewButton active={isGrid} onClick={handleGridView} />
              <ListViewButton active={!isGrid} onClick={handleListView} />
            </Box>
          </Box>
          <Divider light sx={{ my: 2 }}></Divider>
          {isGrid ? (
            <Grid container spacing={2} sx={{ my: 2 }}>
              {filterGroupViews &&
                filterGroupViews.map((view, index) => {
                  return (
                    <Grid item md={2} key={index}>
                      <ViewCard
                        isViewDefault={view.isDefaultView}
                        id={view.tableViewId}
                        viewName={view.tableViewName}
                        viewDesc={""}
                        bgImage={"/assets/home/heroimg.png"}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          ) : (
            <Grid container spacing={2} sx={{ my: 2 }}>
              {filterGroupViews.map((view, index) => {
                return (
                  <Grid item md={12} key={index}>
                    <ViewCard
                      isViewDefault={view.isDefaultView}
                      id={view.tableViewId}
                      viewName={view.tableViewName}
                      viewDesc={""}
                      bgImage={"/assets/home/heroimg.png"}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          lg={2}
          sx={{
            p: 2,
            height: "calc(100vh - 48px)",
            background: theme.palette.palette_style.background.paper,
          }}
        >
          <GroupMembers translations={translations} />
        </Grid>
      </Grid>
      {currentGroup && (
        <RenameGroup
          group={currentGroup}
          handleClose={() => setIsRenameGroupOpenModal(false)}
          open={isRenameGroupOpenModal}
          onUpdate={(newGroup) => handleUpdateGroup(newGroup)}
          setFlashMessage={setFlashMessage}
          translations={translations}
        />
      )}
    </MainLayout>
  );
};

const mapStateToProps = (state: any) => ({
  groups: state.group.groups,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("groups", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetail);

type RenameGroupProps = {
  translations: TranslationText[];
  open: boolean;
  group: GetUserGroupsOutputDto;
  handleClose: () => void;
  onUpdate: (newGroup: GetUserGroupsOutputDto) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const RenameGroup = ({
  translations,
  open,
  group,
  handleClose,
  onUpdate,
  setFlashMessage,
}: RenameGroupProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [windowHeight, setWindowHeight] = useState(0);
  const [currentGroup, setCurrentGroup] =
    useState<GetUserGroupsOutputDto>(group);
  const [errors, setErrors] = useState<{ [key: string]: string | boolean }>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const handleGroupNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newGroup = Object.assign({}, currentGroup);

    newGroup.name = event.target.value;

    setIsUpdate(true);
    setCurrentGroup(newGroup);
  };

  const handleGroupDescriptionChange = (newValue: string) => {
    const newGroup = Object.assign({}, currentGroup);

    newGroup.description = newValue;

    setIsUpdate(true);
    setCurrentGroup(newGroup);
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

    const response = await groupService.updateUserGroup(
      currentGroup.groupId,
      currentGroup.name,
      currentGroup.description,
      currentGroup.avatarUrl
    );

    if (isSucc(response)) {
      setIsUpdate(false);
      onUpdate(currentGroup);
      handleClose();
    } else {
      setError((response as FlexlistsError).message);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsUpdate(true);

      const newGroup = Object.assign({}, currentGroup);
      const file = event.target.files[0];
      newGroup.avatarUrl = createFileObject(
        file.name,
        file,
        file.type,
        file.size
      );
      setCurrentGroup(newGroup);

      // const formData = new FormData();

      // formData.append("file", event.target.files[0]);

      // const response = await uploadGroupAvatar(
      //   currentGroup.groupId,
      //   formData,
      //   setProgress
      // );

      // if (isSucc(response) && response.data && response.data.fileId) {
      //   const newGroup = Object.assign({}, currentGroup);

      //   newGroup.avatarUrl = response.data.fileId;

      //   setCurrentGroup(newGroup);
      // } else {
      //   setFlashMessage({
      //     message: (response as FlexlistsError).message,
      //     type: "error",
      //   });
      // }
    }
  };

  const handleDeleteAvatar = () => {
    const newGroup = Object.assign({}, currentGroup);

    newGroup.avatarUrl = "";
    setIsUpdate(true);
    setCurrentGroup(newGroup);
  };

  return (
    <CentralModal open={open} handleClose={handleClose} zIndex={1200}>
      <Typography variant="h6">{t("Rename Group")}</Typography>
      <Divider sx={{ my: 2 }}></Divider>
      <Box
        sx={{ display: "flex", alignItems: "center", mt: "15px", mb: "20px" }}
      >
        <GroupAvatar
          avatarUrl={currentGroup?.avatarUrl || ""}
          name={currentGroup?.name || ""}
          color={currentGroup?.color || ""}
          size={128}
          groupId={currentGroup?.groupId}
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
      <Box>
        {/* <Typography variant="subtitle2">{t("Name")}</Typography> */}
        <TextField
          fullWidth
          onChange={handleGroupNameChange}
          value={currentGroup?.name}
          // placeholder="Name"
          label="Name"
          InputLabelProps={{
            shrink: true,
          }}
          required
          error={isSubmit && isFrontendError(FieldValidatorEnum.name, errors)}
        />
      </Box>
      <Box
        sx={{
          position: "relative",
          mt: 2,
          "& .ql-container": {
            border: `1px solid ${
              theme.palette.mode === "light"
                ? "#ccc"
                : "rgba(255, 255, 255, 0.23)"
            } !important`,
            borderTop: "none !important",
            "& .ql-editor p": {
              px: 2,
            },
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            transform: "translate(-4px, -12px) scale(0.75)",
            px: 0.5,
            color:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.7)",
            position: "absolute",
            top: 0,
            left: 0,
            background: theme.palette.palette_style.background.paper,
          }}
        >
          {t("Description")}
        </Typography>
        <WysiwygEditor
          value={currentGroup.description}
          setValue={(newValue) => handleGroupDescriptionChange(newValue)}
        />
        {/* <TextField
          multiline
          rows={4}
          fullWidth
          value={currentGroup?.description}
          onChange={handleGroupDescriptionChange}
        /> */}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          disabled={!isUpdate}
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => onSubmit()}
        >
          {t("Update")}
        </Button>
        <Button onClick={handleClose} sx={{ mt: 2, ml: 2 }} variant="text">
          {t("Cancel")}
        </Button>
      </Box>
    </CentralModal>
  );
};
