import { useState, useEffect } from "react";
import { Box, TextField, Divider, Tooltip, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import { connect } from "react-redux";
import {
  fetchColumns,
  setColumns,
  setCurrentView,
  setFieldChanged,
} from "../../redux/actions/viewActions";
import Checkbox from "@mui/material/Checkbox";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "@mui/material/Modal";
import ViewFieldForm from "./ViewFieldForm";
import { ViewField } from "src/models/ViewField";
import { cloneDeep, filter } from "lodash";
import { View, ViewFieldConfig } from "src/models/SharedModels";
import AddColumnButton from "src/components/add-button/AddColumnButton";
import ListFields from "./ListFields";
import { fieldService } from "flexlists-api";
import { getDefaultFieldIcon } from "src/utils/flexlistHelper";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isErr } from "src/utils/responses";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { hasPermission } from "src/utils/permissionHelper";

type ViewFieldsProps = {
  translations: TranslationText[];
  currentView: View;
  columns: ViewField[];
  open: boolean;
  setCurrentView: (view: View) => void;
  setColumns: (columns: any) => void;
  handleClose: () => void;
  fetchColumns: (viewId: number) => void;
  setFieldChanged: (value: boolean) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const ViewFields = ({
  translations,
  currentView,
  columns,
  open,
  setCurrentView,
  setColumns,
  handleClose,
  fetchColumns,
  setFieldChanged,
  setFlashMessage,
}: ViewFieldsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const [searchText, setSearchText] = useState("");
  const [modalHeight, setModalHeight] = useState(0);
  const [fieldListMode, setFieldListMode] = useState<boolean>(true);
  const [selectedField, setSelectedField] = useState<ViewField>();
  const [filterViewFields, setFilterViewFields] = useState<ViewField[]>([]);

  useEffect(() => {
    setSearchText("");
    searchField("");
    setTimeout(checkModalHeight, 1);
  }, [open]);

  useEffect(() => {
    // searchField("");
    checkModalHeight();

    // const filterCols = filter(columns, (column) => {
    //   return (
    //     (searchText && column.name.includes(searchText)) || searchText === ""
    //   );
    // });

    // setFilterColumns(filterCols);
    searchField(searchText);
  }, [columns, currentView]);

  const checkModalHeight = () => {
    const modalObj = document.getElementById("fields_wrap") as HTMLDivElement;

    if (modalObj) setModalHeight(modalObj.offsetHeight);
  };

  const searchField = (search: string) => {
    const filterColumns = filter(columns, (column) => {
      return (search && column.name.includes(search)) || search === "";
    });
    let viewFields: ViewField[] = [];
    for (const newColumn of filterColumns) {
      let viewField: ViewField = cloneDeep(newColumn);
      let fieldSetting = currentView.fields?.find((x) => x.id === viewField.id);
      if (fieldSetting) {
        viewField.viewFieldVisible = fieldSetting.visible;
        viewField.viewFieldDetailsOnly = fieldSetting.detailsOnly;
        viewField.viewFieldOrdering = fieldSetting.ordering;
        viewField.viewFieldColor = fieldSetting.color;
        viewField.viewFieldName = fieldSetting.name;
        viewField.defaultValue = fieldSetting.default;
      }
      viewFields.push(viewField);
    }
    setFilterViewFields(viewFields);
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.index === source.index) return;

    let newColumns = Object.assign([], columns);
    const [removedColumns] = newColumns.splice(source.index, 1);
    newColumns.splice(destination.index, 0, removedColumns);
    let reorderResult = await fieldService.reorderViewFields(
      currentView.id,
      newColumns.map((x: any) => x.id)
    );

    if (isErr(reorderResult)) {
      setFlashMessage({ type: "error", message: reorderResult.message });
      return;
    }

    fetchColumns(currentView.id);
  };

  const handleVisible = (value: boolean) => {
    // setColumns(
    //   columns.map((column: any) => {
    //     column.viewFieldVisible = value;
    //     return column;
    //   })
    // );
  };

  const changeVisible = (index: number) => {
    const updatedField = filterViewFields.find(
      (column: ViewField, i: number) => index === i
    );

    if (updatedField) {
      updatedField.viewFieldVisible = !updatedField.viewFieldVisible;

      updateField(updatedField);
    }
  };

  const changeDetailsOnly = (index: number) => {
    const updatedField = filterViewFields.find(
      (column: ViewField, i: number) => index === i
    );

    if (updatedField) {
      updatedField.viewFieldDetailsOnly = !updatedField.viewFieldDetailsOnly;
      updateField(updatedField);
    }
    // const newColumns = columns.map((column: any, i: number) => {
    //   if (index === i)
    //     column.viewFieldDetailsOnly = !column.viewFieldDetailsOnly;

    //   return column;
    // });

    // setColumns(newColumns);

    // const field = newColumns[index];

    // if (field) updateViewFieldConfig(field);
  };

  const handleSearchColumns = (e: any) => {
    setSearchText(e.target.value);
    searchField(e.target.value);
  };

  const handleSelectField = (field: ViewField) => {
    setFieldListMode(false);
    setSelectedField(field);
  };

  const updateField = (field: ViewField) => {
    // const newColumns = columns.map((x) => {
    //   return x.id === field.id ? field : x;
    // });

    // setColumns(newColumns);
    // searchField(searchText);
    updateViewFieldConfig(field);
  };

  const updateViewFieldConfig = (field: ViewField) => {
    let newView: View = Object.assign({}, currentView);
    let viewFieldConfig: ViewFieldConfig = {
      id: field.id,
      visible: field.viewFieldVisible,
      color: field.viewFieldColor,
      name: field.viewFieldName,
      detailsOnly: field.viewFieldDetailsOnly,
      ordering: field.viewFieldOrdering,
      default: field.defaultValue,
    };

    if (newView.fields) {
      const currentViewFieldIndex = newView.fields.findIndex(
        (x) => x.id === viewFieldConfig.id
      );

      if (currentViewFieldIndex >= 0) {
        newView.fields[currentViewFieldIndex] = viewFieldConfig;
      } else {
        newView.fields.push(viewFieldConfig);
      }
    } else {
      newView.fields = [viewFieldConfig];
    }
    setCurrentView(newView);
    setFieldChanged(true);
  };

  const handleCloseModal = () => {
    setFieldListMode(true);
    handleClose();
  };

  const style = {
    position: "absolute",
    // top: `calc(50% - ${modalHeight / 2}px)`,
    top: "50%",
    transform: "translateY(-50%)",
    left: { xs: 0, md: "calc(50% - 179px)" },
    width: { xs: "100%", md: "357px" },
    backgroundColor: theme.palette.palette_style.background.default,
    color: theme.palette.palette_style.text.primary,
    py: 2,
    px: { xs: 0.5, md: 2 },
    boxShadow: "0 0 10px 10px rgba(0, 0, 0, 0.05)",
    borderRadius: "5px",
    border: "none",
    maxHeight: { xs: "100svh", md: "97vh" },
    overflow: "hidden",
  };

  const handleOpenFieldManagementPanel = () => {
    setVisibleFieldManagementPanel(true);
    handleCloseModal();
  };

  const handleCloseFieldManagementPanel = () => {
    setVisibleFieldManagementPanel(false);
  };

  const [visibleFieldManagementPanel, setVisibleFieldManagementPanel] =
    useState<boolean>(false);

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} id="fields_wrap">
          {!fieldListMode ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                }}
              >
                <Box
                  component="span"
                  className="svg-color"
                  sx={{
                    width: 18,
                    height: 18,
                    display: "inline-block",
                    bgcolor: theme.palette.palette_style.text.primary,
                    mask: `url(/assets/icons/arrow_back.svg) no-repeat center / contain`,
                    WebkitMask: `url(/assets/icons/arrow_back.svg) no-repeat center / contain`,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setFieldListMode(true);
                  }}
                />
              </Box>
              <Divider
                sx={{
                  my: 2,
                }}
              />
            </>
          ) : (
            <></>
          )}

          {fieldListMode ? (
            <>
              <AddColumnButton
                modalHandle={handleOpenFieldManagementPanel}
                translations={translations}
                disabled={!hasPermission(currentView?.role, "All")}
              />
              <Box
                sx={{
                  borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
                  paddingBottom: 1,
                  paddingTop: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
                id="search_column_list"
              >
                <TextField
                  label={t("Search A Field")}
                  size="small"
                  type="text"
                  onChange={handleSearchColumns}
                  value={searchText}
                  sx={{ border: "none" }}
                />
                {/* <Box
                  component="span"
                  className="svg-color add_choice"
                  sx={{
                    width: 18,
                    height: 18,
                    display: "inline-block",
                    bgcolor: theme.palette.palette_style.text.primary,
                    mask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
                    WebkitMask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
                    cursor: "pointer",
                    marginTop: 1,
                  }}
                  onClick={handleClose}
                /> */}
              </Box>
              {/* <Box
                sx={{
                  paddingTop: 2,
                  textAlign: "center",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                }}
              >
                <Box
                  sx={{
                    py: 1,
                    border: `1px solid ${theme.palette.palette_style.border.default}`,
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleVisible(true);
                  }}
                >
                  {t("Show All")}
                </Box>
                <Box
                  sx={{
                    py: 1,
                    border: `1px solid ${theme.palette.palette_style.border.default}`,
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleVisible(false);
                  }}
                >
                  {t("Hide All")}
                </Box>
              </Box> */}
              <Box>
                <Tooltip title={t("Field Is Visible")}>
                  <Box
                    component="span"
                    className="svg-color"
                    sx={{
                      width: 18,
                      height: 18,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.text.primary,
                      //mask: `url(/assets/icons/toolbar/${action.icon}.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/toolbar/visible.svg) no-repeat center / contain`,
                      ml: 0.5,
                      mt: 3,
                    }}
                  />
                </Tooltip>
                <Tooltip title={t("Visible On Main View")}>
                  <Box
                    component="span"
                    className="svg-color"
                    sx={{
                      width: 18,
                      height: 18,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.text.primary,
                      //mask: `url(/assets/icons/toolbar/${action.icon}.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/toolbar/detailsOnly.svg) no-repeat center / contain`,
                      ml: 2,
                      mt: 3,
                    }}
                  />
                </Tooltip>
              </Box>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="field_list">
                  {(provided: any) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
                        pb: 2,
                        maxHeight: {
                          xs: `${window.innerHeight - 320}px`,
                          // md: `${window.innerHeight - 140}px`,
                        },
                        overflow: "auto",
                      }}
                    >
                      {filterViewFields.map((column: any, index: number) => {
                        let columnIcon =
                          column.icon ?? getDefaultFieldIcon(column.uiField);
                        return (
                          <Draggable
                            key={`${column.id}`}
                            draggableId={`${column.id}`}
                            index={index}
                          >
                            {(provided: any) => (
                              <Box
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  cursor: "pointer",
                                  py: 1,
                                  pr: 1,
                                }}
                              >
                                <Box
                                  flexGrow={2}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Tooltip
                                    title={
                                      !column.system && column.required
                                        ? t("Required Field")
                                        : ""
                                    }
                                  >
                                    <Box>
                                      <Checkbox
                                        checked={column.viewFieldVisible}
                                        sx={{
                                          color: "#CCCCCC",
                                          "&.Mui-checked": {
                                            color: "#54A6FB",
                                          },
                                          "&.Mui-disabled": {
                                            color: "rgba(0, 0, 0, 0.26)",
                                          },
                                          p: 0,
                                          marginRight: 1,
                                        }}
                                        onChange={() => {
                                          changeVisible(index);
                                        }}
                                        disabled={
                                          !column.system && column.required
                                        }
                                      />
                                    </Box>
                                  </Tooltip>
                                  <Checkbox
                                    checked={!column.viewFieldDetailsOnly}
                                    sx={{
                                      color: "#CCCCCC",
                                      "&.Mui-checked": {
                                        color: "#54A6FB",
                                      },
                                      p: 0,
                                      marginRight: 1,
                                    }}
                                    onChange={() => {
                                      changeDetailsOnly(index);
                                    }}
                                  />
                                  <Box
                                    component="span"
                                    className="svg-color"
                                    sx={{
                                      width: 18,
                                      height: 18,
                                      bgcolor:
                                        theme.palette.palette_style.text
                                          .primary,
                                      display: "inline-block",
                                      mask: `url(/assets/icons/table/${columnIcon}.svg) no-repeat center / contain`,
                                      WebkitMask: `url(/assets/icons/table/${columnIcon}.svg) no-repeat center / contain`,
                                      marginRight: 1,
                                      // marginTop: 0.5,
                                    }}
                                  />

                                  <Box
                                    sx={{ cursor: "pointer" }}
                                    flexGrow={2}
                                    onClick={() => handleSelectField(column)}
                                  >
                                    {column.system
                                      ? t(column.viewFieldName)
                                      : column.viewFieldName}
                                  </Box>
                                </Box>
                                <Box
                                  component="span"
                                  className="svg-color"
                                  sx={{
                                    width: 14,
                                    height: 14,
                                    display: "inline-block",
                                    bgcolor:
                                      theme.palette.palette_style.text.primary,
                                    mask: `url(/assets/icons/toolbar/drag_indicator.svg) no-repeat center / contain`,
                                    WebkitMask: `url(/assets/icons/toolbar/drag_indicator.svg) no-repeat center / contain`,
                                  }}
                                />
                              </Box>
                            )}
                          </Draggable>
                        );
                      })}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>

              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button onClick={handleClose} variant="outlined">
                  Close
                </Button>
              </Box>
            </>
          ) : (
            <>
              {selectedField && (
                <ViewFieldForm
                  currentView={currentView}
                  field={selectedField}
                  onUpdate={(field) => updateField(field)}
                  onClose={() => setFieldListMode(true)}
                />
              )}
            </>
          )}
        </Box>
      </Modal>
      <ListFields
        translations={translations}
        open={visibleFieldManagementPanel}
        onClose={() => handleCloseFieldManagementPanel()}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setColumns,
  setCurrentView,
  fetchColumns,
  setFieldChanged,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewFields);
