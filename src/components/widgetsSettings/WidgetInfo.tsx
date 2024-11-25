import React from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

type WidgetInfoProps = {
  translations: TranslationText[];
  layoutConfig: any;
  openPanel: boolean;
};

const WidgetInfo = ({
  translations,
  layoutConfig,
  openPanel
}: WidgetInfoProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { w, h, x, y } = layoutConfig;
  const newConfig = { w, h, x, y };

  if (!openPanel) return null;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%", tableLayout: "fixed" }} size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t('Information')}</StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(newConfig).map(([key, value], i) => {
            return (
              <StyledTableRow key={i}>
                <StyledTableCell>{key}</StyledTableCell>
                <StyledTableCell align="right">{value}</StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const mapStateToProps = (state: any) => ({
  layoutConfig: state.application.layoutConfig,
  openPanel: state.application.openPanel
});

export default connect(mapStateToProps)(WidgetInfo);
