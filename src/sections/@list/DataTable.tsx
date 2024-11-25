import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useReducer,
  ReactNode,
} from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Link,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_TableInstance,
  MRT_Virtualizer,
  MRT_SortingState,
  MRT_ColumnFiltersState,
} from "material-react-table";
import Pagination from "@mui/material/Pagination";
import RowFormPanel from "./RowFormPanel";
import useResponsive from "../../hooks/useResponsive";
import { connect } from "react-redux";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  fetchColumns,
  fetchRowsByPage,
  setCurrentView,
  setColumns,
  setFilterChanged,
  setSortChanged,
  setFieldChanged,
  setLimitChanged,
} from "src/redux/actions/viewActions";
import { View, FlatWhere, ViewFieldConfig } from "src/models/SharedModels";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import { useRouter } from "next/router";
import { ViewField } from "src/models/ViewField";
import ListFields from "./ListFields";
import {
  imageStringToJSON,
  downloadFileUrl,
  getChoiceField,
  getDefaultFieldIcon,
  getRowContent,
  getIdFromUserFieldData,
  linkStringToJSON,
  isFieldDetailOnlys,
} from "src/utils/flexlistHelper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { hasPermission } from "src/utils/permissionHelper";
import { listContentService, fieldService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
import YesNoDialog from "src/components/dialog/YesNoDialog";
import { useReactToPrint } from "react-to-print";
import PrintDataTable from "./PrintDataTable";
import sanitizeHtml from "sanitize-html";
import {
  getLocalDateTimeFromString,
  getLocalDateFromString,
  getDifferenceWithCurrent,
  convertToInteger,
  getTimeFromString,
  getDifferenceDateWithCurrent,
} from "src/utils/convertUtils";
import AddRowButton from "src/components/add-button/AddRowButton";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Head from "next/head";
import DisplayRating from "src/components/rating-field/DisplayRating";
import { fieldColors } from "src/constants/fieldColors";
import Avatar from "src/components/avatar/Avatar";
import { useToPng } from "@hugocxl/react-to-image";
import { toPng } from "html-to-image";
import SwitchBox from "src/components/switch/SwitchBox";
import { colors } from "./fieldConfig/ChoiceConfig";
import { cloneDeep, set, update } from "lodash";

type DataTableProps = {
  translations: TranslationText[];
  currentView: View;
  columns: ViewField[];
  rows: any[];
  count: number;
  allViewUsers: any[];
  readContents: number[];
  refresh: Boolean;
  fetchRowsByPage: (page?: number, limit?: number) => void;
  setCurrentView: (view: View) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
  clearRefresh: () => void;
  setColumns: (columns: any) => void;
  setFilterChanged: (value: boolean) => void;
  setSortChanged: (value: boolean) => void;
  setFieldChanged: (value: boolean) => void;
  setLimitChanged: (value: boolean) => void;
};

const DataTable = ({
  translations,
  currentView,
  columns,
  rows,
  count,
  allViewUsers,
  readContents,
  refresh,
  fetchRowsByPage,
  setCurrentView,
  setFlashMessage,
  clearRefresh,
  setColumns,
  setFilterChanged,
  setSortChanged,
  setFieldChanged,
  setLimitChanged,
}: DataTableProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const isMountedForSort = useRef(true);
  const isMountedForFilter = useRef(true);
  const componentRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const router = useRouter();
  const [isLoadedCurrentContent, setIsLoadedCurrentContent] = useState(false);
  const isDesktop = useResponsive("up", "md");
  const isMobile = useResponsive("down", "md");
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  // const [visibleFieldManagementPanel, setVisibleFieldManagementPanel] =
  useState(false);
  const [rowSelection, _setRowSelection] = useState({});
  const setRowSelection: /*React.Dispatch<React.SetStateAction<{}>>*/ any = (
    rows: any
  ) => {
    _setRowSelection(rows);
    //console.log("rows selected", typeof rows === "function" ? rows() : "blob");
  };

  const [selectedRowData, setSelectedRowData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: currentView.limit ?? 25,
  });
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const tableInstanceRef = useRef<MRT_TableInstance<any>>(null);
  const rerender = useReducer(() => ({}), {})[1];
  const [windowHeight, setWindowHeight] = useState(0);
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">(
    "view"
  );
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [printRows, setPrintRows] = useState<any[]>([]);
  const [toggleBulkAction, setToggleBulkAction] = useState(false);
  //const [selectedContentId, setSelectedContentId] = useState<number>();

  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(currentPage);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [columnSizing, setColumnSizing] = useState<any>({});

  const booleanList = ["Yes", "No"];
  const [tableKey, setTableKey] = useState(0);
  const [sublistMaxMediaLength, setSublistMaxMediaLength] = useState(0);
  const [openPagination, setOpenPagination] = useState(false);

  type Mark = {
    isRead: boolean;
    isSelected: boolean;
  };
  type MarkedRows = {
    [id: number]: Mark;
  };
  const [markRows, _setMarkRows] = useState<MarkedRows>({});
  const setMarkRows: any = (rows: any) => {
    _setMarkRows(rows);
    // console.log(
    //   "rows marked",
    //   rows,
    //   typeof rows,
    //   typeof rows === "function" ? rows() : "blob"
    // );
  };

  // const [_, convert, _1] = useToPng<HTMLDivElement>({
  //   selector: `.MuiTableContainer-root`,
  //   quality: 0.8,
  //   onSuccess: (data: any) => {
  //     //console.log(data);
  //     const link = document.createElement("a");
  //     link.download = `${currentView?.name}-${currentView.id}.png`;
  //     link.href = data;
  //     link.click();
  //   },
  // });

  const handleDropdownPageChange = (
    event: SelectChangeEvent<number>,
    child: ReactNode
  ) => {
    const newPage = event.target.value as number;
    setPage(newPage);
    _handleChange(newPage);
  };

  const bulkActions = [
    {
      title: t("Edit"),
      icon: <EditIcon sx={{ width: { xs: 16, lg: 20 } }} />,
      action: "edit",
      allowed: hasPermission(currentView?.role, "Update"),
    },
    {
      title: t("Clone"),
      icon: <ContentCopyIcon sx={{ width: { xs: 16, lg: 20 } }} />,
      action: "clone",
      allowed: hasPermission(currentView?.role, "Update"),
    },
    {
      title: t("Archive"),
      icon: <ArchiveIcon sx={{ width: { xs: 16, lg: 20 } }} />,
      action: "archive",
      allowed: hasPermission(currentView?.role, "Update"),
    },
    {
      title: t("Unarchive"),
      icon: <UnarchiveIcon sx={{ width: { xs: 16, lg: 20 } }} />,
      action: "unarchive",
      allowed: hasPermission(currentView?.role, "Update"),
    },
    {
      title: t("Print"),
      icon: <PrintIcon sx={{ width: { xs: 16, lg: 20 } }} />,
      action: "print",
      allowed: hasPermission(currentView?.role, "Read"),
    },
    {
      title: t("Delete"),
      icon: <DeleteIcon sx={{ width: { xs: 16, lg: 20 } }} />,
      action: "delete",
      color: "#c92929",
      allowed: hasPermission(currentView?.role, "Delete"),
    },
  ];

  const MEDIA_WIDTH = 32;
  const MEDIA_HEIGHT = 32;
  const MEDIA_GAP = 4;
  const MEDIA_MORE = 10;

  useEffect(() => {
    if (refresh) fetchRowsByPage(currentView.page, currentView.limit ?? 25);
  }, [refresh]);

  useEffect(() => {
    fetchRowsByPage(0, currentView.limit ?? 25);
  }, []);

  useEffect(() => {
    // let columnSizing: any = {};
    // const columnVisibility = columns.map((column: ViewField) => {
    //   if (currentView.fields && currentView.fields.length) {
    //     const fieldSetting = currentView.fields.find(
    //       (field: any) => field.id === column.id
    //     );
    //     if (fieldSetting) {
    //       if (fieldSetting.columnSize) {
    //         if (fieldSetting.name === "id")
    //           columnSizing.id = fieldSetting.columnSize;
    //         else columnSizing[column.id] = fieldSetting.columnSize;
    //       }
    //       return {
    //         [column.id]: fieldSetting.visible && !fieldSetting.detailsOnly,
    //       };
    //     } else return { [column.id]: true };
    //   } else return { [column.id]: true };
    // });
    // setColumnVisibility(Object.assign({}, ...columnVisibility));
    // setColumnSizing(columnSizing);
    // if (
    //   pagination.pageIndex !== currentView.page ||
    //   pagination.pageSize !== currentView.limit
    // ) {
    //   setPagination({
    //     pageIndex: currentView.page || 0,
    //     pageSize: currentView.limit || 25,
    //   });
    //   fetchRowsByPage(currentView.page, currentView.limit);
    // }
    let columnSizing: any = {};
    // let currentColumnVisibility: any = {};
    for (const column of columns) {
      //check field visibility
      // currentColumnVisibility[getColumnKey(column)] = isFieldShown(
      //   column,
      //   currentView?.fields
      // );
      let fieldSetting = currentView?.fields?.find(
        (field: any) => field.id === column.id
      );
      if (fieldSetting && fieldSetting.columnSize) {
        columnSizing[getColumnKey(column).toString()] = fieldSetting.columnSize;
      }
    }
    // setColumnVisibility(currentColumnVisibility);
    setColumnSizing(columnSizing);
    if (
      pagination.pageIndex !== currentView.page ||
      pagination.pageSize !== currentView.limit
    ) {
      setPagination({
        pageIndex: currentView.page || 0,
        pageSize: currentView.limit || 25,
      });
      // fetchRowsByPage(currentView.page, currentView.limit);
    }
  }, [currentView.id, currentView.page, currentView.limit]);

  // useEffect(() => {
  //   let fields = currentView?.fields ? cloneDeep(currentView.fields) : [];
  //   let newFields: ViewFieldConfig[] = [];
  //   for (const key of Object.keys(columnVisibility)) {
  //     let isShow = columnVisibility[key];
  //     const column = columns.find(
  //       (column) => getColumnKey(column).toString() === key.toString()
  //     );
  //     if (column) {
  //       //first check in current fields if exist then update
  //       let fieldSetting = fields?.find((field: any) => field.id === column.id);
  //       if (fieldSetting) {
  //         fieldSetting.detailsOnly = !isShow;
  //       } else {
  //         fieldSetting = {
  //           id: column.id,
  //           visible: isShow,
  //           color: column.viewFieldColor,
  //           name: column.viewFieldName,
  //           detailsOnly: !isShow,
  //           ordering: column.viewFieldOrdering,
  //           default: column.defaultValue,
  //         };
  //       }
  //       newFields.push(fieldSetting);
  //     }
  //   }
  //   if (newFields && newFields.length > 0) {
  //     const newView = Object.assign({}, currentView);
  //     newView.fields = newFields;
  //     setCurrentView(newView);
  //     setFieldChanged(true);
  //   }
  // }, [columnVisibility]);

  // useEffect(() => {
  //   let newFields = currentView?.fields ? cloneDeep(currentView.fields) : [];
  //   for (const key of Object.keys(columnSizing)) {
  //     let size = columnSizing[key];
  //     const column = columns.find(
  //       (column) => getColumnKey(column).toString() === key.toString()
  //     );
  //     if (column) {
  //       //first check in current fields if exist then update
  //       let fieldSetting = newFields?.find(
  //         (field: any) => field.id === column.id
  //       );
  //       if (fieldSetting) {
  //         fieldSetting.columnSize = size;
  //       } else {
  //         let newFieldSetting = {
  //           id: column.id,
  //           visible: column.viewFieldVisible,
  //           color: column.viewFieldColor,
  //           name: column.viewFieldName,
  //           detailsOnly: column.viewFieldDetailsOnly,
  //           ordering: column.viewFieldOrdering,
  //           default: column.defaultValue,
  //           columnSize: size,
  //         };
  //         newFields.push(newFieldSetting);
  //       }
  //     }
  //   }
  //   if (newFields && newFields.length > 0) {
  //     const newView = Object.assign({}, currentView);
  //     newView.fields = newFields;
  //     setCurrentView(newView);
  //     setFieldChanged(true);
  //   }
  // }, [columnSizing]);

  // const updateViewFieldConfig = (field: any) => {
  //   let newView: View = Object.assign({}, currentView);
  //   let viewFieldConfig: ViewFieldConfig = {
  //     id: field.id,
  //     visible: field.viewFieldVisible,
  //     color: field.viewFieldColor,
  //     name: field.viewFieldName,
  //     detailsOnly: field.viewFieldDetailsOnly,
  //     ordering: field.viewFieldOrdering,
  //     default: field.defaultValue,
  //     columnSize: field?.columnSize,
  //   };

  //   if (newView.fields) {
  //     const currentViewFieldIndex = newView.fields.findIndex(
  //       (x) => x.id === viewFieldConfig.id
  //     );

  //     if (currentViewFieldIndex >= 0) {
  //       newView.fields[currentViewFieldIndex] = viewFieldConfig;
  //     } else {
  //       newView.fields.push(viewFieldConfig);
  //     }
  //   } else {
  //     if (!viewFieldConfig.visible || viewFieldConfig.columnSize)
  //       newView.fields = [viewFieldConfig];
  //   }

  //   if (newView.fields) {
  //     setCurrentView(newView);
  //     setFieldChanged(true);
  //   }
  // };
  // make a screenshot if we need one
  // useEffect(() => {
  //   async function f() {
  //     setTimeout(async () => {
  //       console.log("generating image");
  //       const f = await toPng(document.getElementsByTagName("body")[0]);
  //       const link = document.createElement("a");
  //       link.download = `${currentView?.name}-${currentView.id}.png`;
  //       link.href = f;
  //       link.click();
  //     }, 10000);
  //   }
  //   f();
  // }, []);

  const setRead = (rowId: number, selected?: boolean) => {
    let newMarkRows = { ...markRows };
    //console.log("from before set read", markRows);
    if (!markRows[rowId]) {
      newMarkRows[rowId] = { isRead: true, isSelected: false };
    } else {
      newMarkRows[rowId] = {
        isSelected: newMarkRows[rowId].isSelected,
        isRead: true,
      };
    }
    if (typeof selected !== "undefined") {
      markSelected(newMarkRows, rowId);
    }
    setMarkRows(newMarkRows);
    // console.log("from set read", newMarkRows);
  };

  const markSelected = (newMarkRows: MarkedRows, rowId: number) => {
    newMarkRows[rowId] = { isRead: true, isSelected: true };
    for (const _rowId of Object.keys(newMarkRows)) {
      if (parseInt(_rowId) !== rowId) {
        // console.log("checking", _rowId, newMarkRows[parseInt(_rowId)]);
        newMarkRows[parseInt(_rowId)] = {
          isRead: newMarkRows[parseInt(_rowId)]?.isRead ?? false,
          isSelected: false,
        };
      }
    }
  };

  const setSelectedContentId = (rowId: number) => {
    //console.log("set selected contetn", rowId);
    let newMarkRows = { ...markRows };
    markSelected(newMarkRows, rowId);
    setMarkRows(newMarkRows);
    //console.log("from set visible", newMarkRows);
  };

  const isReadContent = /*useCallback(*/ (contentId: number) => {
    return readContents.includes(contentId);
  }; /*, [])*/

  const createMarkedRows = () => {
    if (rows && rows.length > 0) {
      let newMarkRows: Mark[] = [];
      for (let i = 0; i < rows.length; i++) {
        let isRead = isReadContent(rows[i].id);
        if (markRows && markRows[rows[i].id as number]) {
          // maybe we already set it locally
          isRead ||= markRows[rows[i].id as number]?.isRead ?? false;
          newMarkRows[rows[i].id as number] = {
            isSelected: markRows[rows[i].id as number].isSelected,
            isRead,
          };
        } else {
          newMarkRows[rows[i].id as number] = { isRead, isSelected: false };
        }
      }
      setMarkRows(newMarkRows);
      //console.log("from set all rows", newMarkRows);
    }
  };

  useEffect(() => {
    // console.log('aaa')
    // setTableKey(tableKey + 1);
  }, [columns]);

  useEffect(() => {
    createMarkedRows();
  }, [rows, readContents]);

  useEffect(() => {
    if (
      router.isReady &&
      rows.length > 0 &&
      router.query.contentId &&
      !isLoadedCurrentContent
    ) {
      fetchContent(convertToInteger(router.query.contentId));
      setIsLoadedCurrentContent(true);
    }
  }, [router.isReady, router.query.contentId, rows]);

  const fetchContent = async (id: number) => {
    let currentRow = await getRowContent(currentView.id, id, rows);

    if (currentRow) {
      setSelectedRowData([currentRow]);
      setMode("view");
      setVisibleAddRowPanel(true);
      setSelectedContentId(id);
    }
  };

  useEffect(() => {
    if (router.query.rowId) {
      const row = rows.find(
        (row, i) => row.id === parseInt(router.query.rowId as string)
      );
      if (row) {
        const index = rows.indexOf(row);
        editRow({ original: row, index: index });
      }
    }

    setToggleBulkAction(false);
    setRowSelection({});
  }, [rows, router.query]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (Object.keys(rowSelection).length) {
      // setSelectedRowData(
      //   rows[parseInt(Object.keys(rowSelection).pop() || "0")]
      // );
      setPrintRows(
        Object.keys(rowSelection).map((key: any) => {
          let row = rows.find((row) => row.id === parseInt(key));
          if (row) {
            return row;
          }
        })
      );
    } else setToggleBulkAction(false);

    clearRefresh();
  }, [rows, rowSelection]);

  useEffect(() => {
    if (!isMountedForSort.current) {
      let newCurrentView: View = Object.assign({}, currentView);

      sorting.map((sort: any) => {
        if (newCurrentView.order) {
          const oldOrder = newCurrentView.order.find(
            (order: any) => order.fieldId === parseInt(sort.id)
          );

          if (oldOrder) {
            newCurrentView.order = newCurrentView.order.map((order: any) =>
              order.fieldId === parseInt(sort.id)
                ? {
                    fieldId: parseInt(sort.id),
                    direction: sort.desc ? "desc" : "asc",
                  }
                : order
            );
          } else {
            newCurrentView.order.push({
              fieldId: parseInt(sort.id),
              direction: sort.desc ? "desc" : "asc",
            });
          }
        } else {
          newCurrentView.order = [
            {
              fieldId: parseInt(sort.id),
              direction: sort.desc ? "desc" : "asc",
            },
          ];
        }
      });

      if (newCurrentView.order) {
        newCurrentView.order = newCurrentView.order.filter((order: any) =>
          sorting.find((sort: any) => parseInt(sort.id) === order.fieldId)
        );
      }

      setCurrentView(newCurrentView);
      fetchRowsByPage(newCurrentView.page, newCurrentView.limit ?? 25);

      if (newCurrentView?.order !== currentView.order) setSortChanged(true);
    } else {
      isMountedForSort.current = false;
    }
  }, [sorting]);

  useEffect(() => {
    if (!isMountedForFilter.current) {
      let newCurrentView: View = Object.assign({}, currentView);

      if (newCurrentView.conditions && newCurrentView.conditions.length) {
        columnFilters.map((filter: any) => {
          const oldFilter = newCurrentView?.conditions?.find(
            (el: any) => el.left === parseInt(filter.id)
          );
          const newFilter: FlatWhere = {
            left: parseInt(filter.id),
            leftType: "Field",
            right: getCondition(filter).right,
            rightType: "SearchString",
            cmp: getCondition(filter).cmp,
          } as FlatWhere;

          if (oldFilter)
            newCurrentView.conditions = newCurrentView.conditions?.map(
              (el: any) => (el.left === parseInt(filter.id) ? newFilter : el)
            );
          else {
            newCurrentView.conditions?.push("And");
            newCurrentView.conditions?.push(newFilter);
          }
        });

        newCurrentView.conditions.map((condition: any, index: number) => {
          if (
            !columnFilters.find(
              (el: any) => parseInt(el.id) === condition.left
            ) &&
            condition !== "And" &&
            condition !== "Or"
          )
            newCurrentView.conditions = removeFilter(
              newCurrentView.conditions || [],
              index
            );
        });
      } else {
        newCurrentView.conditions = [];

        columnFilters.map((filter: any, index: number) => {
          const newFilter: FlatWhere = {
            left: parseInt(filter.id),
            leftType: "Field",
            right: getCondition(filter).right,
            rightType: "SearchString",
            cmp: getCondition(filter).cmp,
          } as FlatWhere;

          if (index) newCurrentView.conditions?.push("And");
          newCurrentView.conditions?.push(newFilter);
        });
      }

      setCurrentView(newCurrentView);
      fetchRowsByPage(newCurrentView.page, newCurrentView.limit ?? 25);

      setFilterChanged(true);
    } else {
      isMountedForFilter.current = false;
    }
  }, [columnFilters]);

  useEffect(() => {
    if (tableInstanceRef && tableInstanceRef.current) {
      const cells =
        tableInstanceRef.current?.refs.tableContainerRef.current?.querySelectorAll(
          ".media_cell"
        );

      if (cells && cells.length)
        setSublistMaxMediaLength(
          Math.floor(
            (cells[0]?.clientWidth - MEDIA_MORE) / (MEDIA_WIDTH + MEDIA_GAP)
          )
        );
    }
  }, [tableInstanceRef.current]);

  const getCondition = (filter: any) => {
    const columnType = columns.find(
      (column: any) => column.id === parseInt(filter.id)
    )?.uiField;
    let cmp = "like";
    let right = filter.value;
    if (
      columnType !== FieldUiTypeEnum.Text &&
      columnType !== FieldUiTypeEnum.LongText &&
      columnType !== FieldUiTypeEnum.Markdown &&
      columnType !== FieldUiTypeEnum.HTML &&
      columnType !== FieldUiTypeEnum.Link
    ) {
      cmp = "eq";
      if (columnType === FieldUiTypeEnum.Boolean) {
        right = filter.value === "Yes" ? true : false;
      }
    }

    return { cmp: cmp, right: right };
  };

  const removeFilter = (conditions: any[], index: number) => {
    return conditions.filter((filter: any, i: number) => {
      if (index === 0) {
        return i !== index && i !== index + 1;
      } else {
        return i !== index && i !== index - 1;
      }
    });
  };

  const renderUserFieldData = (cellValue: string) => {
    if (!cellValue) return "";

    const cellUsers = allViewUsers.filter((x: any) =>
      cellValue
        .split("; ")
        .find(
          (selectedUser: string) =>
            parseInt(getIdFromUserFieldData(selectedUser)) === x.userId
        )
    );

    return (
      <Box sx={{ display: "flex" }}>
        {cellUsers.map((cellUser: any, index: number) => (
          <Box
            key={index}
            sx={{
              marginLeft: index ? "-7px" : "inherit",
              zIndex:
                cellUsers.filter((user: any, index: number) => index < 2)
                  .length - index,
              fontWeight: "normal",
            }}
          >
            <Avatar
              label={`${cellUser.firstName.charAt(0)}${cellUser.lastName.charAt(
                0
              )}`}
              avatarUrl={cellUser.avatarUrl || ""}
              color={cellUser.color || ""}
              size={28}
              toolTipLabel={cellUser.name}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const renderImageCell = (
    fielValue: string,
    viewId: number,
    fieldId: number
  ) => {
    return (
      <Tooltip
        title={
          <Box
            component="img"
            sx={{
              maxHeight: { xs: 600, md: 400 },
              maxWidth: { xs: 800, md: 600 },
            }}
            alt=""
            src={
              fielValue && imageStringToJSON(fielValue)?.fileId
                ? downloadFileUrl(
                    imageStringToJSON(fielValue)?.fileId?.toString(),
                    viewId,
                    fieldId
                  )
                : ""
            }
          />
        }
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: theme.palette.palette_style.background.default,
              boxShadow: "0 0 12px 0 rgba(0,0,0,.2)",
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              maxWidth: { xs: 800, md: 400 },
              minHeight: 24,
              p: 2,
              border: `1px solid ${theme.palette.palette_style.border.default}`,
            },
          },
        }}
      >
        <Box
          component="img"
          sx={{
            maxHeight: MEDIA_HEIGHT,
            maxWidth: MEDIA_WIDTH,
          }}
          alt=""
          src={
            fielValue && imageStringToJSON(fielValue)?.fileId
              ? downloadFileUrl(
                  imageStringToJSON(fielValue)?.fileId?.toString(),
                  viewId,
                  fieldId
                )
              : ""
          }
        />
      </Tooltip>
    );
  };

  const renderVideoCell = (
    fieldValue: string,
    viewId: number,
    fieldId: number
  ) => {
    return (
      <Box
        component="video"
        sx={{
          height: MEDIA_HEIGHT,
          width: MEDIA_WIDTH,
          display: "flex",
          alignItems: "center",
        }}
        src={
          fieldValue && imageStringToJSON(fieldValue)?.fileId
            ? downloadFileUrl(
                imageStringToJSON(fieldValue)?.fileId?.toString(),
                viewId,
                fieldId
              )
            : ""
        }
      />
    );
  };

  const renderColorCell = (value: string) => {
    return (
      <Box
        sx={{
          textAlign: "center",
          // bgcolor: cellValue,
          color: value,
          // px: 10,
          maxWidth: 100,
        }}
      >
        {/* {cellValue} */}
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: value,
            // display: "grid",
            // placeContent: "center",
            borderRadius: "100px",
            // cursor: "pointer",
            // position: "relative",
          }}
        ></div>
      </Box>
    );
  };

  const renderLinkCell = (value: any) => {
    return value ? (
      <Link
        rel="noopener noreferrer"
        href={linkStringToJSON(value).linkValue}
        target="_blank"
      >
        {linkStringToJSON(value).name
          ? linkStringToJSON(value).name
          : linkStringToJSON(value).linkValue}
      </Link>
    ) : (
      <></>
    );
  };

  const renderChoiceCell = (
    renderedCellValue: string,
    dataColumn: ViewField,
    isSubField?: boolean
  ) => {
    const choice = getChoiceField(renderedCellValue, dataColumn, isSubField);

    if (choice && choice.length > 1) {
      const tooltipContent = choice?.map((choice: any, i: number) => (
        <Box key={`choice_cell_${i}`} sx={{ display: "flex" }}>
          <Box
            sx={{
              textAlign: "center",
              bgcolor: choice?.color?.bg,
              borderRadius: "20px",
              color: choice?.color?.fill,
              fontFamily: choice?.font,
              px: 1.5,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              marginTop: "2px",
              minHeight: "18px",
            }}
          >
            {choice.label}
          </Box>
        </Box>
      ));

      return (
        <Tooltip
          title={tooltipContent}
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: theme.palette.palette_style.background.default,
                boxShadow: "0 0 12px 0 rgba(0,0,0,.2)",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                maxWidth: { xs: 240, md: 400 },
                minHeight: 24,
                p: 2,
                border: `1px solid ${theme.palette.palette_style.border.default}`,
                "&::before": {
                  content: '"All tags:"',
                  color: theme.palette.palette_style.text.primary,
                  position: "sticky",
                  top: 0,
                  left: 0,
                  display: "block",
                  width: "100%",
                  fontSize: "14px",
                  fontWeight: 400,
                },
              },
            },
          }}
        >
          <Box sx={{ display: "flex" }}>
            {choice?.map((choice: any, i: number) => (
              <Box
                key={`choice_label_${i}`}
                sx={{
                  textAlign: "center",
                  bgcolor: choice?.color?.bg,
                  borderRadius: "20px",
                  color: choice?.color?.fill,
                  fontFamily: choice?.font,
                  px: 1.5,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  marginTop: "2px",
                }}
              >
                {choice?.label}
              </Box>
            ))}
          </Box>
        </Tooltip>
      );
    } else {
      return (
        <Box sx={{ display: "flex" }}>
          {choice?.map((choice: any, i: number) => (
            <Box
              key={`choice_label_${i}`}
              sx={{
                textAlign: "center",
                bgcolor: choice?.color?.bg,
                borderRadius: "20px",
                color: choice?.color?.fill,
                fontFamily: choice?.font,
                px: 1.5,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                marginTop: "2px",
              }}
            >
              {choice?.label}
            </Box>
          ))}
        </Box>
      );
    }
  };

  const renderRelationFieldData = (
    column: ViewField,
    cellValue: string,
    fieldUiType: FieldUiTypeEnum
  ) => {
    if (!cellValue) return "";
    let uiField =
      fieldUiType === FieldUiTypeEnum.Sublist
        ? column?.config?.values?.subField?.uiField
        : column?.config?.values?.lookupField?.uiField;
    if (!uiField) return "";
    switch (uiField) {
      case FieldUiTypeEnum.Image:
        return (
          <Box className="media_cell" sx={{ display: "flex" }}>
            {cellValue.split(",").map(
              (value: any, index: number) =>
                index < sublistMaxMediaLength && (
                  <Box
                    key={`sublist_image_${index}`}
                    sx={{ mr: `${MEDIA_GAP}px` }}
                  >
                    {renderImageCell(
                      value,
                      column.config.values.viewId,
                      column.config.values.rightFieldId
                    )}
                  </Box>
                )
            )}
            {cellValue.split(",").length > sublistMaxMediaLength && (
              <Box sx={{ pt: 1 }}>...</Box>
            )}
          </Box>
        );
      case FieldUiTypeEnum.DateTime:
        return getLocalDateTimeFromString(cellValue);
      case FieldUiTypeEnum.Date:
        return getLocalDateFromString(cellValue);
      case FieldUiTypeEnum.Time:
        return cellValue
          .split(",")
          .map(
            (value: string) => getLocalDateTimeFromString(value).split(", ")[1]
          )
          .join(",");
      case FieldUiTypeEnum.Color:
        return (
          <Box sx={{ display: "flex" }}>
            {cellValue.split(",").map((value: any, i: number) => (
              <Box key={`sub_color_${i}`} sx={{ mr: 0.5 }}>
                {renderColorCell(value)}
              </Box>
            ))}
          </Box>
        );
      case FieldUiTypeEnum.Choice:
        return renderChoiceCell(cellValue, column.config.values.subField, true);
      case FieldUiTypeEnum.Link:
        return (
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {cellValue.split(",").map((value: any, index: number) => (
              <>
                {index ? "," : ""}
                {renderLinkCell(value)}
              </>
            ))}
          </Box>
        );
      case FieldUiTypeEnum.Video:
        return (
          <Box className="media_cell" sx={{ display: "flex" }}>
            {cellValue.split(",").map(
              (value: any, index: number) =>
                index < sublistMaxMediaLength && (
                  <Box
                    key={`sublist_video_${index}`}
                    sx={{ mr: `${MEDIA_GAP}px` }}
                  >
                    {renderVideoCell(
                      value,
                      column.config.values.viewId,
                      column.config.values.rightFieldId
                    )}
                  </Box>
                )
            )}
            {cellValue.split(",").length > sublistMaxMediaLength && (
              <Box sx={{ pt: 1 }}>...</Box>
            )}
          </Box>
        );
      case FieldUiTypeEnum.Document:
        return cellValue
          .split(",")
          .map(
            (value: any, i: number) =>
              (i ? "," : "") + imageStringToJSON(value).fileName
          );

      default:
        return cellValue;
    }
  };

  const getColumnKey = (column: any): string => {
    if (
      column.system &&
      (column.name === "id" ||
        column.name === "createdAt" ||
        column.name === "updatedAt")
    ) {
      return column.name;
    }
    return column.id;
  };

  const getChoiceList = (id: number) => {
    const choiceColumn = columns.find((column: any) => column.id === id);
    return choiceColumn?.config?.values.map((choice: any) => choice.label);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getColumns = (dataColumns: any[]) => {
    return dataColumns.map((dataColumn: any) => {
      const fieldIcon =
        dataColumn.icon ?? getDefaultFieldIcon(dataColumn.uiField);
      return {
        accessorKey: `${getColumnKey(dataColumn)}`,
        header: dataColumn.system
          ? t(dataColumn.viewFieldName)
          : dataColumn.viewFieldName,
        enableHiding: dataColumn.system || !dataColumn.required,
        Header: ({ column }: any) => {
          return useMemo(() => {
            //console.log("column", column.id);
            return (
              <Box sx={{ display: "flex" }} key={column.id}>
                {fieldIcon && (
                  <Box
                    component="span"
                    className="svg-color"
                    sx={{
                      width: 16,
                      height: 16,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.text.primary,
                      mask: `url(/assets/icons/table/${fieldIcon}.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/table/${fieldIcon}.svg) no-repeat center / contain`,
                      marginTop: 0.5,
                      marginRight: 1,
                    }}
                  />
                )}
                {dataColumn.name === "id" && dataColumn.system ? (
                  <Box>{column.columnDef.header}</Box>
                ) : (
                  <Box
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {column.columnDef.header}
                  </Box>
                )}
              </Box>
            );
          }, [dataColumn.id, column.columnDef.header]);
        },
        Cell: ({ renderedCellValue, row }: any) => {
          const [rating, setRating] = useState<number | null>(null);
          //function renderFieldData(dataColumn: ViewField, cellValue: any) {
          return useMemo(() => {
            //console.log(`renderFieldData`, row.id, dataColumn.id);
            switch (dataColumn.uiField) {
              case FieldUiTypeEnum.Integer:
              case FieldUiTypeEnum.Float:
              case FieldUiTypeEnum.Decimal:
              case FieldUiTypeEnum.Double:
              case FieldUiTypeEnum.Money:
              case FieldUiTypeEnum.Percentage:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {renderedCellValue}
                  </Box>
                );
              case FieldUiTypeEnum.DateTime:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {renderedCellValue && renderedCellValue != null
                      ? `${getLocalDateTimeFromString(
                          renderedCellValue
                        )} (${getDifferenceWithCurrent(renderedCellValue)})`
                      : ""}
                  </Box>
                );
              case FieldUiTypeEnum.Date:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {renderedCellValue && renderedCellValue != null
                      ? `${getLocalDateFromString(
                          renderedCellValue
                        )} (${getDifferenceDateWithCurrent(renderedCellValue)})`
                      : ""}
                  </Box>
                );
              case FieldUiTypeEnum.Time:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {renderedCellValue && renderedCellValue != null
                      ? getTimeFromString(renderedCellValue)
                      : ""}
                  </Box>
                );
              case FieldUiTypeEnum.Text:
              case FieldUiTypeEnum.LongText:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {renderedCellValue}
                  </Box>
                );
              case FieldUiTypeEnum.HTML:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {!renderedCellValue
                      ? ""
                      : sanitizeHtml(
                          renderedCellValue.toString().replace(/</g, " <"),
                          {
                            allowedTags: [],
                          }
                        )}
                  </Box>
                );
              case FieldUiTypeEnum.Markdown:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {renderedCellValue}
                  </Box>
                );
              case FieldUiTypeEnum.Choice:
                return renderChoiceCell(renderedCellValue, dataColumn);
              case FieldUiTypeEnum.Boolean:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    {/* {cellValue?.toString() === "true" ? "yes" : "no"} */}
                    <FormGroup>
                      <FormControlLabel
                        disabled
                        control={
                          <SwitchBox
                            checked={renderedCellValue}
                            sx={{
                              "& ::before": {
                                display: "none",
                              },
                            }}
                            checkedColor={
                              dataColumn?.config?.values?.length
                                ? dataColumn?.config?.values[0].color.bg
                                : colors[8].bg
                            }
                            uncheckedColor={
                              dataColumn?.config?.values?.length
                                ? dataColumn?.config?.values[1].color.bg
                                : colors[7].bg
                            }
                          />
                        }
                        label={
                          renderedCellValue?.toString() === "true"
                            ? "Yes"
                            : "No"
                        }
                      />
                    </FormGroup>
                  </Box>
                );
              case FieldUiTypeEnum.Image:
                return renderImageCell(
                  renderedCellValue,
                  currentView.id,
                  dataColumn.id
                );
              case FieldUiTypeEnum.Video:
                return renderVideoCell(
                  renderedCellValue,
                  currentView.id,
                  dataColumn.id
                );
              case FieldUiTypeEnum.Document:
                return (
                  <Box
                    key={row.id}
                    sx={{
                      minWidth: "100px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {imageStringToJSON(renderedCellValue)?.fileName}
                  </Box>
                );
              case FieldUiTypeEnum.Color:
                return renderColorCell(renderedCellValue);
              case FieldUiTypeEnum.Rating:
                return (
                  <Box
                    key={row.id}
                    sx={{ "& span::before": { display: "none" } }}
                  >
                    <DisplayRating rating={rating} />
                  </Box>
                );
              case FieldUiTypeEnum.Lookup:
                return (
                  <Box>
                    {row?.original
                      ? renderRelationFieldData(
                          dataColumn,
                          row.original[`___extra_${dataColumn.id}`],
                          FieldUiTypeEnum.Lookup
                        )
                      : ""}
                  </Box>
                );
              case FieldUiTypeEnum.Sublist:
                return (
                  <Box>
                    {row?.original
                      ? renderRelationFieldData(
                          dataColumn,
                          row.original[`___extra_${dataColumn.id}`],
                          FieldUiTypeEnum.Sublist
                        )
                      : ""}
                  </Box>
                );
              case FieldUiTypeEnum.User:
                return (
                  allViewUsers.length > 0 && (
                    <Box key={row.id}>
                      {renderUserFieldData(renderedCellValue)}
                    </Box>
                  )
                );
              case FieldUiTypeEnum.Link:
                return renderLinkCell(renderedCellValue);
              default:
                return <></>;
            }
          }, [
            row.id,
            dataColumn.id,
            renderedCellValue,
            // markRows[row.id]?.isRead,
            // markRows[row.id]?.isSelected,
          ]);
          //return renderFieldData(dataColumn, renderedCellValue);
        },
        minSize: dataColumn.name === "id" && dataColumn.system ? 100 : 150,
        maxSize: dataColumn.name === "id" && dataColumn.system ? 150 : 400,
        size: dataColumn.name === "id" && dataColumn.system ? 100 : 200,
        filterFn: (row: any, id: number, filterValue: string) =>
          row.getValue(id).toLowerCase().includes(filterValue.toLowerCase()),
        filterVariant:
          dataColumn.uiField === FieldUiTypeEnum.Choice ||
          dataColumn.uiField === FieldUiTypeEnum.Boolean ||
          dataColumn.uiField === FieldUiTypeEnum.Color
            ? "select"
            : "text",
        filterSelectOptions:
          dataColumn.uiField === FieldUiTypeEnum.Choice
            ? getChoiceList(dataColumn.id)
            : dataColumn.uiField === FieldUiTypeEnum.Boolean
            ? booleanList
            : fieldColors,
        enableColumnFilter:
          dataColumn.uiField === FieldUiTypeEnum.Date ||
          dataColumn.uiField === FieldUiTypeEnum.DateTime ||
          dataColumn.uiField === FieldUiTypeEnum.Time
            ? false
            : true,
      };
    });
  };

  const columnsTable = useMemo<any>(() => {
    const shouldShowField = (column: any) => {
      // return (
      //   (column.viewFieldVisible === true ||
      //     column.viewFieldVisible === undefined) &&
      //   !column.viewFieldDetailsOnly &&
      //   !column.indexed &&
      //   (!currentView.fields ||
      //     !currentView.fields.length ||
      //     typeof currentView.fields.find(
      //       (field: any) => field.id === column.id
      //     ) === "undefined" ||
      //     currentView.fields.find((field: any) => field.id === column.id)
      //       ?.visible)
      // );
      //check in view field settings first
      return isFieldDetailOnlys(column, currentView?.fields);
    };
    setTableKey(tableKey + 1);
    return getColumns(columns.filter((column: any) => shouldShowField(column)));
  }, [columns, currentView, sublistMaxMediaLength]);

  const handleRowAction = (values: any, action: string, id?: number) => {
    fetchColumns(currentView.id);
    fetchRowsByPage(currentView.page, currentView.limit ?? 25);

    if (id) fetchContent(id);
  };

  const _handleChange = (value: number) => {
    setPagination({
      ...pagination,
      pageIndex: value - 1,
    });
    var newView: View = Object.assign({}, currentView);
    newView.page = value - 1;
    setCurrentView(newView);
    fetchRowsByPage(newView.page, newView.limit ?? 25);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    _handleChange(value);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setPagination({
      pageIndex: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    var newView: View = Object.assign({}, currentView);
    newView.page = 0;
    newView.limit = parseInt(event.target.value, 10);
    setCurrentView(newView);
    setLimitChanged(true);
    fetchRowsByPage(0, newView.limit);
  };

  const handleNewRowPanel = (values: any) => {
    setMode("create");
    setVisibleAddRowPanel(true);
    setSelectedRowData([values]);
    setRowSelection({});
  };

  const editRow =
    /*useCallback(*/
    (row: any) => {
      setMode("view");
      setSelectedRowData([rows[row.index]]);
      setRead(rows[row.index].id, true);
      setVisibleAddRowPanel(true);
      //setSelectedContentId(rows[row.index].id);
    }; /*,
    [rows]
  );*/

  // const handleCloseFieldManagementPanel = () => {
  //   setVisibleFieldManagementPanel(false);
  // };

  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const handleBulkAction = async (action: string) => {
    switch (action) {
      case "edit":
        const selectedRows = rows.filter((row: any) =>
          Object.keys(rowSelection)
            .map((key: any) => parseInt(key))
            .includes(row.id)
        );

        setMode("update");
        setSelectedRowData(selectedRows);
        setVisibleAddRowPanel(true);
        return;
      case "clone":
        //console.log("rowSelection", rowSelection, rows);
        let cloneResponse = await listContentService.cloneContent(
          currentView.id,
          Object.keys(rowSelection).map((key: any) => {
            let row = rows.find((row) => row.id === parseInt(key));
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
        if (isSucc(cloneResponse)) {
          setFlashMessage({ message: "Cloned successfully", type: "success" });
          setRowSelection({});
        } else {
          setFlashMessage({
            message: (cloneResponse as FlexlistsError).message,
            type: "error",
          });
          setRowSelection({});
          return;
        }
        break;
      case "archive":
        let archiveResponse = await listContentService.archiveBulkContents(
          currentView.id,
          Object.keys(rowSelection).map((key: any) => parseInt(key))
        );
        if (isSucc(archiveResponse)) {
          setFlashMessage({
            message: "Archived successfully",
            type: "success",
          });
          setRowSelection({});
        } else {
          setFlashMessage({
            message: (archiveResponse as FlexlistsError).message,
            type: "error",
          });
          setRowSelection({});
          return;
        }
        break;
      case "unarchive":
        let unarchiveResponse = await listContentService.unarchiveBulkContents(
          currentView.id,
          Object.keys(rowSelection).map((key: any) => parseInt(key))
        );
        if (isSucc(unarchiveResponse)) {
          setFlashMessage({
            message: "Unarchived successfully",
            type: "success",
          });
          setRowSelection({});
        } else {
          setFlashMessage({
            message: (unarchiveResponse as FlexlistsError).message,
            type: "error",
          });
          setRowSelection({});
          return;
        }
        break;
      case "print":
        handlePrint();
        return;
      case "delete":
        setOpenBulkDeleteDialog(true);
        return;
      default:
        break;
    }
    fetchRowsByPage(currentView.page, currentView.limit ?? 25);
  };

  const handleBulkDelete = async () => {
    let deleteResponse = await listContentService.deleteBulkContents(
      currentView.id,
      Object.keys(rowSelection).map((key: any) => parseInt(key))
    );
    if (isSucc(deleteResponse)) {
      setFlashMessage({ message: "Deleted successfully", type: "success" });
      setRowSelection({});
    } else {
      setFlashMessage({
        message: (deleteResponse as FlexlistsError).message,
        type: "error",
      });
      setRowSelection({});
      return;
    }

    fetchRowsByPage(currentView.page, currentView.limit ?? 25);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleBulkActionModal = () => {
    setToggleBulkAction(!toggleBulkAction);
  };

  const muiTableHeadCellProps = useMemo(() => {
    return {
      sx: (theme: any) => ({
        color: theme.palette.palette_style.text.primary,
        backgroundColor:
          theme.palette.palette_style.background.table_header_footer,
        py: 0.7,
        height: showColumnFilters ? 84 : 40,
        borderColor: theme.palette.palette_style.border.default,
        paddingLeft: "0px !important",
        paddingRight: "16px !important",
      }),
    };
  }, []);

  const muiTableFooterCellProps = useMemo(() => {
    return {
      sx: (theme: any) => ({
        color: theme.palette.palette_style.text.primary,
        backgroundColor:
          theme.palette.palette_style.background.table_header_footer,
        p: 0,
      }),
    };
  }, []);

  const muiBottomToolbarProps = useMemo(() => {
    return {
      sx: () => ({
        height: "55px",
        backgroundColor:
          theme.palette.palette_style.background.table_header_footer,
      }),
    };
  }, []);

  const muiTableHeadCellFilterTextFieldProps = useMemo(() => {
    return {
      sx: {
        color: theme.palette.palette_style.text.primary,
        backgroundColor:
          theme.palette.palette_style.background.table_header_footer,
        px: 1,
        height: 40,
        marginTop: "12px",
      },
    };
  }, []);

  const muiTableContainerProps = useMemo(() => {
    return {
      sx: {
        backgroundColor: theme.palette.palette_style.background.paper,
        height: {
          // xs: `${windowHeight - 236}px`,
          // md: `${windowHeight - 200}px`,
          // lg: `${windowHeight - 188}px`,
          height: "100%",
        },
        width: { lg: "100vw" },
        // minHeight: "300px",
        "& .MuiTableHead-root": {
          width: "100%",
        },
        "& .MuiTableRow-root": {
          boxShadow: "none",
        },
      },
    };
  }, []);

  const muiTablePaperProps = useMemo(() => {
    return {
      sx: { height: "100%" },
    };
  }, []);

  const MuiTableBodyRowProps = //useCallback(
    (row: any) => {
      const x = () => {
        // console.log("row props", row.id, markRows[row.id]);

        return {
          onClick: () => {
            editRow(row);
          },
          sx: {
            background: theme.palette.palette_style.background.table_body,
            // background: "red",
            cursor: "pointer",
            position: "relative",
            overflowY: "hidden",
            "& :first-of-type::before": {
              content: "''",
              position: "absolute",
              width: "4px",
              height: "32px",
              transform: "translate(-4px,-50%)",
              left: "0",
              top: "50%",
              background:
                markRows && markRows[row.id]?.isSelected
                  ? "rgb(84, 166, 251)"
                  : !(markRows && markRows[row.id]?.isRead)
                  ? "rgb(84, 166, 251, 0.5)"
                  : "none",
            },
          },
        };
      }; /*, */
      return useMemo(x, [
        row.id,
        markRows[row.id]?.isRead,
        markRows[row.id]?.isSelected,
        editRow,
      ]);
      return x();
    };

  const MuiTableBodyCellProps = // useCallback(
    (row: any) => {
      return useMemo(() => {
        //console.log("cell props", row.id, markRows[row.id]);
        return {
          sx: (theme: any) => ({
            color: theme.palette.palette_style.text.primary,
            py: 0,
            height: 32,
            fontWeight:
              markRows && markRows[row.id]?.isRead ? "normal" : "bold",
            background:
              markRows && markRows[row.id]?.isSelected
                ? "rgba(84, 166, 251, 0.2)"
                : !(markRows && markRows[row.id]?.isRead)
                ? "rgba(84, 166, 251, 0.05)"
                : "none",
            paddingLeft: "0px !important",
            paddingRight: "16px !important",
          }),
        };
      }, [row.id, markRows[row.id]?.isRead, markRows[row.id]?.isSelected]);
    };
  const onColumnVisibilityChange = (updater: any) => {
    if (updater instanceof Function) {
      let visibleField = updater();
      if (visibleField && Object.keys(visibleField).length > 0) {
        let key = Object.keys(visibleField)[0];
        let newView = Object.assign({}, currentView);
        let column = columns.find((x) => getColumnKey(x).toString() === key);
        if (column) {
          let fieldSetting = newView.fields?.find((x) => x.id === column?.id);
          if (fieldSetting) {
            fieldSetting.detailsOnly = true;
          } else {
            let newFieldSetting = {
              id: column.id,
              detailsOnly: true,
              visible: column.viewFieldVisible,
              color: column.viewFieldColor,
              name: column.viewFieldName,
            };
            if (newView?.fields && newView?.fields?.length > 0) {
              newView.fields.push(newFieldSetting);
            } else {
              newView.fields = [newFieldSetting];
            }
          }
          setCurrentView(newView);
          setFieldChanged(true);
        }
      }
    }
  };
  const onColumnSizingChange = (updater: any) => {
    if (updater instanceof Function) {
      let currentColumnSizing = updater();
      if (currentColumnSizing && Object.keys(currentColumnSizing).length > 0) {
        let key = Object.keys(currentColumnSizing)[0];
        let size = currentColumnSizing[key];
        let newView = Object.assign({}, currentView);
        let column = columns.find((x) => getColumnKey(x).toString() === key);
        if (column) {
          let fieldSetting = newView.fields?.find((x) => x.id === column?.id);
          if (fieldSetting) {
            fieldSetting.columnSize = size;
          } else {
            fieldSetting = {
              id: column.id,
              detailsOnly: column.viewFieldDetailsOnly,
              visible: column.viewFieldVisible,
              color: column.viewFieldColor,
              name: column.viewFieldName,
              columnSize: size,
            };
            if (newView?.fields && newView?.fields?.length > 0) {
              newView.fields.push(fieldSetting);
            } else {
              newView.fields = [fieldSetting];
            }
          }
          setColumnSizing({ ...columnSizing, [key]: size });
          setCurrentView(newView);
          setFieldChanged(true);
        }
      }
    }
  };
  const renderMuiReactTable = useMemo(() => {
    //console.log("main table rerender");
    // The rest of your rendering logic
    return (
      <MaterialReactTable
        tableInstanceRef={tableInstanceRef}
        columns={columnsTable}
        data={rows}
        enableStickyHeader={true}
        muiTablePaperProps={muiTablePaperProps}
        muiTableContainerProps={muiTableContainerProps}
        manualSorting={true}
        manualFiltering={true}
        enableRowSelection={true}
        enableTopToolbar={false}
        enableBottomToolbar={false}
        manualPagination={true}
        enableColumnResizing
        columnResizeMode="onEnd"
        // TODO: this should be dynamically determined
        // rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
        // rowVirtualizerProps={{ overscan: 5 }}
        // columnVirtualizerProps={{ overscan: 10 }}
        muiSelectCheckboxProps={{
          color: "primary",
        }}
        muiTableBodyRowProps={({ row }: any) => MuiTableBodyRowProps(row)}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onColumnVisibilityChange={onColumnVisibilityChange}
        onColumnSizingChange={onColumnSizingChange}
        state={{
          pagination,
          rowSelection,
          showColumnFilters,
          sorting,
          columnFilters,
          // columnVisibility,
          columnSizing,
        }}
        getRowId={(row) => row.id}
        onRowSelectionChange={setRowSelection}
        onShowColumnFiltersChange={(updater: any) => {
          setShowColumnFilters((prev) =>
            updater instanceof Function ? updater(prev) : updater
          );
          queueMicrotask(rerender);
        }}
        muiTableHeadCellProps={muiTableHeadCellProps}
        muiTableFooterCellProps={muiTableFooterCellProps}
        muiTableBodyCellProps={({ row }: any) => MuiTableBodyCellProps(row)}
        muiBottomToolbarProps={muiBottomToolbarProps}
        muiTableHeadCellFilterTextFieldProps={
          muiTableHeadCellFilterTextFieldProps
        }
      />
    );
  }, [
    columnFilters,
    columnsTable,
    muiBottomToolbarProps,
    muiTableContainerProps,
    muiTableFooterCellProps,
    muiTableHeadCellFilterTextFieldProps,
    muiTableHeadCellProps,
    muiTablePaperProps,
    pagination,
    rows,
    showColumnFilters,
    sorting,
    rowSelection,
    markRows,
    columnVisibility,
    columnSizing,
    // selectedContentId,
    // isReadContent,
  ]);

  return (
    <>
      <Head>
        <title>{t("List Page Title")}</title>
        <meta name="description" content={t("List Meta Description")} />
        <meta name="keywords" content={t("List Meta Keywords")} />
      </Head>
      <Box
        key={tableKey}
        sx={{
          width: { xs: "100vw", lg: "100%" },
          overFlow: "scroll",
          height: {
            xs: "calc(100svh - 236px)",
            md: "calc(100vh - 202px)",
            lg: "calc(100vh - 188px)",
          },
        }}
        id="datatable_wrap"
      >
        {tableInstanceRef.current && showColumnFilters && (
          <MRT_ToggleFiltersButton
            table={tableInstanceRef.current}
            sx={{
              position: "absolute",
              zIndex: 3,
              top: isDesktop ? "195px" : "257px",
              left: { xs: 0, md: "100px" },
              backgroundColor:
                theme.palette.palette_style.background.table_header_footer,
              borderRadius: 0,
              paddingLeft: "15px",
              "&:hover": {
                backgroundColor:
                  theme.palette.palette_style.background.table_header_footer,
              },
            }}
          />
        )}
        {renderMuiReactTable}
        <Stack
          sx={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            py: 0.5,
            px: 1,
            height: 40,
            left: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 0.25, md: "inherit" },
            backgroundColor: {
              xs: theme.palette.palette_style.background.default,
              md: "transparent",
            },
            flexDirection: "inherit",
          }}
        >
          <Box
            sx={{
              display: "flex",
              // px: { xs: 0, md: 2 },
              gap: 1,
            }}
          >
            <AddRowButton
              handleAddNewRow={(values) => handleNewRowPanel(values)}
              translations={translations}
            />
            {rowSelection && Object.keys(rowSelection).length > 0 && (
              <Button
                variant="outlined"
                onClick={handleBulkActionModal}
                sx={{
                  display: isDesktop ? "none" : "flex",
                  px: { xs: 1, md: "inherit" },
                  border: 2,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover": {
                    border: 2,
                  },
                }}
              >
                <EditIcon />
              </Button>
            )}
            <Box
              sx={{
                backgroundColor: theme.palette.palette_style.background.paper,
                display: "flex",
                position: { xs: "absolute", md: "relative" },
                bottom: { xs: 80, md: "unset" },
                left: { xs: "50%", md: "unset" },
                transform: { xs: "translateX(-50%)", md: "unset" },
                width: { xs: "90%", md: "auto" },
                zIndex: 11,
                flexWrap: { xs: "wrap", md: "nowrap" },
                gap: { xs: 0, md: 2 },
                boxShadow: { xs: "0 0 12px 0 rgba(0,0,0,.1)", md: "none" },
              }}
            >
              {(isDesktop
                ? rowSelection && Object.keys(rowSelection).length > 0
                : toggleBulkAction) &&
                bulkActions.map(
                  (action: any) =>
                    action.allowed && (
                      <Box
                        key={action.title}
                        sx={{
                          display: "flex",
                          cursor: "pointer",
                          width: { xs: "50%", sm: "33.33%", md: "100%" },
                        }}
                        onClick={() => {
                          handleBulkAction(action.action);
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            justifyContent: "center",
                            alignItems: "center",
                            borderBottom: { xs: "1px solid #eee", md: "none" },
                            py: { xs: 2, md: 0 },
                            ml: { xs: 0, lg: 1 },
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
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: {
                xs: 0,
                md: 1,
              },
              width: "auto",
            }}
          >
            <Typography
              variant="caption"
              sx={{ display: { xs: "none", xl: "block" } }}
            >
              {pagination.pageIndex * pagination.pageSize + 1}-
              {(pagination.pageIndex + 1) * pagination.pageSize} of {count},{" "}
              {t("Per Page")}:
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: { xs: "block", xl: "none" } }}
            >
              Total {count}
            </Typography>
            <Select
              id="per_page"
              value={pagination.pageSize.toString()}
              onChange={handleChangeRowsPerPage}
              size="small"
              sx={{
                // flex: 1,
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                fontSize: "14px",
                "& .MuiSelect-select": {
                  pr: 4,
                },
              }}
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="50">50</MenuItem>
              {/* <MenuItem value="100">100</MenuItem> */}
            </Select>

            <Pagination
              count={Math.ceil(count / pagination.pageSize)}
              page={(currentView.page || 0) + 1}
              onChange={handleChange}
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            />
            <Box
              sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
            >
              <Typography
                variant="caption"
                onClick={() => {
                  setOpenPagination(true);
                }}
              >
                {t("Page")}:
              </Typography>
              {count && (
                <Select
                  open={openPagination}
                  onClose={() => {
                    setOpenPagination(false);
                  }}
                  onOpen={() => {
                    setOpenPagination(true);
                  }}
                  value={(currentView.page || 0) + 1}
                  onChange={handleDropdownPageChange}
                  size="small"
                  sx={{
                    display: { xs: "block", md: "none" },
                    // flex: 1,
                    boxShadow: "none",
                    ".MuiOutlinedInput-notchedOutline": { border: 0 },
                    fontSize: "14px",
                    "& .MuiSelect-select": {
                      pr: 4,
                    },
                  }}
                >
                  {Array.from(
                    { length: Math.ceil(count / pagination.pageSize) },
                    (_, index) => (
                      <MenuItem key={index + 1} value={index + 1}>
                        {index + 1}
                      </MenuItem>
                    )
                  )}
                </Select>
              )}
            </Box>
          </Box>
        </Stack>
        {/* {currentView && (
          <ListFields
            translations={translations}
            open={visibleFieldManagementPanel}
            onClose={() => handleCloseFieldManagementPanel()}
          />
        )} */}
      </Box>
      {visibleAddRowPanel && (
        <RowFormPanel
          rowData={selectedRowData}
          columns={columns}
          onSubmit={handleRowAction}
          open={visibleAddRowPanel}
          onClose={() => setVisibleAddRowPanel(false)}
          mode={mode}
          translations={translations}
        />
      )}

      <YesNoDialog
        title={t("Delete Row")}
        submitText={t("Delete")}
        message={t("Sure Delete Rows")}
        open={openBulkDeleteDialog}
        translations={translations}
        handleClose={() => setOpenBulkDeleteDialog(false)}
        onSubmit={() => {
          handleBulkDelete();
        }}
      />
      <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          hidden={false}
          style={{ maxWidth: "0px", maxHeight: "0px" }}
        >
          <PrintDataTable
            columns={columns}
            rows={printRows}
            viewId={currentView.id}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
  rows: state.view.rows,
  currentView: state.view.currentView,
  count: state.view.count,
  allViewUsers: state.view.allUsers,
  readContents: state.view.readContents,
});

const mapDispatchToProps = {
  fetchRowsByPage,
  setCurrentView,
  setFlashMessage,
  setColumns,
  setFilterChanged,
  setSortChanged,
  setFieldChanged,
  setLimitChanged,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
