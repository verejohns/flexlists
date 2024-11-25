import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  Button,
  tableCellClasses,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { styled, useTheme } from "@mui/material/styles";
import { applicationService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { fetchApplicationViews } from "src/redux/actions/applicationActions";

type ViewsListProps = {
  translations: TranslationText[];
  applicationId: number;
  views: any[];
  fetchApplicationViews: (applicationId: number) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const ViewsList = ({
  translations,
  applicationId,
  views,
  fetchApplicationViews,
  setFlashMessage,
}: ViewsListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();

  const [removeCheck, setRemoveCheck] = useState<number[] | string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isLoaderSelected, setIsLoaderSelected] = useState(false);
  const [selected, setSelected] = useState<readonly number[]>([]);

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
    fetchApplicationViews(applicationId);
  }, [applicationId]);

  useEffect(() => {
    setSelected(filteredIds);

    if (!!filteredIds.length) {
      setIsLoaderSelected(true);
    }
  }, [views]);

  const handleClick = (event: React.MouseEvent<unknown>, id: any) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    setIsLoaderSelected(false);
  };

  const isSelected = (id: any) => selected.indexOf(id) !== -1;

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: any
  ) => {
    const checked = event.target.checked;
    const newSelected = checked
      ? [...selected, id]
      : selected.filter((selectedId) => selectedId !== id);

    setSelected(newSelected);

    if (checked) {
      setChecked(true);
      setRemoveCheck([]);
    } else {
      setChecked(false);
      setRemoveCheck((prevArray: number[] | string[]) => [...prevArray, id]);
    }
  };

  const handleSave = async () => {
    if (checked) {
      const response = await applicationService.addApplicationView(
        applicationId,
        selected as number[]
      );

      if (isSucc(response) && response.data) {
        setFlashMessage({
          message: "Added views successfully",
          type: "success",
        });
      } else {
        setFlashMessage({ message: response?.message, type: "error" });
      }
    }
  };

  useEffect(() => {
    const removeViews = async (removed: number[]) => {
      const response = await applicationService.removeApplicationView(
        applicationId,
        removed
      );

      if (isSucc(response) && response.data) {
        setFlashMessage({
          message: "Removed views successfully",
          type: "success",
        });
      } else {
        setFlashMessage({ message: response?.message, type: "error" });
      }
    };

    if (checked || !removeCheck.length) return;

    removeViews(removeCheck as number[]);
  }, [checked, removeCheck]);

  const filteredIds = useMemo(() => {
    return (
      views &&
      views
        .filter((item: any) => item.inAppliation === true)
        .map((item: any) => item.id)
    );
  }, [views]);

  return (
    <div style={{ position: "relative" }}>
      <Typography variant="h6" gutterBottom>
        {t("List Views")}
      </Typography>
      <Stack spacing={3} mb={2} alignItems="flex-start">
        <TableContainer component={Paper}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell colSpan={2}>{t("Name")}</StyledTableCell>
                <StyledTableCell align="right">
                  {t("Description")}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {views &&
                views.map(({ id, name, description }: any, index: number) => {
                  const isItemSelected = isSelected(id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      key={id}
                      onClick={(event) => handleClick(event, id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onChange={(event) => handleCheckboxChange(event, id)}
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell align="right">{description}</TableCell>
                    </TableRow>
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
        {!!selected.length && (
          <Button
            variant="contained"
            onClick={handleSave}
            size="small"
            disabled={isLoaderSelected}
          >
            {t("Save")}
          </Button>
        )}
      </Stack>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
  views: state.application.views,
});

const mapDispatchToProps = {
  fetchApplicationViews,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewsList);
