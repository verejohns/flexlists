import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import { fetchRows, fetchRowsByPage, setCurrentView, setSortChanged } from "../../redux/actions/viewActions";
import useResponsive from "../../hooks/useResponsive";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import { FieldUiTypeEnum, ViewType } from "src/enums/SharedEnums";
import { View } from "src/models/SharedModels";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { getColumn, getDefaultFieldIcon } from "src/utils/flexlistHelper";

type SortProps = {
  translations: TranslationText[];
  currentView: View;
  columns: any;
  open: boolean;
  setCurrentView: (view: View) => void;
  handleClose: () => void;
  fetchRows: () => void;
  setSortChanged: (value: boolean) => void;
  fetchRowsByPage: (page?: number, limit?: number) => void;
};

const SortPage = ({
  translations,
  columns,
  currentView,
  open,
  setCurrentView,
  handleClose,
  fetchRows,
  fetchRowsByPage,
  setSortChanged
}: SortProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [windowHeight, setWindowHeight] = useState(0);
  const [newCurrentView, setNewCurrentView] = useState<View>();

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (open) setNewCurrentView(currentView);
  }, [open]);

  const handleSorts = (index: number, key: string, value: string) => {
    let newView: View = Object.assign({}, newCurrentView);

    newView.order = newCurrentView?.order?.map((sort: any, i: number) => {
      let newSort: any = {
        fieldId: sort.fieldId,
        direction: sort.direction,
      };

      if (index === i) {
        newSort[key] = value;

        return newSort;
      } else return sort;
    });

    setNewCurrentView(newView);
  };

  const removeSort = (index: number) => {
    let newView: View = Object.assign({}, newCurrentView);

    newView.order = newCurrentView?.order?.filter(
      (sort: any, i: number) => i !== index
    );

    setNewCurrentView(newView);
  };

  const getSorDirections = (sort: any): { key: string; value: string }[] => {
    const column = getColumn(sort.fieldId, columns);
    let directions: { key: string; value: string }[] = [
      {
        key: "asc",
        value: "First-Last",
      },
      {
        key: "desc",
        value: "Last-First",
      },
    ];

    switch (column?.uiField) {
      case FieldUiTypeEnum.Text:
        directions = [
          {
            key: "asc",
            value: "A-Z",
          },
          {
            key: "desc",
            value: "Z-A",
          },
        ];
        break;

      default:
        break;
    }

    return directions;
  };

  const addSort = () => {
    let newView: View = Object.assign({}, newCurrentView);
    const newSort: any = {
      fieldId: columns[0].id,
      direction: "asc",
    };
    let newOrder = [];

    if (columns.length == 0) {
      return;
    }

    if (newView.order) {
      newOrder = newView.order.map((el: any) => el);
      newOrder.push(newSort);
    } else newOrder = [newSort];

    setNewCurrentView({ ...newView, order: newOrder });
  };

  const onsubmit = async () => {
    const newView: View = Object.assign({}, newCurrentView);

    newView.page = 0;

    setCurrentView(newView);

    if (newView.type === ViewType.List ||
      newView.type === ViewType.Gallery ||
      newView.type === ViewType.Spreadsheet)
      fetchRowsByPage(0, newView.limit ?? 25);
    else fetchRows();
    
    handleClose();

    if (newCurrentView?.order !== currentView.order) setSortChanged(true);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "100%", md: "450px" },
    backgroundColor: theme.palette.palette_style.background.default,
    color: theme.palette.palette_style.text.primary,
    py: 2,
    px: { xs: 0.5, md: 2 },
    boxShadow: "0 0 10px 10px rgba(0, 0, 0, 0.05)",
    borderRadius: "5px",
    border: "none",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
            paddingBottom: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2">{t("Sort By")}</Typography>
          <Box
            component="span"
            className="svg-color add_choice"
            sx={{
              width: 18,
              height: 18,
              display: "inline-block",
              bgcolor: theme.palette.palette_style.text.primary,
              mask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
              WebkitMask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
              cursor: "pointer",
            }}
            onClick={handleClose}
          />
        </Box>
        {newCurrentView?.order && newCurrentView.order.length > 0 && (
          <Box
            sx={{
              // borderBottom: `1px solid ${theme.palette.palette_style.border.default}`,
              // py: 2,
              pt: 2,
              maxHeight: `${windowHeight - 100}px`,
              overflow: "auto",
            }}
          >
            {newCurrentView.order.length &&
              newCurrentView.order.map((sort: any, index: number) => (
                <Box
                  key={`${sort.fieldId}-${index}`}
                  sx={{ marginBottom: 1, display: "flex" }}
                >
                  <Select
                    value={sort.fieldId}
                    onChange={(e) => {
                      handleSorts(index, "fieldId", e.target.value);
                    }}
                    size="small"
                    sx={{ width: { md: "168px" }, textTransform: "capitalize" }}
                    className="sort_column"
                  >
                    {columns.map((column: any) => {
                      let coloumIcon =
                        column.icon ?? getDefaultFieldIcon(column.uiField);
                      return (
                        <MenuItem
                          key={column.id}
                          value={column.id}
                          sx={{ display: "flex" }}
                        >
                          <Box
                            component="span"
                            className="svg-color"
                            sx={{
                              width: 14,
                              height: 14,
                              display: "inline-block",
                              bgcolor: theme.palette.palette_style.text.primary,
                              mask: `url(/assets/icons/table/${coloumIcon}.svg) no-repeat center / contain`,
                              WebkitMask: `url(/assets/icons/table/${coloumIcon}.svg) no-repeat center / contain`,
                              marginRight: 1,
                            }}
                          />
                          <Box>
                            {column.system ? t(column.name) : column.name}
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <Select
                    value={sort.direction}
                    onChange={(e) => {
                      handleSorts(index, "direction", e.target.value);
                    }}
                    size="small"
                    sx={{
                      width: { md: "168px" },
                      marginLeft: { xs: "8px", md: "30px" },
                    }}
                  >
                    {getSorDirections(sort).map((direction: any) => (
                      <MenuItem key={direction.key} value={direction.key}>
                        {direction.value}
                      </MenuItem>
                    ))}
                  </Select>
                  <Box
                    component="span"
                    className="svg-color add_choice"
                    sx={{
                      width: 18,
                      height: 18,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.text.primary,
                      mask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
                      cursor: "pointer",
                      marginTop: 1.4,
                      marginLeft: { xs: "8px", md: "30px" },
                    }}
                    onClick={() => {
                      removeSort(index);
                    }}
                  />
                </Box>
              ))}
          </Box>
        )}

        <Box
          sx={{
            paddingTop: 2,
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="span"
              className="svg-color"
              sx={{
                width: 14,
                height: 14,
                display: "inline-block",
                bgcolor: theme.palette.palette_style.text.selected,
                mask: `url(/assets/icons/table/Plus.svg) no-repeat center / contain`,
                WebkitMask: `url(/assets/icons/table/Plus.svg) no-repeat center / contain`,
                cursor: "pointer",
                marginRight: 1,
              }}
            />
            <Box
              sx={{ color: theme.palette.palette_style.text.selected }}
              onClick={addSort}
            >
              {t("Add Another Sort")}
            </Box>
          </Box>
          <Box>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              sx={{ ml: 1 }}
              variant="contained"
              onClick={() => onsubmit()}
            >
              {t("Submit")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  setCurrentView,
  fetchRows,
  fetchRowsByPage,
  setSortChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(SortPage);
