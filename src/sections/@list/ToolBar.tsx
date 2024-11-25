import { useEffect, useState } from "react";
import { Box, Popover, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ActionItem from "../../components/toolbar/ActionItem";
import { connect } from "react-redux";
import Filter from "./Filter";
import Sort from "./Sort";
import Import from "./Import";
import Export from "./Export";
import ViewFields from "./ViewFields";
import { View } from "src/models/SharedModels";
import { hasPermission } from "src/utils/permissionHelper";
import ListFields from "./ListFields";
import SaveViewPreset from "./SaveViewPreset";
import ViewPresets from "./ViewPresets";
import { ViewField } from "src/models/ViewField";
import { useRouter } from "next/router";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { UserProfile } from "src/models/UserProfile";
import {
  setFilterChanged,
  setSortChanged,
  setQueryChanged,
  setFieldChanged,
  setLimitChanged,
} from "../../redux/actions/viewActions";
import { getViewSettingsStorage } from "src/utils/localStorage";

type ToolbBarProps = {
  columns: ViewField[];
  currentView: View;
  translations: TranslationText[];
  filterChanged: boolean;
  limitChanged: boolean;
  sortChanged: boolean;
  queryChanged: boolean;
  fieldChanged: boolean;
  userProfile: UserProfile | undefined;
  setFilterChanged: (value: boolean) => void;
  setSortChanged: (value: boolean) => void;
  setQueryChanged: (value: boolean) => void;
  setFieldChanged: (value: boolean) => void;
  setLimitChanged: (value: boolean) => void;
};

const ToolbBar = ({
  columns,
  currentView,
  translations,
  filterChanged,
  sortChanged,
  queryChanged,
  fieldChanged,
  limitChanged,
  userProfile,
  setFilterChanged,
  setSortChanged,
  setQueryChanged,
  setFieldChanged,
  setLimitChanged,
}: ToolbBarProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const router = useRouter();
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [visibleSort, setVisibleSort] = useState(false);
  const [visibleImport, setVisibleImport] = useState(false);
  const [visibleExport, setVisibleExport] = useState(false);
  const [visibleFields, setVisibleFields] = useState(false);
  const [visibleListFields, setVisibleListFields] = useState(false);
  const [saveViewPopoverOpen, setSaveViewPopoverOpen] = useState(null);
  const [viewPresetsPopoverOpen, setViewPresetsPopoverOpen] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState<any>();

  const dos = [
    {
      title: t("Undo"),
      icon: "toolbar/undo",
      active: true,
      leftIcon: true,
    },
    {
      title: t("Redo"),
      icon: "toolbar/redo",
      active: false,
      leftIcon: false,
    },
  ];

  const actions = [
    {
      // title: t("Presets"),
      icon: "toolbar/presetTest",
      active: true,
      leftIcon: true,
    },
    {
      title: t("Filter"),
      icon: "toolbar/filter",
      active: true,
      leftIcon: true,
    },
    {
      title: t("Sort"),
      icon: "toolbar/sort",
      active: true,
      leftIcon: true,
    },
    {
      title: t("Fields"),
      icon: "toolbar/fields",
      active: true,
      leftIcon: true,
    },
    {
      title: t("Import"),
      icon: "toolbar/import",
      active: true,
      leftIcon: true,
    },
    {
      title: t("Export"),
      icon: "toolbar/export",
      active: true,
      leftIcon: true,
    },
    {
      title: t("Save"),
      icon: "toolbar/save",
      active: true,
      leftIcon: true,
    },
  ];

  useEffect(() => {
    if (router.isReady) {
      if (columns && columns.length > 0) {
        let noSystemFields = columns.filter((column) => !column.system);
        if (
          noSystemFields.length === 0 &&
          !visibleListFields &&
          hasPermission(currentView?.role, "All")
        ) {
          setVisibleListFields(true);
        }
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    const currentSettings = getViewSettingsStorage(currentView.id);

    if (currentSettings && currentSettings.preset)
      setSelectedPreset(currentSettings.preset);
  }, []);

  const handleSaveViewPopoverClose = () => {
    setSaveViewPopoverOpen(null);
  };

  const handleSaveViewPopoverOpen = (event: any) => {
    if (
      filterChanged ||
      sortChanged ||
      queryChanged ||
      fieldChanged ||
      limitChanged
    )
      setSaveViewPopoverOpen(event.currentTarget);
  };

  const handleViewPresetsPopoverClose = () => {
    setViewPresetsPopoverOpen(null);
  };

  const handleViewPresetsPopoverOpen = (event: any) => {
    setViewPresetsPopoverOpen(event.currentTarget);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        // borderBottom: {
        //   xs: `1px solid ${theme.palette.palette_style.border.default}`,
        //   lg: "none",
        // },
        position: "relative",
        // zIndex: 2,
        backgroundColor: theme.palette.palette_style.background.default,
        justifyContent: { xs: "space-between", md: "inherit" },
        height: "32px",
        width: "100%",
      }}
    >
      {/* <Snackbar
        // anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isSaveViewModalOpen}
        autoHideDuration={5000}
        onClose={() => setIsSaveViewModalOpen(false)}
        message={saveViewMessage}
        key={"top-center"}
      /> */}
      {/* <Box sx={{ display: "flex" }}> */}
      {/* <Box
          sx={{
            display: 'flex',
            p: 1
          }}
        >
          {dos.map((toolbar) => (
            <ToolBarItem key={toolbar.title} toolbar={toolbar} />
          ))}
        </Box> */}
      {/* {!isDesktop && <ViewUsersList />} */}
      {/* </Box> */}
      {/* <Collapse in={open} timeout="auto" unmountOnExit> */}
      <Box
        sx={{
          overflowY: "hidden",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "space-between", md: "center" },
          // paddingTop: 1.2,
          px: { xs: 1, md: "inherit" },
          // width: {xs: '100vw', md: '100%'},
          overflow: { xs: "auto", md: "inherit" },
          borderTop: {
            // xs: `1px solid ${theme.palette.palette_style.border.default}`,
            md: "none",
          },
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {hasPermission(currentView?.role, "Read") && (
          <Box
            sx={{
              position: "relative",
              alignItems: "center",
              marginRight: 2,
              display: "flex",
            }}
          >
            <ActionItem
              toolbar={actions[0]}
              onClick={handleViewPresetsPopoverOpen}
            />
            <Box
              // variant="body1"
              onClick={handleViewPresetsPopoverOpen}
              sx={{
                // mr: 1,
                color:
                  !selectedPreset ||
                  selectedPreset?.name === "Default" ||
                  filterChanged ||
                  sortChanged ||
                  queryChanged ||
                  fieldChanged
                    ? theme.palette.palette_style.text.primary
                    : theme.palette.palette_style.text.selected,
                cursor: "pointer",
                maxWidth: { xs: 96, md: 144 },
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {filterChanged || sortChanged || queryChanged || fieldChanged
                ? "New"
                : selectedPreset
                ? selectedPreset.name
                : "Default"}
            </Box>
            {viewPresetsPopoverOpen !== null && (
              <Popover
                open={Boolean(viewPresetsPopoverOpen)}
                anchorEl={viewPresetsPopoverOpen}
                onClose={handleViewPresetsPopoverClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                  sx: {
                    p: 1,
                    mt: 1.5,
                    // ml: 0.75,
                    width: { xs: "100%", sm: 620 },
                    "& .MuiMenuItem-root": {
                      px: 1,
                      typography: "body2",
                      borderRadius: 0.75,
                    },
                  },
                }}
              >
                <Stack spacing={1}>
                  <ViewPresets
                    translations={translations}
                    selectedPreset={selectedPreset}
                    setSelectedPreset={(newPreset) => {
                      setSelectedPreset(newPreset);
                      setFilterChanged(false);
                      setSortChanged(false);
                      setQueryChanged(false);
                      setFieldChanged(false);
                      setLimitChanged(false);
                    }}
                    handleClose={handleViewPresetsPopoverClose}
                  />
                </Stack>
              </Popover>
            )}
          </Box>
        )}
        {hasPermission(currentView?.role, "Read") && (
          <Box
            sx={{
              position: "relative",
              alignItems: "center",
              marginRight: 2,
              display: "flex",
            }}
          >
            <ActionItem
              toolbar={actions[1]}
              onClick={(e) => {
                setVisibleFilter(!visibleFilter);
              }}
              active={
                currentView.conditions && currentView.conditions?.length > 0
              }
              color={
                filterChanged
                  ? theme.palette.palette_style.text.selected
                  : theme.palette.palette_style.text.primary
              }
            />
            <Filter
              translations={translations}
              open={visibleFilter}
              handleClose={() => {
                setVisibleFilter(false);
              }}
            />
          </Box>
        )}
        {hasPermission(currentView?.role, "Read") && (
          <Box
            sx={{ position: "relative", alignItems: "center", marginRight: 2 }}
          >
            <ActionItem
              toolbar={actions[2]}
              onClick={(e) => {
                setVisibleSort(!visibleSort);
              }}
              active={currentView.order && currentView.order?.length > 0}
              color={
                sortChanged
                  ? theme.palette.palette_style.text.selected
                  : theme.palette.palette_style.text.primary
              }
            />
            <Sort
              translations={translations}
              open={visibleSort}
              handleClose={() => {
                setVisibleSort(false);
              }}
            />
          </Box>
        )}
        {hasPermission(currentView?.role, "Update") && (
          <Box
            sx={{ position: "relative", alignItems: "center", marginRight: 2 }}
          >
            <ActionItem
              toolbar={actions[3]}
              onClick={(e) => {
                setVisibleFields(!visibleFields);
              }}
              active={currentView.fields && currentView.fields?.length > 0}
              color={
                fieldChanged
                  ? theme.palette.palette_style.text.selected
                  : theme.palette.palette_style.text.primary
              }
            />
            <ViewFields
              translations={translations}
              open={visibleFields}
              handleClose={() => {
                setVisibleFields(false);
              }}
            />
            <ListFields
              open={visibleListFields}
              translations={translations}
              onClose={() => {
                setVisibleListFields(false);
              }}
            />
          </Box>
        )}
        {hasPermission(currentView?.role, "Update") && (
          <Box
            sx={{ position: "relative", alignItems: "center", marginRight: 2 }}
          >
            <ActionItem
              toolbar={actions[4]}
              onClick={(e) => {
                setVisibleImport(!visibleImport);
              }}
            />
            {visibleImport && (
              <Import
                translations={translations}
                open={visibleImport}
                handleClose={() => {
                  setVisibleImport(false);
                }}
              />
            )}
          </Box>
        )}
        {hasPermission(currentView?.role, "Read") && (
          <Box
            sx={{ position: "relative", alignItems: "center", marginRight: 2 }}
          >
            <ActionItem
              toolbar={actions[5]}
              onClick={(e) => {
                setVisibleExport(!visibleExport);
              }}
            />
            {visibleExport && (
              <Export
                translations={translations}
                open={visibleExport}
                handleClose={() => {
                  setVisibleExport(false);
                }}
              />
            )}
          </Box>
        )}
        {userProfile && hasPermission(currentView?.role, "Read") && (
          <Box
            sx={{ position: "relative", alignItems: "center", marginRight: 2 }}
          >
            <ActionItem
              toolbar={actions[6]}
              onClick={handleSaveViewPopoverOpen}
              color={
                filterChanged ||
                sortChanged ||
                queryChanged ||
                fieldChanged ||
                limitChanged
                  ? theme.palette.palette_style.text.selected
                  : theme.palette.palette_style.text.primary
              }
            />
            <Popover
              open={Boolean(saveViewPopoverOpen)}
              anchorEl={saveViewPopoverOpen}
              onClose={handleSaveViewPopoverClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  p: 1,
                  mt: 1.5,
                  ml: 0.75,
                  width: 400,
                  backgroundColor: theme.palette.palette_style.background.paper,
                  boxShadow: "0 0 12px 0 rgba(0, 0, 0, 0.2)",
                  "& .MuiMenuItem-root": {
                    px: 1,
                    typography: "body2",
                    borderRadius: 0.75,
                  },
                },
              }}
            >
              <Stack spacing={0.75}>
                <SaveViewPreset
                  translations={translations}
                  setSelectedPreset={(newPreset) => {
                    setSelectedPreset(newPreset);
                    setFilterChanged(false);
                    setSortChanged(false);
                    setQueryChanged(false);
                    setFieldChanged(false);
                    setLimitChanged(false);
                  }}
                  handleClose={handleSaveViewPopoverClose}
                />
              </Stack>
            </Popover>
          </Box>
        )}
      </Box>
      {/* </Collapse> */}
      {/* {!isDesktop && (
        <Box
          sx={{ position: "absolute", right: "10px", top: "12px" }}
          onClick={() => {
            onOpen(!open);
          }}
        >
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: 24,
              height: 24,
              display: "inline-block",
              bgcolor: theme.palette.palette_style.text.primary,
              mask: `url(/assets/icons/angle_down.svg) no-repeat center / contain`,
              WebkitMask: `url(/assets/icons/angle_down.svg) no-repeat center / contain`,
              transform: open ? "rotate(180deg)" : "inherit",
              transition: "transform 0.3s",
            }}
          />
        </Box>
      )} */}
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
  columns: state.view.columns,
  userProfile: state.user.userProfile,
  filterChanged: state.view.filterChanged,
  sortChanged: state.view.sortChanged,
  queryChanged: state.view.queryChanged,
  fieldChanged: state.view.fieldChanged,
  limitChanged: state.view.limitChanged,
});

const mapDispatchToProps = {
  setFilterChanged,
  setSortChanged,
  setQueryChanged,
  setFieldChanged,
  setLimitChanged,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolbBar);
