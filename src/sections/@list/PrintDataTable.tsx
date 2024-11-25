import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import { ViewField } from "src/models/ViewField";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import {
  downloadFileUrl,
  getChoiceField,
  getDataColumnId,
  imageStringToJSON,
  linkStringToJSON,
} from "src/utils/flexlistHelper";
import {
  getLocalDateTimeFromString,
  getLocalDateFromString,
} from "src/utils/convertUtils";
import sanitizeHtml from "sanitize-html";

interface PrintDataTableProps {
  columns: ViewField[];
  rows: any[];
  renderCell?: (columnType: FieldUiTypeEnum, cellValue: any) => JSX.Element;
  viewId: number;
}

const PrintDataTable = ({
  viewId,
  columns,
  rows,
  renderCell,
}: PrintDataTableProps) => {
  function renderFieldData(row: any, column: ViewField, cellValue: any) {
    const columnType = column.uiField;
    switch (columnType) {
      case FieldUiTypeEnum.Integer:
      case FieldUiTypeEnum.Float:
      case FieldUiTypeEnum.Decimal:
      case FieldUiTypeEnum.Double:
      case FieldUiTypeEnum.Money:
      case FieldUiTypeEnum.Percentage:
      case FieldUiTypeEnum.Link:
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
            {cellValue}
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
            {cellValue && cellValue != null
              ? getLocalDateTimeFromString(cellValue)
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
            {cellValue && cellValue != null
              ? getLocalDateFromString(cellValue)
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
            {cellValue && cellValue != null
              ? getLocalDateTimeFromString(cellValue)
              : ""}
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
            {!cellValue
              ? ""
              : sanitizeHtml(cellValue.toString().replace(/</g, " <"), {
                  allowedTags: [],
                })}
          </Box>
        );
      case FieldUiTypeEnum.Text:
      case FieldUiTypeEnum.LongText:
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
            {cellValue}
          </Box>
        );
      case FieldUiTypeEnum.Choice:
        const choice = getChoiceField(cellValue, column);
        return (
          <Box sx={{ display: "flex" }} flexDirection="column">
            {choice?.map((choice: any, i: number) => (
              <Box
                key={`${row.id}-${i}`}
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
      case FieldUiTypeEnum.Boolean:
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
            {cellValue?.toString() === "true" ? "yes" : "no"}
          </Box>
        );

      case FieldUiTypeEnum.Image:
        return (
          <Box
            component="img"
            sx={{
              // height: 100,
              width: 100,
              // maxHeight: { xs: 233, md: 167 },
              // maxWidth: { xs: 350, md: 250 },
            }}
            alt=""
            src={
              cellValue && imageStringToJSON(cellValue)?.fileId
                ? downloadFileUrl(
                    imageStringToJSON(cellValue)?.fileId,
                    viewId,
                    column.id
                  )
                : ""
            }
          />
        );
      case FieldUiTypeEnum.Video:
        return (
          <Box
            component="video"
            sx={{
              // height: 100,
              width: 100,
              // maxHeight: { xs: 233, md: 167 },
              // maxWidth: { xs: 350, md: 250 },
            }}
            src={
              cellValue && imageStringToJSON(cellValue)?.fileId
                ? downloadFileUrl(
                    imageStringToJSON(cellValue)?.fileId,
                    viewId,
                    column.id
                  )
                : ""
            }
          />
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
            {imageStringToJSON(cellValue)?.fileName}
          </Box>
        );
      // return cellValue? (
      //   <Link href={downloadFileUrl(cellValue.fileId)}>{cellValue.fileName, viewId}</Link>
      // ):(<></>)
      default:
        return <></>;
    }
  }
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.id}>{column.viewFieldName}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            {columns.map(
              (column) =>
                row && (
                  <TableCell key={column.id}>
                    {renderFieldData(
                      row,
                      column,
                      row[getDataColumnId(column.id, columns)]
                    )}
                  </TableCell>
                )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PrintDataTable;
