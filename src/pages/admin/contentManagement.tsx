import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Tab,
  Tabs,
} from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import saveAs from "file-saver";
import { contentManagementService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { useRouter } from "next/router";
import MainLayout from "src/layouts/admin";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import ContentsBuilder from "src/sections/contentManagement/contentsBuilder";
import ContentEditor from "src/sections/contentManagement/contentsEditor";
import { Construction as BuilderIcon } from "@mui/icons-material/";
import { EditNote as EditorIcon } from "@mui/icons-material/";
import FlashMessage from "src/components/FlashMessage";
import { b64toBlob } from "src/utils/convertUtils";
import { UserProfile } from "src/models/UserProfile";
import { set } from "lodash";
import { setApiResponseStatus } from "src/redux/actions/adminAction";
import { SystemRole } from "src/enums/SystemRole";
import { ApiResponseStatus } from "src/enums/ApiResponseStatus";
import { AuthValidate } from "src/models/AuthValidate";
import { translationTextService } from "flexlists-api";
type ContentMangementProps = {
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
  userProfile: UserProfile | undefined;
  authValidate: AuthValidate | undefined;
  setApiResponseStatus: (status: ApiResponseStatus) => void;
};

const ContentManagement = ({
  setFlashMessage,
  userProfile,
  authValidate,
  setApiResponseStatus,
}: ContentMangementProps) => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("ContentBuilder");
  const [key, setKey] = useState(Date.now());
  const [tabs, setTabs] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [addMissing, setAddMissing] = useState(false);
  useEffect(() => {
    if (
      router.isReady &&
      !isLoaded &&
      ((authValidate && !authValidate.isUserValidated) ||
        (userProfile &&
          userProfile.systemRole !== SystemRole.ContentEditor &&
          userProfile.systemRole !== SystemRole.ContentManager))
    ) {
      setApiResponseStatus(ApiResponseStatus.Unauthorized);
      return;
    }
    if (router.isReady && userProfile) {
      if (userProfile.systemRole === "ContentManager") {
        getAddMissingStatus();
        setTabs([
          {
            value: "ContentBuilder",
            icon: <BuilderIcon />,
            component: <ContentsBuilder />,
          },
          {
            value: "ContentEditor",
            icon: <EditorIcon />,
            component: <ContentEditor />,
          },
        ]);
        if (!router.query.tab) {
          setCurrentTab("ContentBuilder");
        } else {
          setCurrentTab(router.query.tab as string);
        }
      } else {
        setCurrentTab("ContentEditor");
        setTabs([
          {
            value: "ContentEditor",
            icon: <EditorIcon />,
            component: <ContentEditor />,
          },
        ]);
      }
    }
    if (router.isReady) {
      setIsLoaded(true);
    }
  }, [router.isReady, userProfile, authValidate]);
  const changeTab = (value: any) => {
    window.history.pushState({}, "", "?tab=" + value);
    setCurrentTab(value);
  };
  const exportContentManagementFile = async () => {
    var response = await contentManagementService.exportContentManagement();
    if (isSucc(response)) {
      const blob = b64toBlob(response.data, "application/json");
      saveAs(blob, `contentManagement.json`);
      setFlashMessage({
        message: "Exporting Content Management Successfully",
        type: "success",
      });
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };
  const importLocalContentManagementFile = async () => {
    var response =
      await contentManagementService.importLocalContentManagement();
    if (isSucc(response)) {
      setFlashMessage({
        message: "Importing Local Content Management Successfully",
        type: "success",
      });
      router.reload();
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };
  const handleImportContentManagement = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) {
      return;
    }
    setKey(Date.now());
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      var response = await contentManagementService.importContentManagement(
        formData
      );
      if (isSucc(response)) {
        setFlashMessage({
          message: "Importing Content Management Successfully",
          type: "success",
        });
        router.reload();
      } else {
        setFlashMessage({
          message: (response as FlexlistsError).message,
          type: "error",
        });
      }
    }
  };
  const getAddMissingStatus = async () => {
    const addMissing = await translationTextService.getAddMissing();
    if (isSucc(addMissing)) setAddMissing(addMissing.data);
  };
  const handleChangeAddMissingStatus = async (status: boolean) => {
    const setAddMissingStatusResponse =
      await translationTextService.setAddMissing(status);
    if (isSucc(setAddMissingStatusResponse)) setAddMissing(status);
  };
  return (
    <MainLayout removeFooter={true}>
      <FlashMessage />
      <Box>
        <Box sx={{ float: "right", marginTop: 2, mr: 2 }}>
          {userProfile?.systemRole === SystemRole.ContentManager && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={addMissing}
                    onChange={(e) =>
                      handleChangeAddMissingStatus(e.target.checked)
                    }
                  />
                }
                label="Support Online"
              />
            </FormGroup>
          )}

          {/* <Button
            component="label"
            variant="contained"
            sx={{ marginRight: "1rem" }}
          >
            Import{" "}
            <input
              key={key}
              type="file"
              accept=".json"
              hidden
              onChange={handleImportContentManagement}
            />
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              importLocalContentManagementFile();
            }}
          >
            Local Import
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              exportContentManagementFile();
            }}
          >
            Export
          </Button> */}
        </Box>
        <Box borderBottom={"solid 1px"} borderColor={"divider"}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => changeTab(value)}
          >
            {tabs.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={tab.value}
                icon={tab.icon}
                value={tab.value}
                sx={{ minWidth: "fit-content", flex: 1 }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ mb: 5 }} />
        {tabs.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Box>
    </MainLayout>
  );
};

const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
  authValidate: state.admin.authValidate,
});

const mapDispatchToProps = {
  setFlashMessage,
  setApiResponseStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentManagement);
