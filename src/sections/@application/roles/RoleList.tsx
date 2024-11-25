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
import AddRoleDialog from "./AddRoleDialog";
import RowRoleList from "./RowRoleList";
import { styled, useTheme } from "@mui/material/styles";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import { fetchApplicationRoles } from "src/redux/actions/applicationActions";

type RoleListProps = {
  translations: TranslationText[];
  applicationId: number;
  roles: any[];
  fetchApplicationRoles: (applicationId: number) => void;
};

const RoleList = ({
  translations,
  applicationId,
  roles,
  fetchApplicationRoles
}: RoleListProps) => {
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
    fetchApplicationRoles(applicationId);
  }, [applicationId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  
  return (
    <div style={{ position: "relative" }}>
      <Typography variant="h6" gutterBottom>
        {t('Manage Roles')}
      </Typography>
      <Stack spacing={3} mb={2} alignItems="flex-start">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                {roles &&
                  roles.map((role) => {
                    return <RowRoleList key={role.id} role={role} translations={translations} />;
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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
          {t('Add Role')}
        </Button>
      </Stack>
      <AddRoleDialog open={open} translations={translations} handleClose={handleClose} />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
  roles: state.application.roles
});

const mapDispatchToProps = {
  fetchApplicationRoles
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleList);
