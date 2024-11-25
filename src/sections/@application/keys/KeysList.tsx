import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  Button,
  TableCell,
  tableCellClasses
} from "@mui/material";
import { useEffect, useCallback, useState } from "react";
import * as React from "react";
import AddKeyDialog from "./AddKeyDialog";
import RowKeysList from "./RowKeysList";
import { styled, useTheme } from "@mui/material/styles";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import { fetchApplicationKeys } from "src/redux/actions/applicationActions";

type ApplicationKeyProps = {
  translations: TranslationText[];
  applicationId: number;
  keys: any[];
  fetchApplicationKeys: (applicationId: number) => void;
};

const KeysList = ({
  translations,
  applicationId,
  keys,
  fetchApplicationKeys
}: ApplicationKeyProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  useEffect(() => {
    fetchApplicationKeys(applicationId);
  }, [applicationId]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div style={{ position: "relative" }}>
      <Typography variant="h6" gutterBottom>
        {t('Manage Keys')}
      </Typography>
      <Stack spacing={3} mb={2} alignItems="flex-start">
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            size="small"
            style={{ tableLayout: "fixed" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>{t('Name')}</StyledTableCell>
                <StyledTableCell>{t('Description')}</StyledTableCell>
                <StyledTableCell align="right">{t('Actions')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keys && keys.map((item: any) => {
                return <RowKeysList key={item.id} item={item} translations={translations} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        alignItems="flex-start"
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleClickOpen}
        >
          {t('Add Key')}
        </Button>
      </Stack>
      <AddKeyDialog translations={translations} open={open} handleClose={handleClose} />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
  keys: state.application.keys
});

const mapDispatchToProps = {
  fetchApplicationKeys
};

export default connect(mapStateToProps, mapDispatchToProps)(KeysList);
