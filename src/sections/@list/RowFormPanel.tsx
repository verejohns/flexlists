import { useState, useEffect, useRef } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Drawer,
  Box,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useResponsive from "src/hooks/useResponsive";
import dayjs, { Dayjs } from "dayjs";
import { connect } from "react-redux";
import { listContentService } from "flexlists-api";
import { FlexlistsError, isErr, isSucc } from "src/models/ApiResponse";
import { cloneDeep, filter } from "lodash";
import ChatForm from "./chat/ChatForm";
import { ChatType } from "src/enums/ChatType";
import { marked } from "marked";
//import MarkdownEditor from "src/components/wysiwyg/markdownEditor";
// -----ICONS------
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArchiveIcon from "@mui/icons-material/Archive";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import { hasPermission } from "src/utils/permissionHelper";
import { View } from "src/models/SharedModels";
import YesNoDialog from "src/components/dialog/YesNoDialog";
import { useReactToPrint } from "react-to-print";
import RenderFields from "./RenderFields";
import { useRouter } from "next/router";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import DownloadIcon from "@mui/icons-material/Download";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "src/utils/validatorHelper";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import {
  removeReadContent,
  setReadContent,
  fetchRows,
} from "src/redux/actions/viewActions";
import Tooltip from "@mui/material/Tooltip";
import {
  getDefaultValues,
  isValidFieldValue,
  imageStringToJSON,
  isFieldVisible,
} from "src/utils/flexlistHelper";
import PrintRenderFields from "./PrintRenderFields";
import { BorderAll, Margin } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useToPng, useToCanvas } from "@hugocxl/react-to-image";
import { toPng } from "html-to-image";
import React from "react";

const PrintTable = styled("table")({
  "&, & thead, & tbody, & tr, & th, & td": {
    borderWidth: "1px",
    borderStyle: "solid",
  },
});
interface RowFormProps {
  currentView: View;
  rowData: any[];
  columns: any[];
  open: boolean;
  mode: "view" | "create" | "update" | "comment";
  translations: TranslationText[];
  onClose: () => void;
  onSubmit: (values: any, action: string, id?: number) => void;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
  setReadContent: (viewId: number, contentId: number) => void;
  removeReadContent: (viewId: number, contentId: number) => void;
  fetchRows: () => void;
}

const RowFormPanel = ({
  currentView,
  rowData,
  open,
  columns,
  mode,
  translations,
  onClose,
  onSubmit,
  setFlashMessage,
  setReadContent,
  removeReadContent,
  fetchRows,
}: RowFormProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();

  const componentRef = useRef<HTMLDivElement>(null);
  const [_, convert, _1] = useToPng<HTMLDivElement>({
    selector: `#imagePreview-${currentView.id}-${
      rowData[0] ? rowData[0]["id"] : 0
    }`,

    quality: 0.8,
    onSuccess: (data: any) => {
      //console.log(data);
      const link = document.createElement("a");
      link.download = `${currentView?.name}-${values ? values["id"] : 0}.png`;
      link.href = data;
      link.click();
    },
  });

  const [_2, convertclip, _3] = useToCanvas<HTMLDivElement>({
    selector: `#imagePreview-${currentView.id}-${
      rowData[0] ? rowData[0]["id"] : 0
    }`,

    quality: 0.8,
    onSuccess: (data: any) => {
      data.toBlob((blob: any) => {
        navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
      }, "image/png");
    },
  });
  const theme = useTheme();
  const [values, setValues] = useState({ ...rowData[0] });
  const [defaults, setDefaults] = useState<any>(getDefaultValues(columns));
  const [submit, setSubmit] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    "view" | "create" | "update" | "comment"
  >(mode);
  const [windowHeight, setWindowHeight] = useState(0);
  const [panelWidth, setPanelWidth] = useState("500px");
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(t("Copy URL to Clipboard"));
  const [copySuccess2, setCopySuccess2] = useState(
    t("Copy Image to Clipboard")
  );

  const [checkedFields, setCheckedFields] = useState<any[]>([]);
  const [printHidden, setPrintHidden] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: boolean;
  }>();
  const actions = [
    {
      title: t("Resize"),
      icon: <FullscreenIcon />,
      action: "resize",
      allowed: true,
    },
    {
      title: t("Clone"),
      icon: <ContentCopyIcon />,
      action: "clone",
      allowed: hasPermission(currentView?.role, "Update"),
    },
    {
      title: `${
        values &&
        values[columns.find((x) => x.system && x.name === "___archived").id]
          ? t("Unarchive")
          : t("Archive")
      }`,
      icon: <ArchiveIcon />,
      action: "archive",
      allowed: hasPermission(currentView?.role, "Update"),
    },
    {
      title: t("Print"),
      icon: <PrintIcon />,
      action: "print",
      allowed: hasPermission(currentView?.role, "Read"),
    },
    {
      title: t("Image"),
      icon: <ImageIcon />,
      action: "image",
      allowed: hasPermission(currentView?.role, "Read"),
    },
    {
      title: t("Delete"),
      icon: <DeleteIcon />,
      action: "delete",
      // color: "#c92929",
      color: theme.palette.palette_style.error.dark,
      allowed: hasPermission(currentView?.role, "Delete"),
    },
  ];

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    setValues(rowData.length > 1 ? null : { ...rowData[0] });
    setSubmit(false);
    setCurrentMode(mode);
    setFieldErrors(undefined);
    if (
      router.isReady &&
      mode === "view" &&
      open &&
      rowData.length &&
      rowData[0].id &&
      rowData[0].id > 0 &&
      parseInt((router.query?.contentId as string) ?? "-1") !== rowData[0].id
    ) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, ["contentId"]: rowData[0].id },
        },
        undefined,
        { shallow: true }
      );

      setReadContent(currentView.id, rowData[0].id);
    }

    if (rowData.length > 1) {
      const fieldCheckStatus: any[] = [];
      columns.map((column: any) => {
        fieldCheckStatus.push({ id: column.id, checked: false });
      });

      setCheckedFields(fieldCheckStatus);
    }
  }, [open, rowData, mode]);
  const setError = (message: string) => {
    setFlashMessage({
      message: message,
      type: "error",
    });
  };
  const handleSubmit = async () => {
    //console.log("columns", columns);
    setSubmit(true);
    if (!values) {
      setFlashMessage({ message: "No values", type: "error" });
      return;
    } else {
      if (rowData.length > 1) {
        if (!checkedFields.find((checkedField: any) => checkedField.checked)) {
          setFlashMessage({ message: "No selected fields", type: "error" });
          return;
        } else {
          // NO: because strings at this point can be '', that's one of the reasons you put the [x]
          // if (
          //   checkedFields
          //     .filter((checkedField: any) => checkedField.checked)
          //     .find((checkedField: any) => !values[checkedField.id])
          // ) {
          //   setFlashMessage({
          //     message: "Empty value for selected field",
          //     type: "error",
          //   });
          //   return;
          // }
        }
      }
    }

    let validator = true;
    let requiredErrorFields: string[] = [];
    let otherErrorFields: string[] = [];
    if (values) {
      //console.log("values", values);
      for (const column of columns) {
        if (
          rowData.length > 1 &&
          !checkedFields.find(
            (checkedField: any) => checkedField.id === column.id
          ).checked
        ) {
          continue;
        }
        if (!column.system) {
          let isValid = await isValidFieldValue(
            column.name,
            column.uiField,
            values[column.id],
            column.required,
            (message) => {
              setError(message);
            },
            column.minimum ? BigInt(column.minimum) : undefined,
            column.maximum ? BigInt(column.maximum) : undefined
          );
          if (!isValid) {
            setFieldErrors({ ...fieldErrors, [column.id]: true });
            return;
            // validator = false;
            // requiredErrorFields.push(column.name);
          }
        }
        // if (column.uiField === FieldUiTypeEnum.Link) {
        //   let linkValue = values[column.id]?.linkValue;
        //   if (linkValue) {
        //     let _errors: { [key: string]: string | boolean } = {};

        //     const _setErrors = (e: { [key: string]: string | boolean }) => {
        //       _errors = e;
        //     };
        //     await frontendValidate(
        //       ModelValidatorEnum.GenericTypes,
        //       FieldValidatorEnum.url,
        //       linkValue,
        //       _errors,
        //       _setErrors,
        //       true
        //     );
        //     if (isFrontendError(FieldValidatorEnum.url, _errors)) {
        //       validator = false;
        //       setError(`${column.name} is invalid link`);
        //       setFieldErrors({ ...fieldErrors, [column.id]: true });
        //       // otherErrorFields.push(`${column.name} is invalid link`);
        //     }
        //   }
        //   // else
        //   // {
        //   //   if(column.required)
        //   //   {
        //   //     validator = false;
        //   //     requiredErrorFields.push(column.name);
        //   //   }
        //   // }
        // }
      }

      if (validator) {
        //update row data
        if (rowData.length && rowData[0].id) {
          if (rowData.length > 1) {
            const updatedContents = rowData.map((row: any) => {
              const newRow = row;

              for (const key in values) {
                newRow[key] = values[key];
              }

              return newRow;
            });

            const updateRowRespone =
              await listContentService.updateContentsWithFiles(
                currentView.id,
                updatedContents
              );
            if (isSucc(updateRowRespone)) {
              onSubmit(updatedContents, "update");
              rowData.map((row: any) => {
                removeReadContent(currentView.id, row.id);
              });
            } else {
              setFlashMessage({
                message: (updateRowRespone as FlexlistsError).message,
                type: "error",
              });
              return;
            }
          } else {
            const updateRowRespone =
              await listContentService.updateContentWithFiles(
                currentView.id,
                cloneDeep(values),
                currentView.parentViewId,
                currentView.parentFieldId,
                currentView.parentContentId
              );
            if (isSucc(updateRowRespone)) {
              onSubmit(values, "update");
              removeReadContent(currentView.id, rowData[0].id);
            } else {
              setFlashMessage({
                message: (updateRowRespone as FlexlistsError).message,
                type: "error",
              });
              return;
            }
          }
        } else {
          var createRowResponse =
            await listContentService.createContentWithFiles(
              currentView.id,
              cloneDeep(values),
              currentView.parentViewId,
              currentView.parentFieldId,
              currentView.parentContentId
            );
          if (
            isSucc(createRowResponse) &&
            createRowResponse.data &&
            createRowResponse.data.content &&
            createRowResponse.data.content.length > 0
          ) {
            values.id = createRowResponse.data.content[0].id;
            values.createdAt = new Date().toISOString();
            values.updatedAt = new Date().toISOString();
            var archiveField = columns.find(
              (x) => x.system && x.name === "___archived"
            );
            if (archiveField) {
              values[archiveField.id] = false;
            }

            onSubmit(values, "create", values.id);
          } else {
            setFlashMessage({
              message: (createRowResponse as FlexlistsError).message,
              type: "error",
            });
            return;
          }
        }

        onClose();
      } else {
        if (requiredErrorFields.length > 0) {
          setFlashMessage({
            message: `${requiredErrorFields.join(",")} ${
              requiredErrorFields.length > 1 ? "are" : "is"
            } required`,
            type: "error",
          });
          return;
        }
        if (otherErrorFields) {
          setFlashMessage({
            message: otherErrorFields.join(","),
            type: "error",
          });
          return;
        }
      }
    }
  };

  const handleAction = async (action: string) => {
    let newValues = Object.assign({}, values);
    if (action === "delete") {
      setOpenBulkDeleteDialog(true);
      return;
    } else if (action === "resize") {
      if (panelWidth.includes("%")) {
        setPanelWidth("500px");
      } else {
        setPanelWidth("100%");
      }
      return;
    } else if (action === "clone") {
      let cloneResponse = await listContentService.cloneContent(
        currentView.id,
        rowData.map((row: any) => {
          if (row) {
            delete row.id;
            var archiveField = columns.find(
              (x) => x.system && x.name === "___archived"
            );
            if (archiveField) {
              row[archiveField.name] = row[archiveField.id];
              delete row[archiveField.id];
            }
            return row;
          }
        })
      );
      if (
        isSucc(cloneResponse) &&
        cloneResponse.data &&
        cloneResponse.data.content &&
        cloneResponse.data.content.length > 0
      ) {
        newValues.id = cloneResponse.data.content[0].id;
      } else {
        setFlashMessage({
          type: "error",
          message: (cloneResponse as FlexlistsError).message,
        });
        return;
      }
    } else if (action === "archive") {
      let updateRowRespone: any;
      const archiveField = columns.find(
        (x) => x.system && x.name === "___archived"
      );

      if (rowData.length > 1) {
        if (archiveField) {
          newValues = rowData.map((row: any) => ({
            ...row,
            [archiveField.id]: !row[archiveField.id],
          }));
        }
        updateRowRespone = await listContentService.updateContents(
          currentView.id,
          newValues
        );
      } else {
        if (archiveField) {
          newValues[archiveField.id] = !values[archiveField.id];
        }
        updateRowRespone = await listContentService.updateContent(
          currentView.id,
          newValues,
          currentView.parentViewId,
          currentView.parentFieldId,
          currentView.parentContentId
        );
      }

      if (isSucc(updateRowRespone)) {
        setFlashMessage({
          message: "Row archived successfully",
          type: "success",
        });
        onSubmit(newValues, "archive");
        onClose();
        return;
      } else {
        setFlashMessage({
          type: "error",
          message: (updateRowRespone as FlexlistsError).message,
        });
        return;
      }
    } else if (action === "print") {
      handlePrint();
      return;
    } else if (action === "image") {
      handleImage();
      return;
    }

    if (action === "clone") onSubmit(newValues, action, newValues.id);
    else onSubmit(newValues, action);

    onClose();
  };

  const handleDelete = async () => {
    let deleteContentResponse: any;

    if (rowData.length > 1) {
      deleteContentResponse = await listContentService.deleteBulkContents(
        currentView.id,
        rowData.map((row: any) => row.id)
      );
    } else {
      deleteContentResponse = await listContentService.deleteContent(
        currentView.id,
        values.id
      );
    }

    if (isErr(deleteContentResponse)) {
      setFlashMessage({
        message: (deleteContentResponse as FlexlistsError).message,
        type: "error",
      });

      return;
    } else {
      setFlashMessage({ message: "Row deleted successfully", type: "success" });
    }
    onSubmit(values, "delete");
    onClose();
  };

  const handleEditRow = () => {
    setCurrentMode("update");
  };

  const convertMarkdownToHtml = (markdown: string): string => {
    return marked(markdown);
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleComment = () => {
    setCurrentMode("view");
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleImage = async () => {
    //setPrintHidden(false);
    //console.log(pngRef);

    convert();
    // pause for a bit to let the image be generated
    // setTimeout(() => {
    //   setPrintHidden(true);
    // }, 1000);
    //setPrintHidden(true);

    // const x1 = await toPng(componentRef.current!);
    // const x2 = await toPng(componentRef.current!);
    // const x3 = await toPng(componentRef.current!);
    // const x4 = await toPng(componentRef.current!);
    // console.log(x1, x2, x3, x4);

    // const link = document.createElement("a");
    // link.download = `${currentView?.name}-${values ? values["id"] : 0}.png`;
    // link.href = x4;
    // link.click();
  };

  const isDesktop = useResponsive("up", "lg");

  const copyUrlToClipboard = async () => {
    await navigator.clipboard.writeText(location.href);
    setCopySuccess(t("Copied URL to Clipboard"));
  };

  const copyImageToClipboard = async () => {
    convertclip();
    setCopySuccess2(t("Copied Image to Clipboard"));
  };

  const handleCheckedFields = (e: any, column: any) => {
    //console.log("values", values);
    const newCheckedFields = checkedFields.map((checkedField) => {
      if (checkedField.id === column.id) {
        return { ...checkedField, checked: e.target.checked };
      }
      return checkedField;
    });

    if (!values || !values[column.id]) {
      let newValues: any | undefined = undefined;
      if (!values) {
        newValues = {};
      } else {
        newValues = { ...values };
      }

      newValues[column.id] = defaults[column.id];

      setValues(newValues);
    }
    setCheckedFields(newCheckedFields);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openExportMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleCloseModal}
      PaperProps={{
        sx: {
          width: { xs: "100%", lg: panelWidth },
          border: "none",
          // height: `${windowHeight}px`,
          backgroundColor: theme.palette.palette_style.background.default,
          overflow: "hidden",
        },
      }}
    >
      {currentMode === "create" && (
        <DialogTitle
          textAlign="left"
          sx={{
            borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
          }}
        >
          {t("Create New Row")}
        </DialogTitle>
      )}
      {(currentMode === "update" || currentMode === "view") && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            px: { xs: 1, md: 3 },
            marginTop: 4,
            paddingBottom: 2,
            borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
          }}
        >
          {actions.map(
            (action: any) =>
              action.allowed && (
                <Box
                  key={action.title}
                  sx={{
                    display:
                      action.action !== "print" && action.action !== "image"
                        ? "flex"
                        : "none",
                    cursor: "pointer",
                    "&:first-of-type": {
                      display: isDesktop ? "flex" : "none",
                    },
                  }}
                  onClick={() => {
                    handleAction(action.action);
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="span"
                      className="svg-color"
                      sx={{
                        width: 24,
                        height: 24,
                        display: "grid",
                        placeContent: "center",
                        color:
                          action.color ||
                          theme.palette.palette_style.text.primary,
                        // mask: `url(/assets/icons/toolbar/${action.icon}.svg) no-repeat center / contain`,
                        // WebkitMask: `url(/assets/icons/${action.icon}.svg) no-repeat center / contain`,
                        mr: { xs: 0.2, md: 0.5 },
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          action.color ||
                          theme.palette.palette_style.text.primary,
                      }}
                    >
                      {action.title}
                    </Typography>
                  </Box>
                </Box>
              )
          )}
          <Button
            onClick={handleClick}
            sx={{
              color: theme.palette.palette_style.text.primary,
              fontWeight: 400,
              fontSize: 16,
              "&:hover": { background: "unset" },
            }}
            disableRipple
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            startIcon={<DownloadIcon />}
          >
            {t("Export")}
          </Button>

          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            open={openExportMenu}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {actions.map(
              (action: any, index: number) =>
                action.allowed && (
                  <MenuItem
                    key={index}
                    sx={{
                      display:
                        action.action !== "print" && action.action !== "image"
                          ? "none"
                          : "flex",
                    }}
                    onClick={() => {
                      handleAction(action.action);
                    }}
                  >
                    <ListItemIcon onClick={handleClose}>
                      {action.icon}
                    </ListItemIcon>
                    <ListItemText onClick={handleClose}>
                      {action.title}
                    </ListItemText>
                  </MenuItem>
                )
            )}
          </Menu>
        </Box>
      )}

      <DialogContent sx={{ p: currentMode === "comment" ? 0 : "20px 24px" }}>
        {currentMode !== "comment" && (
          <form onSubmit={(e) => e.preventDefault()} id="new_row_form">
            <Stack
              sx={{
                width: "100%",
                minWidth: { xs: "300px", sm: "360px", md: "400px" },
                gap: "1.5rem",
                paddingTop: 2,
              }}
            >
              {currentMode !== "view" &&
                filter(columns, (x) => !x.system).map((column: any) => (
                  <Box key={column.id} sx={{ display: "flex", width: "100%" }}>
                    {currentMode !== "create" && checkedFields.length > 1 && (
                      <Checkbox
                        checked={
                          checkedFields.find(
                            (field: any) => field.id === column.id
                          ).checked
                        }
                        onChange={(e) => {
                          handleCheckedFields(e, column);
                        }}
                      />
                    )}
                    {isFieldVisible(column, currentView?.fields) && (
                      <RenderFields
                        viewId={currentView.id}
                        column={column}
                        currentMode={currentMode}
                        values={values}
                        submit={submit}
                        setValues={(newValues: any) => {
                          setValues(newValues);
                          setSubmit(false);
                        }}
                        translations={translations}
                        errors={fieldErrors}
                        setErrors={setFieldErrors}
                      />
                    )}
                  </Box>
                ))}
              {currentMode === "view" &&
                values &&
                columns.map(
                  (column: any) =>
                    isFieldVisible(column, currentView?.fields) && (
                      <RenderFields
                        viewId={currentView.id}
                        key={column.id}
                        column={column}
                        currentMode={currentMode}
                        values={values}
                        submit={submit}
                        setValues={setValues}
                        translations={translations}
                      />
                    )
                )}
            </Stack>
          </form>
        )}
        {currentMode == "comment" && (
          <ChatForm
            chatType={ChatType.RowData}
            id={rowData[0].id}
            translations={translations}
            handleClose={handleComment}
          />
        )}
      </DialogContent>

      {currentMode !== "comment" && (
        <DialogActions
          sx={{
            p: "1.25rem",
            borderTop: `1px solid ${theme.palette.palette_style.border.default}`,
            justifyContent: "space-between",
          }}
        >
          {(currentMode === "update" || currentMode === "view") && (
            <Box>
              <Box
                component="span"
                className="svg-color"
                sx={{
                  width: 16,
                  height: 16,
                  display: "inline-block",
                  bgcolor: theme.palette.palette_style.text.primary,
                  mask: `url(/assets/icons/header/chat.svg) no-repeat center / contain`,
                  WebkitMask: `url(/assets/icons/header/chat.svg) no-repeat center / contain`,
                  cursor: "pointer",
                  marginRight: { xs: 0.5, md: 1.5 },
                }}
                onClick={() => {
                  setCurrentMode("comment");
                }}
              />
              <Tooltip title={copySuccess}>
                <Box
                  component="span"
                  className="svg-color"
                  sx={{
                    width: 20,
                    height: 20,
                    display: "inline-block",
                    bgcolor: theme.palette.palette_style.text.primary,
                    mask: `url(/assets/icons/copy_to_clipboard.svg) no-repeat center / contain`,
                    WebkitMask: `url(/assets/icons/copy_to_clipboard.svg) no-repeat center / contain`,
                    cursor: "pointer",
                    //marginRight: { xs: 1.5, md: 4 },
                  }}
                  onClick={copyUrlToClipboard}
                />
              </Tooltip>
              <Tooltip title={copySuccess2}>
                <Box
                  component="span"
                  className="svg-color"
                  sx={{
                    color: "green",
                    width: 20,
                    height: 20,
                    display: "inline-block",
                    bgcolor: theme.palette.palette_style.text.primary,
                    mask: `url(/assets/icons/copy_to_clipboard.svg) no-repeat center / contain`,
                    WebkitMask: `url(/assets/icons/copy_to_clipboard.svg) no-repeat center / contain`,
                    cursor: "pointer",
                    marginRight: { xs: 1.5, md: 4 },
                  }}
                  onClick={copyImageToClipboard}
                />
              </Tooltip>
            </Box>
          )}
          {currentMode === "create" && (
            <Box
              component="span"
              className="svg-color"
              sx={{
                marginRight: { xs: 1.5, md: 4 },
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              bottom: 0,
            }}
          >
            <Button onClick={handleCloseModal}>{t("Cancel")}</Button>
            {(currentMode === "update" || currentMode === "create") && (
              <Button
                color="primary"
                onClick={handleSubmit}
                variant="contained"
                type="submit"
              >
                {open && rowData.length && rowData[0].id
                  ? t("Update Row" + (rowData.length > 1 ? "s" : ""))
                  : t("Create New Row")}
              </Button>
            )}
            {hasPermission(currentView?.role, "Update") &&
              currentMode === "view" && (
                <Button
                  color="primary"
                  onClick={handleEditRow}
                  variant="contained"
                  type="submit"
                >
                  {t("Edit")}
                </Button>
              )}
          </Box>
          <YesNoDialog
            title={t("Delete Selected Data")}
            submitText={t("Delete")}
            message={t("Sure Delete Data")}
            open={openBulkDeleteDialog}
            translations={translations}
            handleClose={() => setOpenBulkDeleteDialog(false)}
            onSubmit={() => {
              handleDelete();
            }}
          />
          <div
            hidden={true}
            style={{ marginLeft: -9999, position: "absolute" }}
          >
            <div ref={componentRef}>
              <Stack
                sx={{
                  // display:'none',
                  width: "100%",
                  // minWidth: { xs: "300px", sm: "360px", md: "400px" },
                  minWidth: "600px",
                  gap: "1.5rem",
                  padding: 5,
                }}
              >
                <PrintTable width="90%">
                  <tbody>
                    {columns.map(
                      (column: any) =>
                        column.viewFieldVisible && (
                          <PrintRenderFields
                            viewId={currentView.id}
                            key={column.id}
                            column={column}
                            isPrint={true}
                            currentMode={currentMode}
                            values={rowData[0]}
                            submit={submit}
                            setValues={setValues}
                            translations={translations}
                          />
                        )
                    )}
                  </tbody>
                </PrintTable>
              </Stack>
            </div>
          </div>
          <div
            hidden={false}
            style={{
              marginLeft: -9999,
              position: "absolute",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <div
              id={`imagePreview-${currentView.id}-${values ? values["id"] : 0}`}
            >
              <Stack
                sx={{
                  // display:'none',
                  width: "100%",
                  // minWidth: { xs: "300px", sm: "360px", md: "400px" },
                  minWidth: "600px",
                  gap: "1.5rem",
                  padding: 5,
                  backgroundColor: "white",
                }}
              >
                <PrintTable width="90%">
                  <tbody>
                    {columns.map(
                      (column: any) =>
                        column.viewFieldVisible && (
                          <PrintRenderFields
                            viewId={currentView.id}
                            key={column.id}
                            column={column}
                            isPrint={true}
                            currentMode={currentMode}
                            values={rowData[0]}
                            submit={submit}
                            setValues={setValues}
                            translations={translations}
                          />
                        )
                    )}
                  </tbody>
                </PrintTable>
              </Stack>
            </div>
          </div>
        </DialogActions>
      )}
    </Drawer>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setFlashMessage,
  setReadContent,
  removeReadContent,
  fetchRows,
};

export default connect(mapStateToProps, mapDispatchToProps)(RowFormPanel);
