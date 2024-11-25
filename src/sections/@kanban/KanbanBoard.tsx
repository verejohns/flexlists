import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import Modal from "@mui/material/Modal";
import { Field, View, TranslationText } from "src/models/SharedModels";
import { ViewField } from "src/models/ViewField";
import { getTranslation } from "src/utils/i18n";
import ChoiceConfig from "../@list/fieldConfig/ChoiceConfig";
import { setFlashMessage } from "src/redux/actions/authAction";
import { ChoiceModel } from "src/models/ChoiceModel";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { kanbanService } from "flexlists-api";

type KanbanBoardProps = {
  translations: TranslationText[];
  currentView: View;
  columns: ViewField[];
  open: boolean;
  selectedChoice?: ChoiceModel;
  handleClose: () => void;
  updateSuccess: () => void;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
};

const KanbanBoard = ({
  translations,
  currentView,
  columns,
  open,
  selectedChoice,
  handleClose,
  updateSuccess,
  setFlashMessage,
}: KanbanBoardProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [boardColumn, setBoardColumn] = useState<Field>();
  const [newChoices, setNewChoices] = useState<ChoiceModel[]>([]);

  useEffect(() => {
    if (open) {
      setBoardColumn(
        columns.find(
          (column: any) => column.id === currentView.config.boardColumnId
        )
      );
      setNewChoices(selectedChoice ? [selectedChoice] : []);
    }
  }, [open]);

  const onsubmit = async () => {
    if (boardColumn && newChoices.length) {
      const updateResult = await kanbanService.updateBoard(
        currentView,
        boardColumn,
        newChoices,
        selectedChoice
      );

      if (updateResult.type === "success") {
        updateSuccess();
      } else {
        setFlashMessage({
          message: updateResult.message || "error",
          type: "error",
        });
      }
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "100%", md: "645px" },
    backgroundColor: theme.palette.palette_style.background.default,
    py: 2,
    px: { xs: 0.5, md: 2 },
    boxShadow: "0 0 10px 10px rgba(0, 0, 0, 0.05)",
    borderRadius: "5px",
    border: "none",
  };

  const updateConfig = (configValues: ChoiceModel[]) => {
    setNewChoices(configValues);
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
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.palette_style.text.primary }}
          >
            {selectedChoice ? t("Edit Board") : t("Add New Board")}
          </Typography>
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
        <Box sx={{ py: 2 }}>
          {boardColumn && (
            <ChoiceConfig
              translations={translations}
              choices={newChoices}
              updateChoices={(newChoices) => updateConfig(newChoices)}
              disableAddChoice={
                typeof selectedChoice !== "undefined" && selectedChoice !== null
              }
            />
          )}
        </Box>
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.palette_style.border.default}`,
            paddingTop: 2,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            justifyContent: "end",
          }}
        >
          <Box>
            <Button variant="outlined" onClick={handleClose}>
              {t("Close")}
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
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(KanbanBoard);
