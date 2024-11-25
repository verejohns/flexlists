import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Container,
  Divider,
  Snackbar,
  Alert,
  AlertColor,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Autocomplete,
  TextField,
} from "@mui/material";
import MainLayout from "src/layouts/view/MainLayout";
import { connect } from "react-redux";
import { setMessage, setViewTemplate } from "src/redux/actions/viewActions";
import { useRouter } from "next/router";
import { ListCategoryLabel } from "src/enums/ShareEnumLabels";
import { listViewService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import ViewTemplateCard from "src/sections/@listView/ViewTemplateCard";
import { PATH_MAIN } from "src/routes/paths";
import { GetServerSideProps } from "next";
import { getTranslations, getTranslation } from "src/utils/i18n";
import { TranslationText } from "src/models/SharedModels";
import { useTheme } from "@mui/material/styles";

interface ChooseTemplateProps {
  message: any;
  translations: TranslationText[];
  setMessage: (message: any) => void;
  setViewTemplate: (viewTemplate: any) => void;
}

function ChooseTemplate({
  message,
  translations,
  setMessage,
  setViewTemplate,
}: ChooseTemplateProps) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  // error handling
  const router = useRouter();
  const theme = useTheme();
  const [flash, setFlash] = useState<
    { message: string; type: string } | undefined
  >(undefined);
  const [categories, setCategories] = useState<
    { key: string; value: string }[]
  >(
    [{ key: "all", value: "All" }].concat(
      Array.from(ListCategoryLabel, function (item) {
        return { key: item[0], value: item[1] };
      })
    )
  );
  const scratchTemplate = {
    id: 0,
    icon: "/assets/icons/tour/add-icon.svg",
    name: t("New List"),
    description: t("Crreate From Scratch"),
  };
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [searchTemplateText, setSearchTemplateText] = useState<string>("");
  const [templates, setTemplates] = useState<
    { id: number; name: string; icon: string; description: string }[]
  >([scratchTemplate]);

  useEffect(() => {
    function checkMessage() {
      if (message?.message) {
        setFlash(message);
      }
    }
    checkMessage();
  }, [message]);
  useEffect(() => {
    async function fetchTemplates() {
      let response = await listViewService.getViewTemplates("", "");
      if (isSucc(response)) {
        setTemplates([scratchTemplate].concat(response.data));
      }
    }
    if (router.isReady) {
      fetchTemplates();
    }
  }, [router.isReady]);
  const flashHandleClose = () => {
    setFlash(undefined);
    setMessage(null);
  };
  function setError(message: string) {
    setFlashMessage(message);
  }
  function setFlashMessage(message: string, type: string = "error") {
    setFlash({ message: message, type: type });
    setMessage({ message: message, type: type });
  }
  const handleCategoryChange = async (event: SelectChangeEvent) => {
    setCurrentCategory(event.target.value as string);
    setSearchTemplateText("");
    let category = event.target.value as string;
    let response = await listViewService.getViewTemplates(
      category === "all" ? "" : category,
      ""
    );
    if (isSucc(response)) {
      setTemplates([scratchTemplate].concat(response.data));
    }
  };
  const handleSelectViewTemplate = (template: any) => {
    setViewTemplate(template);
    router.push({ pathname: `${PATH_MAIN.newList}` });
  };
  return (
    <MainLayout removeFooter={true} translations={translations}>
      <Container
        sx={{
          py: 3,
          maxWidth: "inherit !important",
          overflow: "hidden",
          minHeight: { xs: "100vh", md: "calc(100vh - 96px)" },
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
        <Box>
          <Typography variant="h6" gutterBottom>
            {t("Most Popular Templates")}
          </Typography>
          <Typography variant="body2">{t("Templates Description")}</Typography>
        </Box>
        <Divider light sx={{ my: 4 }}></Divider>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "center" },
            flexDirection: { xs: "column-reverse", md: "row" },
          }}
        >
          <Box
            sx={{
              minWidth: { xs: "100%", md: 300 },
              mr: { xs: 0, md: 2 },
              mt: { xs: 3, md: 0 },
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t("All Categories")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t("All Categories")}
                value={currentCategory}
                onChange={handleCategoryChange}
                MenuProps={{
                  sx: {
                    "& .MuiList-root": {
                      background: theme.palette.palette_style.background.paper,
                    },
                  },
                }}
              >
                {categories.map((category, index) => {
                  return (
                    <MenuItem key={index} value={category.key}>
                      {category.value}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              minWidth: { xs: "100%", md: 300 },
            }}
          >
            {
              <Autocomplete
                id="combo-box-view-templates"
                onChange={(event, newValue) => {
                  if (newValue) {
                    setViewTemplate(newValue);
                    router.push({ pathname: `${PATH_MAIN.newList}` });
                  }
                }}
                options={templates}
                getOptionLabel={(option) => option.name}
                // value={selectedTemplate}
                filterSelectedOptions
                sx={{ width: { xs: "100%", md: 300 } }}
                renderInput={(params) => (
                  <TextField {...params} label="Templates" />
                )}
              />
            }
          </Box>
        </Box>
        <Grid container spacing={3} sx={{ my: 0 }}>
          {/* <Grid item xs={12} sm={6} md={2}>
            <Card
              component={motion.div}
              onClick={async () => {
                await router.push("/main/views/newView");
              }}
              sx={{
                margin: "auto",
                height: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                flexDirection: "column",
              }}
              whileHover={{ scale: 1.1 }}
            >

              <CardContent sx={{ p: 0 }}>
                <Link href="/main/views/newView">
                  <Button
                    variant="contained"
                    sx={{
                      textAlign: "center !important",
                      minWidth: 32,
                      aspectRatio: "1 / 1",
                      borderRadius: "100px",
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Link>
              </CardContent>
              <CardHeader
                title="New from scratch"
                sx={{ textAlign: "center", py: 0 }}
              />
            </Card>
          </Grid> */}
          {templates.map((template: any) => {
            return (
              <Grid item xs={6} md={4} xl={2} key={template.icon}>
                <ViewTemplateCard
                  icon={template.icon ?? "/assets/icons/tour/add-icon.svg"}
                  title={template.name}
                  description={template.description}
                  onSelect={() => handleSelectViewTemplate(template)}
                ></ViewTemplateCard>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </MainLayout>
  );
}

const mapStateToProps = (state: any) => ({
  message: state.view.message,
  viewTemplate: state.view.viewTemplate,
});

const mapDispatchToProps = {
  setMessage,
  setViewTemplate,
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getTranslations("lists views", context);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseTemplate);
