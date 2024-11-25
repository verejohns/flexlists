import { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Scrollbar from "src/components/scrollbar";
import ContentMangementForm from "src/sections/admin/ContentMangementForm";
import { connect } from "react-redux";
import CommonMoreMenu from "src/components/menu/CommonMoreMenu";
import { ContentManagementDto } from "src/models/ContentManagementDto";
import { contentManagementService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { useRouter } from "next/router";
import { filter } from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TranslationKeyForm from "src/sections/admin/TranslationKeyForm";
import { TranslationKeyDto } from "src/models/TranslationKeyDto";
import { TranslationKeyType } from "src/enums/SharedEnums";
import { useTheme } from "@mui/material/styles";
import { UserProfile } from "src/models/UserProfile";

type ContentBuilderProps = {
  userProfile: UserProfile;
};
const ContentBuilder = ({ userProfile }: ContentBuilderProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [contentManagements, setContentManagements] = useState<
    ContentManagementDto[]
  >([]);
  const [filteredContentManagements, setFilteredContentManagements] =
    useState<ContentManagementDto[]>(contentManagements);
  const newContentManagement: ContentManagementDto = {
    id: 0,
    name: "",
    type: "",
    publishedDate: new Date(),
    slug: "",
    ownerId: 0,
  };
  const [selectedContentManagement, setSelectedContentManagement] =
    useState<ContentManagementDto>(newContentManagement);
  const [isContentMangementFormOpen, setIsContentMangementFormOpen] =
    useState<boolean>(false);

  //translation key form
  const [translationKeys, setTranslationKeys] = useState<TranslationKeyDto[]>(
    []
  );
  const [isTranslationKeyFormOpen, setIsTranslationKeyFormOpen] =
    useState<boolean>(false);
  const newTranslationKey: TranslationKeyDto = {
    id: 0,
    name: "",
    type: TranslationKeyType.Text,
    contentManagementId: 0,
    reusable: false,
  };
  const [selectedTranslationKey, setSelectedTranslationKey] =
    useState<TranslationKeyDto>(newTranslationKey);

  useEffect(() => {
    async function fetchData() {
      let response = await contentManagementService.getAllContentManagement();
      if (isSucc(response)) {
        setContentManagements(response.data as ContentManagementDto[]);
        setFilteredContentManagements(response.data as ContentManagementDto[]);
        let selectContent =
          response.data.length > 0 ? response.data[0] : newContentManagement;
        if (router.query.pageId) {
          let existContentManagement = (
            response.data as ContentManagementDto[]
          ).find((x) => x.id == parseInt(router.query.pageId as string));
          if (existContentManagement) {
            selectContent = existContentManagement;
          }
        }
        setSelectedContentManagement(selectContent);
        if (response.data.length > 0) {
          let translationKeysResponse =
            await contentManagementService.getTranslationKeysOfContentManagement(
              selectContent.id
            );
          if (isSucc(translationKeysResponse)) {
            setTranslationKeys(
              translationKeysResponse.data as TranslationKeyDto[]
            );
          }
        }
      }
    }
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);
  const onSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    searchContentManagement(e.target.value);
  };
  const searchContentManagement = (search: string) => {
    var newContentManagements = filter(
      contentManagements,
      (contentManagement) => {
        return (
          (search &&
            contentManagement.name
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          search === ""
        );
      }
    );
    setFilteredContentManagements(newContentManagements);
  };
  const refreshSearch = (newContentManagements: ContentManagementDto[]) => {
    setSearchText("");
    setFilteredContentManagements(newContentManagements);
  };
  const handleAddContentManagement = () => {
    let contentMangement = Object.assign({}, newContentManagement);
    if (userProfile) {
      contentMangement.ownerId = userProfile.id;
    }
    setSelectedContentManagement(contentMangement);
    setIsContentMangementFormOpen(true);
  };
  const handleSelectContentMangement = async (
    contentManagement: ContentManagementDto
  ) => {
    setSelectedContentManagement(contentManagement);
    window.history.pushState(
      {},
      "",
      `?tab=ContentBuilder&pageId=${contentManagement.id}`
    );
    let translationKeysResponse =
      await contentManagementService.getTranslationKeysOfContentManagement(
        contentManagement.id
      );
    if (isSucc(translationKeysResponse)) {
      setTranslationKeys(translationKeysResponse.data as TranslationKeyDto[]);
    }
  };
  const handleRenameContentManagement = () => {
    setIsContentMangementFormOpen(true);
  };
  const handleDeleteContentManagement = async () => {
    if (selectedContentManagement.id) {
      let response = await contentManagementService.deleteContentManagement(
        selectedContentManagement.id
      );
      if (isSucc(response)) {
        let newContentManagements = contentManagements.filter(
          (contentManagement) =>
            contentManagement.id !== selectedContentManagement.id
        );
        setContentManagements(newContentManagements);
        refreshSearch(newContentManagements);
        setSelectedContentManagement(
          newContentManagements.length > 0
            ? newContentManagements[0]
            : newContentManagement
        );
      }
    }
  };
  const onAddContentManagement = (contentManagement: ContentManagementDto) => {
    let newContentManagements = [...contentManagements];
    newContentManagements.push(contentManagement);
    setContentManagements(newContentManagements);
    refreshSearch(newContentManagements);
    setSelectedContentManagement(contentManagement);
    setTranslationKeys([]);
  };
  const onUpdateContentManagement = (
    contentManagement: ContentManagementDto
  ) => {
    let newContentManagements = [...contentManagements];
    let index = newContentManagements.findIndex(
      (contentManagement) =>
        contentManagement.id === selectedContentManagement.id
    );
    if (index >= 0) {
      newContentManagements[index] = contentManagement;
      setContentManagements(newContentManagements);
      refreshSearch(newContentManagements);
      setSelectedContentManagement(contentManagement);
    }
  };
  //translation key
  const handleAddTranslationKey = () => {
    let translationKey = Object.assign({}, newTranslationKey);
    translationKey.contentManagementId = selectedContentManagement.id;
    setSelectedTranslationKey(translationKey);
    setIsTranslationKeyFormOpen(true);
  };
  const handleUpdateTranslationKey = (translationKey: TranslationKeyDto) => {
    setSelectedTranslationKey(translationKey);
    setIsTranslationKeyFormOpen(true);
  };
  const onUpdateTranslationKey = (translationKey: TranslationKeyDto) => {
    let newTranslationKeys = [...translationKeys];
    let index = newTranslationKeys.findIndex(
      (translationKey) => translationKey.id === selectedTranslationKey.id
    );
    if (index >= 0) {
      newTranslationKeys[index] = translationKey;
      setTranslationKeys(newTranslationKeys);
    }
  };
  const onAddTranslationKey = (translationKey: TranslationKeyDto) => {
    let newTranslationKeys = [...translationKeys];
    newTranslationKeys.push(translationKey);
    setTranslationKeys(newTranslationKeys);
  };
  const handleDeleteTranslationKey = async (translationKeyId: number) => {
    let response =
      await contentManagementService.deleteTranslationKeyFromContentManagement(
        selectedContentManagement.id,
        translationKeyId
      );
    if (isSucc(response)) {
      let newTranslationKeys = translationKeys.filter(
        (translationKey) => translationKey.id !== translationKeyId
      );
      setTranslationKeys(newTranslationKeys);
    }
  };
  return (
    <>
      {/* <Container> */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card sx={{ p: 3, minHeight: "80vh" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <TextField
                key={"search bar"}
                placeholder="Search.."
                value={searchText}
                onChange={onSearchTextChange}
                variant="standard"
                sx={{ flex: 1 }}
                // InputProps={{ sx: { height: "36px" } }}
              />
              <Button
                type="button"
                variant="contained"
                sx={{ ml: 1 }}
                onClick={() => {
                  handleAddContentManagement();
                }}
              >
                Add New
              </Button>
            </Box>
            <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
              <Scrollbar
                sx={{
                  height: "100%",
                  "& .simplebar-content": {
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  },
                }}
              >
                <Box>
                  <List>
                    {filteredContentManagements.map(
                      (contentManagement, index) => {
                        return (
                          <ListItem
                            disablePadding
                            key={index}
                            style={{
                              color:
                                selectedContentManagement &&
                                selectedContentManagement.id ===
                                  contentManagement.id
                                  ? theme.palette.palette_style.text.white
                                  : "",
                              backgroundColor:
                                selectedContentManagement &&
                                selectedContentManagement.id ===
                                  contentManagement.id
                                  ? theme.palette.palette_style.text.selected
                                  : "",
                            }}
                          >
                            <ListItemButton
                              onClick={() =>
                                handleSelectContentMangement(contentManagement)
                              }
                            >
                              <ListItemText>
                                {contentManagement.name}
                                {contentManagement.type &&
                                contentManagement.type.length > 0
                                  ? `(${contentManagement.type})`
                                  : ""}
                              </ListItemText>
                            </ListItemButton>
                            {selectedContentManagement &&
                              selectedContentManagement.id ==
                                contentManagement.id && (
                                <CommonMoreMenu
                                  editPermissionEnable={false}
                                  deletePermissionEnable={true}
                                  onDelete={() =>
                                    handleDeleteContentManagement()
                                  }
                                  onEdit={() => {}}
                                  onOtherFunctions={[
                                    {
                                      name: "Rename",
                                      function: () =>
                                        handleRenameContentManagement(),
                                    },
                                  ]}
                                />
                              )}
                          </ListItem>
                        );
                      }
                    )}
                  </List>
                </Box>
              </Scrollbar>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Card sx={{ p: 3, pb: 0, height: "80vh", overflowY: "scroll" }}>
            {translationKeys &&
              translationKeys.length > 0 &&
              translationKeys.map((translationKey, index) => {
                return (
                  <Stack
                    sx={{
                      display: "flex",
                      mb: 2,
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <Box component={"span"}>{translationKey.name}</Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box>
                        <Typography
                          sx={{
                            color: theme.palette.palette_style.text.selected,
                          }}
                          variant="subtitle2"
                          component={"span"}
                        >
                          {translationKey.type}
                        </Typography>
                      </Box>
                      <Box
                        onClick={() =>
                          handleUpdateTranslationKey(translationKey)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <EditIcon
                          sx={{
                            color: theme.palette.palette_style.text.selected,
                          }}
                        />
                        <Typography
                          sx={{
                            color: theme.palette.palette_style.text.selected,
                          }}
                          variant="subtitle2"
                          component={"span"}
                        >
                          Edit
                        </Typography>
                      </Box>
                      <Box
                        onClick={() =>
                          handleDeleteTranslationKey(translationKey.id)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            color: theme.palette.palette_style.error.main,
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          component={"span"}
                          sx={{
                            color: theme.palette.palette_style.error.main,
                          }}
                        >
                          Delete
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                );
              })}
            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{
                justifyContent: "flex-end",
                position: "sticky",
                bottom: 0,
                right: 0,
                py: 2,
                mr: 3,
                backgroundColor: "white",
                width: "100%",
                borderTop: "1px solid",
                borderColor: theme.palette.palette_style.grey[200],
              }}
              spacing={5}
            >
              {selectedContentManagement &&
                selectedContentManagement.id > 0 && (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                      handleAddTranslationKey();
                    }}
                  >
                    Add Key
                  </Button>
                )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <ContentMangementForm
        currentContentManagement={selectedContentManagement}
        open={isContentMangementFormOpen}
        handleClose={() => setIsContentMangementFormOpen(false)}
        onAdd={onAddContentManagement}
        onUpdate={onUpdateContentManagement}
      />
      {isTranslationKeyFormOpen && (
        <TranslationKeyForm
          currentTranslationKey={selectedTranslationKey}
          open={isTranslationKeyFormOpen}
          handleClose={() => setIsTranslationKeyFormOpen(false)}
          onAdd={onAddTranslationKey}
          onUpdate={onUpdateTranslationKey}
          contentTranslationKeys={translationKeys}
        />
      )}

      {/* </Container> */}
    </>
  );
};
const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ContentBuilder);
