import { Box } from "@mui/material";
import { connect } from "react-redux";
import KanbanTask from "./KanbanTask";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { styled, useTheme } from "@mui/material/styles";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { ChoiceModel } from "src/models/ChoiceModel";
import { KanbanConfig } from "src/models/ViewConfig";
import { TranslationText, View } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { ViewField } from "src/models/ViewField";
import { getDefaultValues } from "src/utils/flexlistHelper";
import { fetchRows, fetchColumns } from "../../redux/actions/viewActions";
import { useState } from "react";
import KanbanBoard from "./KanbanBoard";
import YesNoDialog from "src/components/dialog/YesNoDialog";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { kanbanService } from "flexlists-api";

type KanbanColumnProps = {
  index: number;
  rows: any;
  column: ChoiceModel;
  tasks: any;
  kanbanConfig: KanbanConfig;
  translations: TranslationText[];
  currentView: View;
  columns: ViewField[];
  openNewRowPanel: () => void;
  handleRowData: (row: any, mode: any) => void;
  fetchRows: () => void;
  fetchColumns: (viewId: number) => void;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
};

const Container = styled("div")(({ theme }) => ({
  boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "16px",
  backgroundColor: "white",
  marginRight: "30px",
  width: "calc(100vw - 30px)",
  [theme.breakpoints.up("sm")]: {
    width: "345px",
  },
}));

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 16px 0 16px",
  width: "calc(100vw - 30px)",
  [theme.breakpoints.up("sm")]: {
    width: "345px",
  },
}));

const Title = styled("div")(({ theme }) => ({
  textTransform: "uppercase",
  fontSize: "12px",
  padding: "4px 8px ",
  fontWeight: 500,
}));

const TaskList = styled("div")(({ theme }) => ({
  padding: "16px",
  height: "inherit",
  overflowY: "auto",
  [theme.breakpoints.up("md")]: {
    height: `${window.innerHeight - 274}px`,
  },
}));

const KanbanColumn = ({
  index,
  rows,
  column,
  tasks,
  kanbanConfig,
  translations,
  currentView,
  columns,
  openNewRowPanel,
  handleRowData,
  fetchRows,
  fetchColumns,
}: KanbanColumnProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [visibleEditBoardModal, setVisibleEditBoardModal] = useState(false);
  const [visibleDeleteConfirm, setVisibleDeleteConfirm] = useState(false);

  const lists = [
    {
      label: t("Edit Board"),
      value: "edit_board",
    },
    {
      label: t("Delete Board"),
      value: "delete_board",
    },
  ];

  const addRow = () => {
    let selectedColumn: any = getDefaultValues(columns);
    selectedColumn[currentView.config?.boardColumnId] = column.label;

    handleRowData(selectedColumn, "create");
    openNewRowPanel();
  };

  const editRow = (id: string) => {
    rows.forEach((row: any) => {
      if (row.id === id) handleRowData(row, "view");
    });

    openNewRowPanel();
  };

  const handleMenu = (action: string) => {
    if (action === "edit_board") {
      setVisibleEditBoardModal(true);
    } else if (action === "delete_board") {
      setVisibleDeleteConfirm(true);
    }
  };

  const updateSuccess = () => {
    setVisibleEditBoardModal(false);
    fetchColumns(currentView.id);
    fetchRows();
  };

  const handleDeleteBoard = async () => {
    const boardColumn = columns.find(
      (column: any) => column.id === currentView.config.boardColumnId
    );

    if (boardColumn) {
      const updateResult = await kanbanService.updateBoard(
        currentView,
        boardColumn,
        [],
        column
      );

      if (updateResult.type === "success") {
        fetchColumns(currentView.id);
        setVisibleDeleteConfirm(false);
      } else {
        setFlashMessage({
          message: updateResult.message || "error",
          type: "error",
        });
      }
    }
  };

  return (
    <>
      <Draggable draggableId={`${column.id}`} index={index}>
        {(provided: any) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Header>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    background: column?.color?.bg ?? "",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 50,
                    color: column?.color?.fill ?? "",
                  }}
                >
                  <Title>{column.label}</Title>
                </Box>
                <Box
                  sx={{
                    marginLeft: 1,
                    borderRadius: "5px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    width: "20px",
                    height: "20px",
                    textAlign: "center",
                  }}
                >
                  {tasks.length}
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="span"
                  className="svg-color"
                  sx={{
                    width: 14,
                    height: 14,
                    display: "inline-block",
                    bgcolor: theme.palette.palette_style.text.primary,
                    mask: `url(/assets/icons/table/Plus.svg) no-repeat center / contain`,
                    WebkitMask: `url(/assets/icons/table/Plus.svg) no-repeat center / contain`,
                    cursor: "pointer",
                  }}
                  onClick={addRow}
                />
                <CDropdown id="kanban_action" className="list_action">
                  <CDropdownToggle color="secondary">
                    <Box
                      component="span"
                      className="svg-color"
                      sx={{
                        width: 24,
                        height: 24,
                        display: "inline-block",
                        bgcolor: "#16385C",
                        mask: `url(/assets/icons/dots.svg) no-repeat center / contain`,
                        WebkitMask: `url(/assets/icons/dots.svg) no-repeat center / contain`,
                        cursor: "pointer",
                        marginTop: "4px",
                        marginLeft: "8px",
                      }}
                    />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {lists.map((list: any) => (
                      <CDropdownItem
                        onClick={() => {
                          handleMenu(list.value);
                        }}
                        key={list.value}
                      >
                        {list.label}
                      </CDropdownItem>
                    ))}
                  </CDropdownMenu>
                </CDropdown>
              </Box>
            </Header>
            <Droppable droppableId={`${column.id}`} type="task">
              {(provided: any) => (
                <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks.map((task: any, index: number) => (
                    <KanbanTask
                      kanbanConfig={kanbanConfig}
                      key={task.id}
                      task={task}
                      index={index}
                      editRow={editRow}
                      borderColor={column?.color?.bg}
                    />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
      <KanbanBoard
        translations={translations}
        open={visibleEditBoardModal}
        selectedChoice={column}
        handleClose={() => {
          setVisibleEditBoardModal(false);
        }}
        updateSuccess={updateSuccess}
      />
      <YesNoDialog
        title={t("Delete Board")}
        submitText={t("Delete")}
        message={t("Sure Delete Board")}
        open={visibleDeleteConfirm}
        translations={translations}
        handleClose={() => setVisibleDeleteConfirm(false)}
        onSubmit={() => {
          handleDeleteBoard();
        }}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  rows: state.view.rows,
  currentView: state.view.currentView,
  columns: state.view.columns,
});

const mapDispatchToProps = {
  fetchRows,
  fetchColumns,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(KanbanColumn);
