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
import RowMenuPagesList from "./RowMenuPagesList";
import AddMenuPagesDialog from "./AddMenuPagesDialog";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { connect } from "react-redux";
import { fetchApplicationMenus } from "src/redux/actions/applicationActions";

type MenuPagesListProps = {
  translations: TranslationText[];
  applicationId: number;
  menus: any[];
  fetchApplicationMenus: (applicationId: number) => void;
};

const MenuPagesList = ({
  translations,
  applicationId,
  menus,
  fetchApplicationMenus
}: MenuPagesListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
    fetchApplicationMenus(applicationId);
  }, [applicationId]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setIsEdit(false);
  };

  const handleClickEditOpen = async ({ id }: { id: string }) => {
    // router.replace(`/layout/${id}`);
    router.push(`/main/layout/${id}`);
  };

  return (
    <div style={{ position: "relative" }}>
      <Typography variant="h6" gutterBottom>
        {t('Menu')}
      </Typography>
      <Stack spacing={3} mb={2} alignItems="flex-start">
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            size="small"
            style={{ tableLayout: "fixed" }}
            sx={{
              "& .MuiTableCell-sizeSmall": {
                padding: "10px",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ width: "33%" }}>{t('Name')}</StyledTableCell>
                <StyledTableCell>{t('Description')}</StyledTableCell>
                <StyledTableCell align="right" style={{ width: "25%" }}>
                  {t('Actions')}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menus &&
                menus.map((menu: any) => {
                  return (
                    <RowMenuPagesList
                      translations={translations}
                      key={menu.id}
                      menu={menu}
                      handleClickEditOpen={handleClickEditOpen}
                    />
                  );
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
          {t('Add Page')}
        </Button>
      </Stack>
      <AddMenuPagesDialog
        translations={translations}
        open={open}
        isEdit={isEdit}
        handleClose={handleClose}
        id={0}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
  menus: state.application.menus
});

const mapDispatchToProps = {
  fetchApplicationMenus
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuPagesList);
