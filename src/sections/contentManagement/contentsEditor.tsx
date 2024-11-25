import { useState, ChangeEvent, useEffect } from "react";
import {
  Button,
  Box,
  Card,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material";
import Scrollbar from "src/components/scrollbar";
import { connect } from "react-redux";
import { ContentManagementDto } from "src/models/ContentManagementDto";
import { contentManagementService } from "flexlists-api";
import { FlexlistsError, isErr, isSucc } from "src/models/ApiResponse";
import { useRouter } from "next/router";
import { filter } from "lodash";
import { TranslationText } from "src/models/SharedModels";
import { Language } from "src/models/Language";
import { translationTextService } from "flexlists-api";
import { TranslationKeyType } from "src/enums/SharedEnums";
import WysiwygEditor from "src/components/wysiwyg/wysiwygEditor";
import TurndownService from "turndown";
import { marked } from "marked";
import MarkdownEditor from "src/components/wysiwyg/markdownEditor";

type ContentEditorProps = {
  languages: Language[];
};
const ContentEditor = ({ languages }: ContentEditorProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [searchText, setSearchText] = useState<string>("");
  const [contentManagements, setContentManagements] = useState<
    ContentManagementDto[]
  >([]);
  const [filteredContentManagements, setFilteredContentManagements] = useState<
    ContentManagementDto[]
  >([]);
  const [selectedContentManagement, setSelectedContentManagement] =
    useState<ContentManagementDto>();
  const [translationTexts, setTranslationTexts] = useState<TranslationText[]>(
    []
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchContentManagements() {
      let response = await contentManagementService.getAllContentManagement();
      if (isSucc(response) && response.data.length > 0) {
        setContentManagements(response.data as ContentManagementDto[]);
        setFilteredContentManagements(response.data as ContentManagementDto[]);
        let selectContent = response.data[0];
        if (router.query.pageId) {
          let existContentManagement = (
            response.data as ContentManagementDto[]
          ).find((x) => x.id == parseInt(router.query.pageId as string));
          if (existContentManagement) {
            selectContent = existContentManagement;
          }
        }
        setSelectedContentManagement(selectContent);

        setSelectedLanguage(languages[0]);
        await loadTranslationTexts(selectContent.id, languages[0].id);
      }
    }
    if (router.isReady && languages && languages.length > 0) {
      fetchContentManagements();
    }
  }, [router.isReady, languages]);

  const loadTranslationTexts = async (
    contentManagementId: number,
    languageId: string
  ) => {
    let response =
      await contentManagementService.getContentManagementTranslationTexts(
        contentManagementId,
        languageId
      );
    if (isSucc(response)) {
      setTranslationTexts(response.data as TranslationText[]);
    }
  };

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
  const handleSelectContentMangement = async (
    contentManagement: ContentManagementDto
  ) => {
    setSelectedContentManagement(contentManagement);

    window.history.pushState(
      {},
      "",
      `?tab=ContentEditor&pageId=${contentManagement.id}`
    );
    loadTranslationTexts(
      contentManagement.id,
      selectedLanguage ? selectedLanguage.id : languages[0].id
    );
  };
  const onLanguageChange = async (languageId: string) => {
    setSuccessMessage("");
    setError("");
    if (!selectedContentManagement) {
      return;
    }
    let language = languages.find((x) => x.id === languageId);
    if (language) {
      let response =
        await contentManagementService.getContentManagementTranslationTexts(
          selectedContentManagement.id,
          language.id
        );
      if (isSucc(response)) {
        setTranslationTexts(response.data);
      }
      setSelectedLanguage(language);
    }
  };
  const onTranslationTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    translationText: TranslationText
  ) => {
    setSuccessMessage("");
    setError("");
    let newTranslationTexts = translationTexts.map((x) => {
      if (x.translationKeyId === translationText.translationKeyId) {
        x.translation = e.target.value;
      }
      return x;
    });
    setTranslationTexts(newTranslationTexts);
  };
  const onTranslateHtmlChange = (
    newValue: string,
    translationText: TranslationText
  ) => {
    setSuccessMessage("");
    setError("");
    let newTranslationTexts = translationTexts.map((x) => {
      if (x.translationKeyId === translationText.translationKeyId) {
        x.translation = newValue;
      }
      return x;
    });
    setTranslationTexts(newTranslationTexts);
  };
  const onTranslateMarkdownChange = (
    newValue: string,
    translationText: TranslationText
  ) => {
    setSuccessMessage("");
    setError("");
    let newTranslationTexts = translationTexts.map((x) => {
      if (x.translationKeyId === translationText.translationKeyId) {
        x.translation = newValue;
      }
      return x;
    });
    setTranslationTexts(newTranslationTexts);
  };

  const onGenerateTranslate = async (translationText: TranslationText) => {
    let newTranslationTexts = await Promise.all(
      translationTexts.map(async (x) => {
        if (x.translationKeyId === translationText.translationKeyId) {
          const _newValue = await translationTextService.translate(
            selectedLanguage!.name,
            x.translation && x.translation.trim().length > 0
              ? x.translation
              : x.translationKey
          );
          if (isErr(_newValue)) {
            setError(_newValue.message);
            return x;
          }
          x.translation = _newValue.data!;
        }
        return x;
      })
    );
    setTranslationTexts(newTranslationTexts);
  };
  const onGenerateSuggest = async (translationText: TranslationText) => {
    let newTranslationTexts = await Promise.all(
      translationTexts.map(async (x) => {
        if (x.translationKeyId === translationText.translationKeyId) {
          const _newValue = await translationTextService.suggest(
            selectedLanguage!.name,
            x.translation && x.translation.trim().length > 0
              ? x.translation
              : x.translationKey
          );
          if (isErr(_newValue)) {
            setError(_newValue.message);
            return x;
          }
          x.translation = _newValue.data!;
        }
        return x;
      })
    );
    setTranslationTexts(newTranslationTexts);
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    translationText: TranslationText
  ) => {
    setSuccessMessage("");
    setError("");
    if (event.target.files && event.target.files.length > 0) {
      await uploadContentFile(event.target.files[0], translationText);
    }
  };

  const uploadContentFile = async (
    file: File,
    translationText: TranslationText
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    let response = await contentManagementService.uploadFile(formData);
    if (isSucc(response) && response.data && response.data.fileId) {
      let newTranslationTexts = translationTexts.map((x) => {
        if (x.translationKeyId === translationText.translationKeyId) {
          x.translation = response.data.fileId;
        }
        return x;
      });
      setTranslationTexts(newTranslationTexts);
    } else {
      setError((response as FlexlistsError).message);
    }
  };

  const onSubmit = async () => {
    const turndownService = new TurndownService();
    let newTranslationTexts = translationTexts.map((x) => {
      // if (x.translationKeyType === TranslationKeyType.Markdown) {
      //   x.translation = turndownService.turndown(x.translation);
      // }
      if (x.translationKeyType === TranslationKeyType.Image) {
        x.translation = x.translation?.toString() ?? "";
      }
      return x;
    });
    let response = await translationTextService.saveManyTranslationTexts(
      newTranslationTexts
    );
    if (isSucc(response)) {
      setTranslationTexts(response.data as TranslationText[]);
      setSuccessMessage("Saved successfully");
    } else {
      setError((response as FlexlistsError).message);
    }
  };
  const downloadFileUrl = (id: string) => {
    return `${process.env.NEXT_PUBLIC_FLEXLIST_API_URL}/api/contentManagement/downloadFile?id=${id}`;
  };
  const convertMarkdownToHtml = (markdown: string): string => {
    return marked(markdown);
  };
  return (
    <>
      {/* <Container> */}
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card sx={{ p: 3, height: "80vh", overflowY: "auto" }}>
            <Box sx={{ width: "100%" }}>
              <TextField
                key={"search bar"}
                variant="standard"
                placeholder="Search.."
                value={searchText}
                onChange={onSearchTextChange}
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
                              </ListItemText>
                            </ListItemButton>
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
          <Box sx={{ p: 3, pt: 0, height: "80vh", overflowY: "auto" }}>
            <Stack>
              <Box>
                {successMessage && (
                  <Alert severity="success">{successMessage}</Alert>
                )}
              </Box>
              <Box>{error && <Alert severity="error">{error}</Alert>}</Box>
            </Stack>
            <Grid
              container
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "white !important",
                width: "100%",
                zIndex: 999,
                py: 2,
              }}
            >
              <Grid item xs={3}>
                {selectedLanguage && (
                  <Autocomplete
                    id="language-select"
                    sx={{ width: 300 }}
                    options={languages}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    value={selectedLanguage}
                    onChange={(event, value) => {
                      if (value) {
                        onLanguageChange(value.id);
                      }
                    }}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <img
                          loading="lazy"
                          width="20"
                          src={option.icon}
                          srcSet={`{option.icon} 2x`}
                          alt=""
                        />
                        {option.name}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a Language"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid item xs={9}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ float: "right" }}
                  onClick={() => onSubmit()}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            <Box
              sx={{
                pt: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {translationTexts &&
                translationTexts.map((translationText, index) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                      key={index}
                    >
                      {translationText.translationKeyType ===
                        TranslationKeyType.Text && (
                        <TextField
                          fullWidth
                          multiline
                          minRows={4}
                          key={`input - ${index}`}
                          label={translationText.translationKey}
                          value={translationText.translation}
                          onChange={(e) => {
                            onTranslationTextChange(e, translationText);
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                      {translationText.translationKeyType ===
                        TranslationKeyType.Image && (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {translationText.translationKey}
                          </Typography>
                          <Box
                            component="img"
                            sx={
                              {
                                // height: 233,
                                // width: 350,
                                // maxHeight: { xs: 233, md: 167 },
                                // maxWidth: { xs: 350, md: 250 },
                              }
                            }
                            alt="no-image"
                            src={
                              translationText.translation
                                ? downloadFileUrl(translationText.translation)
                                : ""
                            }
                          />
                          <Box>
                            <input
                              type="file"
                              name="upload"
                              onChange={(e) =>
                                handleFileChange(e, translationText)
                              }
                            />
                          </Box>
                        </Box>
                      )}
                      {translationText.translationKeyType ===
                        TranslationKeyType.Html && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            {translationText.translationKey}
                          </Typography>
                          <WysiwygEditor
                            value={translationText.translation}
                            setValue={(newValue) =>
                              onTranslateHtmlChange(newValue, translationText)
                            }
                          />
                        </Box>
                      )}
                      {translationText.translationKeyType ===
                        TranslationKeyType.Markdown && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            {translationText.translationKey}
                          </Typography>
                          <MarkdownEditor
                            markdown={translationText.translation}
                            setMarkdown={(newValue) => {
                              onTranslateMarkdownChange(
                                newValue,
                                translationText
                              );
                            }}
                          />
                          {/* <WysiwygEditor
                            value={markdownToHtml(
                              translationText.translation
                            )}
                            setValue={(newValue) =>
                              onTranslateMarkdownChange(
                                newValue,
                                translationText
                              )
                            }
                          /> */}
                        </Box>
                      )}
                      <Box
                        sx={{
                          pt: 1,
                          display: "flex",
                          flexDirection: "row",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={async () => {
                            await onGenerateTranslate(translationText);
                          }}
                        >
                          Generate
                        </Button>
                        <Button
                          variant="contained"
                          onClick={async () => {
                            await onGenerateSuggest(translationText);
                          }}
                        >
                          Suggest
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* </Container> */}
    </>
  );
};
const mapStateToProps = (state: any) => ({
  languages: state.admin.languages,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ContentEditor);
