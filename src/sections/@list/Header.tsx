import { useEffect, useState } from "react";
import { Button, Box, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Iconify from "../../components/iconify";
import ToolBar from "./ToolBar";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import useResponsive from "../../hooks/useResponsive";
import ViewUsersList from "./UserList";
import { connect } from "react-redux";
import ChatFormPanel from "src/sections/@list/chat/ChatFormPanel";
import PublishList from "./Publish";
import ShareList from "./Share";
import { View } from "src/models/SharedModels";
import RenameView from "./RenameView";
import DuplicateView from "./DuplicateView";
import DeleteView from "./DeleteView";
import { ChatType } from "src/enums/ChatType";
import { hasPermission } from "src/utils/permissionHelper";
import YesNoDialog from "src/components/dialog/YesNoDialog";
import { listChatService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/utils/responses";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { useRouter } from "next/router";
import { PATH_MAIN } from "src/routes/paths";
import EditViewConfigForm from "../@listView/EditViewConfigForm";
import { ViewType } from "src/enums/SharedEnums";
import { renderHTML, convertToInteger } from "src/utils/convertUtils";
import { listViewService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { listService } from "flexlists-api";
import RefreshIcon from "@mui/icons-material/Refresh";
import RemigrateView from "./RemigrateView";
import CloneList from "./CloneList";
import { is } from "date-fns/locale";

type HeaderProps = {
  currentView: View;
  translations: TranslationText[];
  setFlashMessage: (message: FlashMessageModel) => void;
  handleRefresh: () => void;
};

const Header = ({
  currentView,
  translations,
  setFlashMessage,
  handleRefresh,
}: HeaderProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const theme = useTheme();

  const [isFavorite, setIsFavorite] = useState(true);
  const [open, setOpen] = useState(true);
  const [openPublish, setOpenPublish] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const isDesktop = useResponsive("up", "md");
  const [visiblePanel, setVisiblePanel] = useState(false);
  const [isRenameOpenModal, setIsRenameOpenModal] = useState<boolean>(false);
  const [isDuplicateOpenModal, setIsDuplicateOpenModal] =
    useState<boolean>(false);
  const [isDeleteOpenModal, setIsDeleteOpenModal] = useState<boolean>(false);
  const [isArchiveOpenModal, setIsArchiveOpenModal] = useState<boolean>(false);
  const [isDeleteListOpenModal, setIsDeleteListOpenModal] =
    useState<boolean>(false);
  const [isEditViewConfigOpenModal, setIsEditViewConfigOpenModal] =
    useState<boolean>(false);
  const [parentViews, setParentViews] = useState<any[]>([]);
  // const handleNewRow = (values: any, action: string) => {
  //   rows.push(values);
  //   setRows([...rows]);
  // };

  const [showIcons, setShowIcons] = useState(false);
  const [isRemigrateOpenModal, setIsRemigrateOpenModal] =
    useState<boolean>(false);
  const [isTruncateListOpenModal, setIsTruncateListOpenModal] =
    useState<boolean>(false);
  const [isCloneListOpenModal, setIsCloneListOpenModal] =
    useState<boolean>(false);
  useEffect(() => {
    const getParentViews = async (ppids: string[], cpids: string[]) => {
      const response = await listViewService.getViews();

      if (isSucc(response)) {
        const allParents = [];

        ppids.map((ppid: string, index: number) => {
          const ppidArray = ppid.split("-");

          allParents.push({
            parentView: response.data.find(
              (view: View) => view.id === convertToInteger(ppidArray[0])
            ),
            contentId: ppidArray[2],
            param: getSubParams(ppids, index),
          });
        });

        allParents.push({
          parentView: response.data.find(
            (view: View) => view.id === convertToInteger(cpids[0])
          ),
          contentId: cpids[2],
          param: getSubParams(ppids, ppids.length),
        });
        setParentViews(allParents);
      }
    };

    if (router.query.cpid) {
      const cpids =
        typeof router.query.cpid === "string"
          ? router.query.cpid.split("-")
          : router.query.cpid;

      getParentViews(
        router.query.ppid && typeof router.query.ppid === "string"
          ? router.query.ppid.split(";")
          : [],
        cpids
      );
    }
  }, [router.isReady]);

  const getSubParams = (ppids: string[], index: number) => {
    if (index === 0) return "";
    else if (index === 1) return `cpid=${ppids[0]}&`;
    else {
      const cpid = ppids[index - 1];
      const ppid = ppids.slice(0, -1).join(";");

      return `ppid=${ppid}&cpid=${cpid}&`;
    }
  };

  const handleBoxClick = () => {
    setShowIcons(!showIcons);
  };

  const handleOpenPublish = () => {
    setOpenPublish(true);
  };

  const handleClosePublish = () => {
    setOpenPublish(false);
  };

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  const handleOpenRenameModal = () => {
    setIsRenameOpenModal(true);
  };
  const handleOpenRemigrateModal = () => {
    setIsRemigrateOpenModal(true);
  };

  const handleOpenDuplicateModal = () => {
    setIsDuplicateOpenModal(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteOpenModal(true);
  };
  const handleOpenArchiveModal = () => {
    setIsArchiveOpenModal(true);
  };

  const handleOpenEditViewConfigModal = () => {
    setIsEditViewConfigOpenModal(true);
  };

  const handleArchive = async () => {
    setIsArchiveOpenModal(false);
    let response = await listViewService.archiveView(currentView?.id);
    if (isSucc(response)) {
      setFlashMessage({
        message: "View archived successfully",
        type: "success",
      });
      await router.push({ pathname: PATH_MAIN.views });
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };

  const handleUnArchive = async () => {
    setIsArchiveOpenModal(false);
    let response = await listViewService.unArchiveView(currentView?.id);
    if (isSucc(response)) {
      setFlashMessage({
        message: "View unarchived successfully",
        type: "success",
      });
      await router.push({ pathname: PATH_MAIN.views });
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };
  const handleDeleteList = async () => {
    setIsDeleteListOpenModal(true);
  };
  const deleteList = async () => {
    setIsDeleteListOpenModal(false);
    let response = await listService.softDeleteList(currentView?.listId);
    if (isSucc(response)) {
      setFlashMessage({
        message: "List deleted successfully",
        type: "success",
      });
      await router.push({ pathname: PATH_MAIN.lists });
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };
  const handleTruncateList = async () => {
    setIsTruncateListOpenModal(true);
  };
  const truncateList = async () => {
    setIsTruncateListOpenModal(false);
    let response = await listService.truncateList(currentView?.id);
    if (isSucc(response)) {
      setFlashMessage({
        message: "List truncate successfully",
        type: "success",
      });
      handleRefresh();
    } else {
      setFlashMessage({
        message: (response as FlexlistsError).message,
        type: "error",
      });
    }
  };
  const handleCloneList = async () => {
    setIsCloneListOpenModal(true);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
        px: { xs: 0.5, lg: 2 },
        py: { xs: 1, lg: 0 },
        width: "100%",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: { xs: 18, md: 20 },
              height: { xs: 18, md: 20 },
              bgcolor: isFavorite ? "#FFD789" : "#666",
              mask: `url(/assets/icons/star.svg) no-repeat center / contain`,
              WebkitMask: `url(/assets/icons/star.svg) no-repeat center / contain`,
              cursor: "pointer",
            }}
            onClick={() => {
              setIsFavorite(!isFavorite);
            }}
          />
          <Typography
            variant="body1"
            sx={{
              marginLeft: { xs: 0.3, md: 0.5 },
              marginTop: "1px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: { xs: 100, lg: 250, xl: 256 },
            }}
          >
            {parentViews.map((parentView: any) => (
              <span
                key={`${parentView.parentView.id}?${parentView.param}contentId=${parentView.contentId}`}
              >
                <Link
                  href={`/main/views/${parentView.parentView.id}?${parentView.param}contentId=${parentView.contentId}`}
                  underline="none"
                >
                  {parentView.parentView.name}
                </Link>
                &#10230;
              </span>
            ))}
            {renderHTML(currentView?.name)}
          </Typography>
          {hasPermission(currentView?.role, "All") && (
            <CDropdown id="list_action" className="list_action">
              <CDropdownToggle
                // color="secondary"
                style={{ paddingTop: 0, display: "flex" }}
              >
                <Box
                  component="span"
                  className="svg-color"
                  sx={{
                    width: { xs: 12, lg: 16 },
                    height: { xs: 12, lg: 16 },
                    display: "inline-block",
                    bgcolor: theme.palette.palette_style.text.primary,
                    mask: `url(/assets/icons/dots.svg) no-repeat center / contain`,
                    WebkitMask: `url(/assets/icons/dots.svg) no-repeat center / contain`,
                    marginLeft: { xs: 0.5, lg: 1 },
                    cursor: "pointer",
                    transform: "rotate(90deg)",
                  }}
                />
              </CDropdownToggle>
              <CDropdownMenu
                style={{
                  background: theme.palette.palette_style.background.paper,
                }}
              >
                <CDropdownItem
                  style={{ color: theme.palette.palette_style.text.primary }}
                  href="#"
                  key={"rename_list"}
                  onClick={() => handleOpenRenameModal()}
                >
                  {currentView?.isDefaultView
                    ? t("Rename List")
                    : t("Rename View")}
                </CDropdownItem>
                {currentView?.isDefaultView && (
                  <CDropdownItem
                    style={{ color: theme.palette.palette_style.text.primary }}
                    href="#"
                    key={"clone_list"}
                    onClick={() => handleCloneList()}
                  >
                    {t("Clone List")}
                  </CDropdownItem>
                )}
                {currentView?.isDefaultView && (
                  <CDropdownItem
                    style={{ color: theme.palette.palette_style.text.primary }}
                    href="#"
                    key={"delete_list"}
                    onClick={() => handleDeleteList()}
                  >
                    {t("Delete List")}
                  </CDropdownItem>
                )}
                {currentView?.isDefaultView && currentView.isLegacy && (
                  <CDropdownItem
                    style={{ color: theme.palette.palette_style.text.primary }}
                    href="#"
                    key={"remigrate_list"}
                    onClick={() => handleOpenRemigrateModal()}
                  >
                    {t("Remigrate List")}
                  </CDropdownItem>
                )}
                {currentView?.isDefaultView && (
                  <CDropdownItem
                    style={{ color: theme.palette.palette_style.text.primary }}
                    href="#"
                    key={"truncate_list"}
                    onClick={() => handleTruncateList()}
                  >
                    {t("Truncate List")}
                  </CDropdownItem>
                )}
                {!currentView?.isDefaultView && (
                  <>
                    <CDropdownItem
                      style={{
                        color: theme.palette.palette_style.text.primary,
                      }}
                      href="#"
                      key={"duplicate_list"}
                      onClick={() => handleOpenDuplicateModal()}
                    >
                      {t("Duplicate View")}
                    </CDropdownItem>
                    <CDropdownItem
                      style={{
                        color: theme.palette.palette_style.text.primary,
                      }}
                      href="#"
                      key={"delete_list"}
                      onClick={() => handleOpenDeleteModal()}
                    >
                      {t("Delete View")}
                    </CDropdownItem>
                    {currentView?.isArchived ? (
                      <CDropdownItem
                        style={{
                          color: theme.palette.palette_style.text.primary,
                        }}
                        href="#"
                        key={"unarchive_list"}
                        onClick={() => handleUnArchive()}
                      >
                        {t("UnArchive View")}
                      </CDropdownItem>
                    ) : (
                      <CDropdownItem
                        style={{
                          color: theme.palette.palette_style.text.primary,
                        }}
                        href="#"
                        key={"archive_list"}
                        onClick={() => handleOpenArchiveModal()}
                      >
                        {t("Archive View")}
                      </CDropdownItem>
                    )}
                  </>
                )}
                {currentView && currentView?.type !== ViewType.List && (
                  <CDropdownItem
                    style={{ color: theme.palette.palette_style.text.primary }}
                    href="#"
                    key={"edit_config"}
                    onClick={() => handleOpenEditViewConfigModal()}
                  >
                    {t("Edit Config")}
                  </CDropdownItem>
                )}
              </CDropdownMenu>
            </CDropdown>
          )}
          <RefreshIcon
            sx={{
              color: theme.palette.palette_style.text.primary,
              fontSize: 22,
              cursor: "pointer",
            }}
            onClick={handleRefresh}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block", width: "100%" } }}>
          {isDesktop && <ToolBar translations={translations} />}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "space-around",
            gap: { xs: 1, md: 2 },
          }}
        >
          {hasPermission(currentView?.role, "All") && (
            <ViewUsersList translations={translations} />
          )}
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: { xs: 20, md: 24 },
              height: { xs: 20, md: 24 },
              display: "inline-block",
              bgcolor: theme.palette.palette_style.text.primary,
              mask: `url(/assets/icons/header/chat.svg) no-repeat center / contain`,
              WebkitMask: `url(/assets/icons/header/chat.svg) no-repeat center / contain`,
              cursor: "pointer",
            }}
            onClick={() => {
              setVisiblePanel(true);
            }}
          />
          {/* <Box
          component="span"
          className="svg-color"
          sx={{
            width: { xs: 18, md: 22 },
            height: { xs: 18, md: 22 },
            display: "inline-block",
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/header/history.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/header/history.svg) no-repeat center / contain`,
            cursor: "pointer",
            marginRight: { xs: 2, md: 4 },
          }}
        /> */}

          {/* ---PUBLISH & SHARE delete if needed--- */}

          <Box
            zIndex={10}
            sx={{
              position: "relative",
              cursor: "pointer",
              m: 0,
              p: 0,
              width: "auto",
            }}
            onClick={handleBoxClick}
          >
            <Box
              sx={{
                display: { xs: showIcons ? "block" : "none", md: "flex" },
                position: { xs: "absolute", md: "relative" },
                top: "100%",
                right: "0",
                width: "min-content",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                p: { xs: 1 },
                boxShadow: { xs: "0 0 24px 0 rgba(24,24,24,.2)", md: "none" },
                background: theme.palette.palette_style.background.default,
              }}
            >
              {hasPermission(currentView?.role, "Read") && (
                <Button
                  onClick={handleOpenPublish}
                  sx={{
                    mt: { xs: 1, md: 0 },
                    mr: { xs: 0, md: 2 },
                    color: theme.palette.palette_style.text.white,
                  }}
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon={"eva:paper-plane-fill"} />}
                >
                  {t("Publish")}
                </Button>
              )}

              {hasPermission(currentView?.role, "All") && (
                <Button
                  onClick={handleOpenShare}
                  sx={{ mt: { xs: 1, md: 0 } }}
                  size="small"
                  // color="primary"
                  variant="text"
                  startIcon={<Iconify icon={"eva:share-outline"} />}
                >
                  {t("Share")}
                </Button>
              )}
            </Box>
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "center",
                mr: 1,
                bg: "primary.main",
              }}
            >
              <Iconify
                sx={{ width: 20, height: 20 }}
                icon={"material-symbols:share-outline"}
                color="#666"
              />
            </Box>
          </Box>

          {/* ---PUBLISH & SHARE delete if needed--- */}

          {/* <Box sx={{ display: { xs: "none", md: "none" } }}>
          <Button
            size="small"
            color="primary"
            variant="contained"
            startIcon={<Iconify icon={"eva:paper-plane-fill"} />}
          >
            Publish
          </Button>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "none" },
            marginLeft: { xs: 0.5, lg: 2 },
          }}
        >
          <Button
            size="small"
            color="primary"
            variant="text"
            startIcon={<Iconify icon={"eva:share-outline"} />}
          >
            Share
          </Button>
        </Box> */}
        </Box>
      </Box>

      <Box sx={{ display: { md: "none", width: "100%" } }}>
        {!isDesktop && <ToolBar translations={translations} />}
      </Box>
      <ChatFormPanel
        chatType={ChatType.View}
        id={currentView.id}
        open={visiblePanel}
        translations={translations}
        onClose={() => setVisiblePanel(false)}
      />
      <>
        {openPublish && (
          <PublishList
            id={currentView.id}
            name={currentView.name}
            open={openPublish}
            translations={translations}
            handleClose={() => {
              handleClosePublish();
            }}
          />
        )}
      </>

      <>
        {openShare && (
          <ShareList
            open={openShare}
            translations={translations}
            handleClose={() => {
              handleCloseShare();
            }}
          />
        )}
      </>
      {currentView && (
        <>
          <RenameView
            open={isRenameOpenModal}
            translations={translations}
            handleClose={() => setIsRenameOpenModal(false)}
          />
          {isCloneListOpenModal && (
            <CloneList
              open={isCloneListOpenModal}
              translations={translations}
              handleClose={() => setIsCloneListOpenModal(false)}
            />
          )}

          <RemigrateView
            open={isRemigrateOpenModal}
            translations={translations}
            handleClose={() => setIsRemigrateOpenModal(false)}
          />
          <DuplicateView
            open={isDuplicateOpenModal}
            translations={translations}
            handleClose={() => setIsDuplicateOpenModal(false)}
          />
          <DeleteView
            viewId={currentView.id}
            open={isDeleteOpenModal}
            translations={translations}
            handleClose={() => setIsDeleteOpenModal(false)}
          />
          <EditViewConfigForm
            open={isEditViewConfigOpenModal}
            translations={translations}
            handleClose={() => setIsEditViewConfigOpenModal(false)}
          />
          {isArchiveOpenModal && (
            <YesNoDialog
              title={t("Archive View")}
              submitText={t("Archive")}
              message={t("Sure Archive")}
              open={isArchiveOpenModal}
              translations={translations}
              handleClose={() => setIsArchiveOpenModal(false)}
              onSubmit={() => {
                handleArchive();
              }}
            />
          )}
          {isDeleteListOpenModal && (
            <YesNoDialog
              title={t("Delete List")}
              submitText={t("Delete")}
              message={t("Sure Delete List")}
              open={isDeleteListOpenModal}
              translations={translations}
              handleClose={() => setIsDeleteListOpenModal(false)}
              onSubmit={() => {
                deleteList();
              }}
              confirmValue={currentView?.name}
            />
          )}
          {isTruncateListOpenModal && (
            <YesNoDialog
              title={t("Truncate List")}
              submitText={t("Truncate")}
              message={t("Sure Truncate List")}
              open={isTruncateListOpenModal}
              translations={translations}
              handleClose={() => setIsTruncateListOpenModal(false)}
              onSubmit={() => {
                truncateList();
              }}
              confirmValue={currentView?.name}
            />
          )}
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
