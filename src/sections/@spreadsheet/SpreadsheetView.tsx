import { useState, useEffect, useMemo, ReactNode } from "react";
import { Box, Stack, Typography, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import {
  fetchRowsByPage,
  setCurrentView,
} from "../../redux/actions/viewActions";
import useResponsive from "../../hooks/useResponsive";
import { TranslationText, View } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Head from "next/head";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import {
  checkboxColumn,
  intColumn,
  floatColumn,
  dateColumn,
  isoDateColumn,
  DataSheetGrid,
  keyColumn,
  textColumn,
} from "react-datasheet-grid";
import "react-datasheet-grid/dist/style.css";
import { ViewField } from "src/models/ViewField";
import { getLocalDateTimeFromString, utcFormat } from "src/utils/convertUtils";
import Pagination from "@mui/material/Pagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import AddRowButton from "src/components/add-button/AddRowButton";
import RowFormPanel from "../@list/RowFormPanel";
import dayjs, { Dayjs } from "dayjs";
import { listContentService } from "flexlists-api";
import { FlexlistsError, isErr, isSucc } from "src/models/ApiResponse";
import YesNoDialog from "src/components/dialog/YesNoDialog";

type SpreadsheetViewProps = {
  rows: any;
  translations: TranslationText[];
  refresh: Boolean;
  currentView: View;
  columns: ViewField[];
  count: number;
  fetchRowsByPage: (page?: number, limit?: number) => void;
  clearRefresh: () => void;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
  setCurrentView: (view: View) => void;
};

const SpreadsheetView = (props: SpreadsheetViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const {
    rows,
    translations,
    refresh,
    currentView,
    columns,
    count,
    fetchRowsByPage,
    clearRefresh,
    setFlashMessage,
    setCurrentView,
  } = props;
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">(
    "view"
  );
  const [sheetData, setSheetData] = useState<any[]>();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: currentView.limit ?? 25,
  });
  const [selectedRowData, setSelectedRowData] = useState<any[]>([]);
  const [selectedSheetRow, setSelectedSheetRow] = useState<any>();
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

  useEffect(() => {
    if (refresh) fetchRowsByPage(currentView.page, currentView.limit ?? 25);
  }, [refresh]);

  useEffect(() => {
    clearRefresh();

    setSheetData(
      rows.map((row: any) => {
        const newRow: any = {};

        for (const [key, value] of Object.entries(row)) {
          const dataColumn = columns.find(
            (column: ViewField) => column.id === parseInt(key)
          );
          if (dataColumn) {
            let dataValue: any = "";

            switch (dataColumn.uiField) {
              case FieldUiTypeEnum.DateTime:
                dataValue = getLocalDateTimeFromString(value as string);
                break;
              default:
                dataValue = value;
            }

            newRow[dataColumn.name] = dataValue;
          } else newRow[key] = value;
        }

        return newRow;
      })
    );
  }, [rows]);

  useEffect(() => {
    fetchRowsByPage(currentView.page, currentView.limit ?? 25);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    // if (selectedSheetRow && sheetData) {
    //   if (selectedSheetRow.min.row === selectedSheetRow.max.row) {
    //     setSelectedRowData([rows[selectedSheetRow.max.row]]);
    //   } else {
    //     setSelectedRowData(rows.filter((row: any, index: number) => index <= selectedSheetRow.max.row && index >= selectedSheetRow.min.row));
    //   }
    // }
  }, [selectedSheetRow]);

  const shouldShowField = (column: ViewField) => {
    return (
      (column.viewFieldVisible === true ||
        column.viewFieldVisible === undefined) &&
      ((!column.detailsOnly && column.viewFieldDetailsOnly === undefined) ||
        column.viewFieldDetailsOnly === false)
    );
  };

  const getColumns = (columns: ViewField[]) => {
    return columns.map((column: ViewField) => {
      let type: any = {};

      switch (column.uiField) {
        case FieldUiTypeEnum.Text:
          type = textColumn;
          break;
        case FieldUiTypeEnum.Integer:
          type = intColumn;
          break;
        case FieldUiTypeEnum.Float:
          type = floatColumn;
          break;
        case FieldUiTypeEnum.Double:
          type = floatColumn;
          break;
        case FieldUiTypeEnum.Boolean:
          type = checkboxColumn;
          break;
        default:
          type = textColumn;
      }

      return {
        ...keyColumn(column.name, type),
        title: column.name,
        grow: column.uiField === FieldUiTypeEnum.DateTime ? 2 : null,
        disabled: column.name === "id" ? true : false,
      };
    });
  };

  const sheetColumns = useMemo<any>(() => {
    return getColumns(columns.filter((column: any) => shouldShowField(column)));
  }, [columns]);

  const getRow = (content: any) => {
    let newRow: any = {};

    for (const [key, value] of Object.entries(content)) {
      const dataColumn = columns.find(
        (column: ViewField) =>
          column.name === key &&
          column.name !== "id" &&
          column.name !== "createdAt" &&
          column.name !== "updatedAt"
      );

      if (dataColumn) {
        let dataValue: any = "";

        switch (dataColumn.uiField) {
          case FieldUiTypeEnum.DateTime:
            const date = dayjs(getLocalDateTimeFromString(value as string));

            dataValue = date.format(utcFormat);
            break;
          default:
            dataValue = value;
        }

        newRow[dataColumn.id] = dataValue;
      } else newRow[key] = value;
    }

    return newRow;
  };

  const handleSheetData = async (sheetData: any[], operations: any[]) => {
    if (!operations.length) return;

    if (operations[0].type === "UPDATE") {
      let updateRowRespone: any = {};

      if (operations[0].toRowIndex - operations[0].fromRowIndex > 1) {
        updateRowRespone = await listContentService.updateContents(
          currentView.id,
          sheetData
            .filter(
              (row: any, index: number) =>
                index > operations[0].fromRowIndex - 1 &&
                index <= operations[0].toRowIndex - 1
            )
            .map((content: any) => getRow(content))
        );
      } else {
        updateRowRespone = await listContentService.updateContent(
          currentView.id,
          getRow(sheetData[operations[0].toRowIndex - 1])
        );
      }

      if (isSucc(updateRowRespone)) {
        setSheetData(sheetData);
        setFlashMessage({ message: "Updated successfully", type: "success" });
      } else {
        setFlashMessage({
          message: (updateRowRespone as FlexlistsError).message,
          type: "error",
        });
      }
    } else if (operations[0].type === "CREATE") {
      if (Object.keys(sheetData[operations[0].toRowIndex - 1]).length === 0) {
        console.log(operations[0], "empty row create");
      } else {
        const newSheetData = sheetData.filter(
          (data: any, index: number) =>
            index >= operations[0].fromRowIndex &&
            index < operations[0].toRowIndex
        );
        const newRows = rows
          .filter((row: any) =>
            newSheetData.find((data: any) => data.id === row.id)
          )
          .map((row: any) => {
            delete row.id;

            const archiveField = columns.find(
              (x) => x.system && x.name === "___archived"
            );

            if (archiveField) {
              row[archiveField.name] = row[archiveField.id];

              delete row[archiveField.id];
            }

            return row;
          });

        const cloneResponse = await listContentService.cloneContent(
          currentView.id,
          newRows
        );

        if (isSucc(cloneResponse)) {
          setFlashMessage({ message: "Cloned successfully", type: "success" });
          fetchRowsByPage(currentView.page, currentView.limit ?? 25);
        } else {
          setFlashMessage({
            message: (cloneResponse as FlexlistsError).message,
            type: "error",
          });
        }
      }
    } else if (operations[0].type === "DELETE") {
      setOpenBulkDeleteDialog(true);

      if (operations[0].toRowIndex - operations[0].fromRowIndex > 1) {
        setSelectedRowData(
          rows.filter(
            (row: any, index: number) =>
              index >= operations[0].fromRowIndex &&
              index < operations[0].toRowIndex
          )
        );
      } else {
        setSelectedRowData([rows[operations[0].fromRowIndex]]);
      }
    }
  };

  const _handleChange = (value: number) => {
    setPagination({
      ...pagination,
      pageIndex: value - 1,
    });
    let newView: View = Object.assign({}, currentView);
    newView.page = value - 1;
    setCurrentView(newView);
    fetchRowsByPage(newView.page, newView.limit ?? 25);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setPagination({
      pageIndex: 0,
      pageSize: parseInt(event.target.value, 10),
    });
    let newView: View = Object.assign({}, currentView);
    newView.page = 0;
    newView.limit = parseInt(event.target.value, 10);
    setCurrentView(newView);
    fetchRowsByPage(0, newView.limit);
  };

  const handleDropdownPageChange = (
    event: SelectChangeEvent<number>,
    child: ReactNode
  ) => {
    const newPage = event.target.value as number;

    _handleChange(newPage);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    _handleChange(value);
  };

  const handleNewRowPanel = (values: any) => {
    setMode("create");
    setVisibleAddRowPanel(true);
    setSelectedRowData([values]);
  };

  const handleRowAction = (values: any, action: string) => {
    fetchRowsByPage(currentView.page, currentView.limit ?? 25);
  };

  const handleRowData = (selection: any) => {
    if (selection.selection) setSelectedSheetRow(selection.selection);
  };

  const handleBulkDelete = async () => {
    let deleteContentResponse: any;

    if (selectedRowData.length > 1) {
      deleteContentResponse = await listContentService.deleteBulkContents(
        currentView.id,
        selectedRowData.map((row: any) => row.id)
      );
    } else {
      deleteContentResponse = await listContentService.deleteContent(
        currentView.id,
        selectedRowData[0].id
      );
    }

    if (isErr(deleteContentResponse)) {
      setFlashMessage({
        message: (deleteContentResponse as FlexlistsError).message,
        type: "error",
      });
    } else {
      setFlashMessage({ message: "Row deleted successfully", type: "success" });
      fetchRowsByPage(currentView.page, currentView.limit ?? 25);
    }
  };

  return (
    <Box sx={{}}>
      <Head>
        <title>{t("SpreadSheet Page Title")}</title>
        <meta name="description" content={t("SpreadSheet Meta Description")} />
        <meta name="keywords" content={t("SpreadSheet Meta Keywords")} />
      </Head>
      {sheetColumns && (
        <DataSheetGrid
          value={sheetData}
          onChange={handleSheetData}
          columns={sheetColumns}
          onSelectionChange={handleRowData}
          height={isDesktop ? windowHeight - 193 : windowHeight - 233}
        />
      )}

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
            gap: 1,
          }}
        >
          <AddRowButton
            handleAddNewRow={(values) => handleNewRowPanel(values)}
            translations={translations}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: { xs: 0, md: 1 },
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
          <Select
            id="per_page"
            value={pagination.pageSize.toString()}
            onChange={handleChangeRowsPerPage}
            size="small"
            sx={{
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
            <Typography variant="caption">Page: </Typography>
            {count && (
              <Select
                value={(currentView.page || 0) + 1}
                onChange={handleDropdownPageChange}
                size="small"
                sx={{
                  display: { xs: "block", md: "none" },
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

      <RowFormPanel
        rowData={selectedRowData}
        columns={columns}
        onSubmit={handleRowAction}
        open={visibleAddRowPanel}
        onClose={() => setVisibleAddRowPanel(false)}
        mode={mode}
        translations={translations}
      />

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
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  rows: state.view.rows,
  columns: state.view.columns,
  currentView: state.view.currentView,
  count: state.view.count,
});

const mapDispatchToProps = {
  fetchRowsByPage,
  setFlashMessage,
  setCurrentView,
};

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetView);
