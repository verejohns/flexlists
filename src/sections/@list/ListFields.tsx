import { useState, useEffect } from "react";
import {
  DialogContent,
  Drawer,
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { connect } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchFields, setFields } from "src/redux/actions/listActions";
import { Field, FieldUIType, View } from "src/models/SharedModels";
import FieldFormPanel from "./FieldFormPanel";
import { FieldType, FieldUiTypeEnum } from "src/enums/SharedEnums";
import { fieldService } from "flexlists-api";
import { isErr } from "src/models/ApiResponse";
import { ErrorConsts } from "src/constants/errorConstants";
import { fetchColumns, fetchRows } from "src/redux/actions/viewActions";
import { getDefaultFieldIcon, sortFields } from "src/utils/flexlistHelper";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import YesNoDialog from "src/components/dialog/YesNoDialog";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";

interface ListFieldsProps {
  translations: TranslationText[];
  currentView: View;
  fields: Field[];
  fetchColumns: (viewId: number) => void;
  fetchRows: () => void;
  setFields: (fields: Field[]) => void;
  fetchFields: (viewId: number) => void;
  availableFieldUiTypes: FieldUIType[];
  open: boolean;
  onClose: () => void;
  setFlashMessage: (message: FlashMessageModel) => void;
}

const ListFields = ({
  translations,
  currentView,
  fields,
  setFields,
  fetchFields,
  open,
  onClose,
  fetchColumns,
  fetchRows,
  availableFieldUiTypes,
  setFlashMessage,
}: ListFieldsProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [fieldManagementMode, setFieldManagementMode] = useState<boolean>(true);
  const [windowHeight, setWindowHeight] = useState(0);
  const newField: Field = {
    id: 0,
    listId: currentView.listId,
    name: "",
    ordering: 0,
    required: false,
    uiField: FieldUiTypeEnum.Text,
    type: FieldType.Text,
    description: "",
    detailsOnly: false,
    maximum: undefined,
    minimum: undefined,
    icon: "",
    config: {},
    system: false,
    deleted: false,
    indexed: false,
    defaultValue: "",
    typedDefaultValue: "",
  };
  const [selectedField, setSelectedField] = useState<Field>(newField);
  const [isDeleteFieldOpenModal, setIsDeleteFieldOpenModal] =
    useState<boolean>(false);
  const [deleteFieldId, setDeleteFieldId] = useState<number>(0);
  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (open) {
      fetchFields(currentView.id);
    }
  }, [open]);
  const setError = (message: string) => {
    setFlashMessage({ type: "error", message: message });
  };
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.index === source.index) {
      return;
    }
    let newFields = Object.assign([], fields);
    const [removedFields] = newFields.splice(source.index, 1);
    newFields.splice(destination.index, 0, removedFields);
    await fieldService.reorderCoreFields(
      currentView.id,
      newFields.map((x: any) => x.id)
    );
    fetchFields(currentView.id);
    fetchColumns(currentView.id);
  };

  const reloadViewData = () => {
    fetchColumns(currentView.id);
    fetchFields(currentView.id);
    fetchRows();
  };

  const handleAddField = () => {
    setSelectedField({ ...newField, listId: currentView.listId });
    setFieldManagementMode(false);
  };

  const addField = (field: Field) => {
    setFields([...fields, field]);
    reloadViewData();
  };

  const handleUpdateField = (field: Field) => {
    setSelectedField(field);
    setFieldManagementMode(false);
  };

  const updateField = (field: Field) => {
    setFields(
      fields.map((x) => {
        return x.id === field.id ? field : x;
      })
    );
    reloadViewData();
  };

  const handleDeleteField = async (fieldId: number) => {
    setDeleteFieldId(fieldId);
    setIsDeleteFieldOpenModal(true);
  };

  const handleCloseModal = () => {
    setFieldManagementMode(true);
    onClose();
  };
  const deleteField = async () => {
    if (deleteFieldId === 0) {
      setFlashMessage({ type: "error", message: "Field is not valid" });
      return;
    }
    var deleteFieldResponse = await fieldService.deleteField(
      currentView.id,
      deleteFieldId
    );
    if (isErr(deleteFieldResponse)) {
      setError(deleteFieldResponse.message);
      return;
    }
    setFields(fields.filter((field: any) => field.id !== deleteFieldId));
    reloadViewData();
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            width: { xs: "100%", lg: "500px" },
            border: "none",
            height: `${windowHeight}px`,
            backgroundColor: theme.palette.palette_style.background.default,
            p: 2,
            minHeight: "100%",
          },
        }}
      >
        {!fieldManagementMode ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
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
                setFieldManagementMode(true);
              }}
            />
            <Typography variant="h6" component={"div"}>
              {selectedField.id ? "Update Field" : "Create Field"}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component={"div"}>
              {t("Manage Fields")}
            </Typography>
            <Button variant="contained" onClick={() => handleAddField()}>
              {t("New Field")}
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 2 }}></Divider>
        <DialogContent
          sx={{
            p: 0,
            maxHeight: { xs: "calc(100vh - 136px)", md: "auto" },
          }}
        >
          {fieldManagementMode ? (
            <>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="field_list">
                  {(provided: any) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        py: 2,
                        maxHeight: `${window.innerHeight - 140}px`,
                        overflow: "auto",
                        minHeight: "360px",
                      }}
                    >
                      {/* {filter(
                      fields,
                      (x) => x.system !== true || x.name !== "id"
                    ).map((field: any, index: number) => ( */}
                      {fields.map((field: any, index: number) => {
                        let fieldIcon =
                          field.icon ?? getDefaultFieldIcon(field.uiField);
                        return (
                          <Draggable
                            key={field.id}
                            draggableId={`${field.id}`}
                            index={index}
                          >
                            {(provided: any) => (
                              <Box
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: { xs: 1, md: 2 },
                                  cursor: "pointer",
                                  py: 2,
                                  px: 1,
                                  "&:hover": {
                                    backgroundColor:
                                      theme.palette.palette_style.action.hover,
                                  },
                                }}
                              >
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    alignItems: "center",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    {fieldIcon && (
                                      <Box
                                        component="span"
                                        className="svg-color"
                                        sx={{
                                          width: 16,
                                          height: 16,
                                          display: "inline-block",
                                          bgcolor:
                                            theme.palette.palette_style.text
                                              .primary,
                                          mask: `url(/assets/icons/table/${fieldIcon}.svg)no-repeat center / contain`,
                                          WebkitMask: `url(/assets/icons/table/${fieldIcon}.svg no-repeat center / contain`,
                                        }}
                                      />
                                    )}

                                    <Box
                                      component={"span"}
                                      sx={{
                                        fontFamily: "Poppins",
                                        maxWidth: { xs: "150px", md: "200px" },
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {field.system
                                        ? t(field.name)
                                        : field.name}
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: { xs: 1, md: 3 },
                                    }}
                                  >
                                    {(field.system !== true ||
                                      field.name !== "id") && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            cursor: "pointer",
                                            fontWeight: 500,
                                            color: "primary.main",
                                          }}
                                          onClick={() => handleUpdateField(field)}
                                        >
                                          <EditIcon />
                                          <Typography
                                            variant="subtitle2"
                                            component={"span"}
                                            sx={{
                                              display: {
                                                xs: "none",
                                                md: "block",
                                              },
                                            }}
                                          >
                                            {t("Edit")}
                                          </Typography>
                                        </Box>
                                      )}

                                    {field.system !== true ? (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 0.5,
                                          alignItems: "center",
                                          cursor: "pointer",
                                          color:
                                            theme.palette.palette_style.error
                                              .dark,
                                          fontWeight: 500,
                                        }}
                                        onClick={() =>
                                          handleDeleteField(field.id)
                                        }
                                      >
                                        <DeleteIcon />
                                        <Typography
                                          variant="subtitle2"
                                          component={"span"}
                                          sx={{
                                            display: {
                                              xs: "none",
                                              md: "block",
                                            },
                                          }}
                                        >
                                          {t("Delete")}
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 0,
                                          alignItems: "center",
                                          // cursor: "pointer",
                                          // color:
                                          //   theme.palette.palette_style.error
                                          //     .dark,
                                          fontWeight: 500,
                                          // ml: 9,
                                          opacity: 0,
                                          pointerEvents: "none"
                                        }}
                                      >
                                        <DeleteIcon />
                                        <Typography
                                          variant="subtitle2"
                                          component={"span"}
                                          sx={{
                                            display: {
                                              xs: "none",
                                              md: "block",
                                            },
                                          }}
                                        >
                                          {t("Delete")}
                                        </Typography>

                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Draggable>
                        );
                      })}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          ) : (
            <FieldFormPanel
              translations={translations}
              fieldUiTypes={availableFieldUiTypes}
              viewId={currentView.id}
              field={selectedField}
              onAdd={(field) => addField(field)}
              onUpdate={(field) => updateField(field)}
              onDelete={(id) => handleDeleteField(id)}
              onClose={() => setFieldManagementMode(true)}
            />
          )}
        </DialogContent>
        {!fieldManagementMode ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              px: { xs: 1, md: 3 },
              marginTop: 4,
              paddingBottom: 2,
              borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
            }}
          ></Box>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                {t("Close")}
              </Button>
              <Button variant="contained" onClick={() => handleAddField()}>
                {t("New Field")}
              </Button>
            </Box>
          </>
        )}
      </Drawer>
      {isDeleteFieldOpenModal && (
        <YesNoDialog
          title={t("Delete Field")}
          submitText={t("Delete")}
          message={t("Sure Delete Field")}
          open={isDeleteFieldOpenModal}
          translations={translations}
          handleClose={() => setIsDeleteFieldOpenModal(false)}
          onSubmit={() => {
            deleteField();
          }}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  fields: state.list.fields,
  currentView: state.view.currentView,
  availableFieldUiTypes: state.view.availableFieldUiTypes,
});

const mapDispatchToProps = {
  setFields,
  fetchFields,
  fetchRows,
  fetchColumns,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListFields);
