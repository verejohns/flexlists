import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { connect } from "react-redux";
import {
  fetchRows,
  setCurrentView,
  fetchColumns,
} from "../../redux/actions/viewActions";
import KanbanColumn from "./KanbanColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { styled, useTheme } from "@mui/material/styles";
import ViewFooter from "../../components/view-footer/ViewFooter";
import { ChoiceModel } from "src/models/ChoiceModel";
import { FlatWhere, View, TranslationText } from "src/models/SharedModels";
import { KanbanConfig } from "src/models/ViewConfig";
import { ViewField } from "src/models/ViewField";
import { listContentService } from "flexlists-api";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { getTranslation } from "src/utils/i18n";
import Head from "next/head";
import { listViewService } from "flexlists-api";
import KanbanBoard from "./KanbanBoard";
import { FlashMessageModel } from "src/models/FlashMessageModel";

type KanbanViewProps = {
  columns: ViewField[];
  currentView: View;
  rows: any[];
  translations: TranslationText[];
  refresh: Boolean;
  fetchRows: () => void;
  setCurrentView: (view: View) => void;
  clearRefresh: () => void;
  fetchColumns: (viewId: number) => void;
  setFlashMessage: (message: FlashMessageModel | undefined) => void;
};

const KanbanView = ({
  translations,
  currentView,
  columns,
  rows,
  refresh,
  fetchRows,
  setCurrentView,
  clearRefresh,
  fetchColumns,
  setFlashMessage,
}: KanbanViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [boardColumns, setBoardColumns] = useState<ChoiceModel[]>([]);
  const [kanbanConfig, setKanbanConfig] = useState<KanbanConfig>(
    currentView.config as KanbanConfig
  );
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">(
    "view"
  );
  const [rowDatas, setRowDatas] = useState<any[]>([]);
  const [visibleNewBoardModal, setVisibleNewBoardModal] = useState(false);

  const Container = styled("div")(({ theme }) => ({
    display: "flex",
    padding: "16px",
    height: `${windowHeight - 235}px`,
    overflow: "auto",
    [theme.breakpoints.up("md")]: {
      height: `${windowHeight - 193}px`,
    },
  }));

  useEffect(() => {
    setBoardColumns(
      currentView.config?.boardOrder
        ? // order the columsn by boardOrder;
          (
            columns.find((x) => x.id === currentView.config?.boardColumnId)
              ?.config?.values as ChoiceModel[]
          ).sort((a, b) => {
            return (
              currentView.config?.boardOrder?.indexOf(a.id) -
              currentView.config?.boardOrder?.indexOf(b.id)
            );
          })
        : (columns.find((x) => x.id === currentView.config?.boardColumnId)
            ?.config?.values as ChoiceModel[])
    );
  }, [columns]);

  useEffect(() => {
    if (refresh) fetchRows();
  }, [refresh]);

  useEffect(() => {
    setRowDatas(rows);
    clearRefresh();
  }, [rows]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    let newView: View = Object.assign({}, currentView);
    newView.conditions = [];

    for (let i = 0; i < boardColumns.length; i++) {
      const filter: FlatWhere = {
        left: kanbanConfig.boardColumnId,
        leftType: "Field",
        right: boardColumns[i].id,
        rightType: "SearchString",
        cmp: "eq",
      } as FlatWhere;

      newView.conditions.push(filter);
      if (i < boardColumns.length - 1) newView.conditions.push("Or");
    }

    const orderField = columns.find(
      (column: any) => column.name === "___ordering"
    );
    if (orderField) {
      newView.order = [
        {
          fieldId: orderField.id,
          direction: "asc",
        },
      ];
    }

    setCurrentView(newView);
    fetchRows();
  }, []);

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;

    if (result.type === "column") {
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      const newColumns = [...boardColumns];
      const [removed] = newColumns.splice(sourceIndex, 1);
      newColumns.splice(destinationIndex, 0, removed);
      setBoardColumns(newColumns);
      currentView.config.boardOrder = newColumns.map((x) => x.id);

      await listViewService.updateView(
        currentView.id,
        currentView.name,
        currentView.type,
        currentView.config
      );
      // write the config

      return;
    }

    if (!result.destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const destColumn = boardColumns.find(
      (x) => x.id.toString() === destination.droppableId
    );
    const destTasks = rowDatas.filter(
      (row: any) => row[kanbanConfig.boardColumnId] === destColumn?.label
    );
    let targetId: number | undefined = undefined;

    if (source.droppableId !== destination.droppableId) {
      if (destTasks && destTasks.length) {
        if (destination.index) targetId = destTasks[destination.index - 1]?.id;
        else targetId = 0;
      }
    } else {
      if (destination.index && destination.index > 0) {
        if (source.index > destination.index) {
          targetId = destTasks[destination.index - 1].id;
        } else {
          targetId = destTasks[destination.index].id;
        }
      } else targetId = 0;
    }

    reorderRowMap(draggableId, source, destination);

    if (typeof targetId !== "undefined")
      await reorderContents(parseInt(draggableId), targetId);
  };

  const reorderRowMap = async (
    draggableId: string,
    source: any,
    destination: any
  ) => {
    const destColumn = boardColumns.find(
      (x) => x.id.toString() === destination.droppableId
    );
    const destTasks = rowDatas.filter(
      (row: any) => row[kanbanConfig.boardColumnId] === destColumn?.label
    );
    let destinationIndex =
      source.droppableId === destination.droppableId &&
      destination.index > source.index
        ? destination.index + 1
        : destination.index;
    let sourceIndex = 0;
    let destIndex = 0;
    let newRows: any[] = rowDatas.map((row: any, index: number) => {
      //update the column id of the dragged row
      if (
        source.droppableId !== destination.droppableId &&
        row.id.toString() === draggableId
      ) {
        row[currentView.config?.boardColumnId] = destColumn?.label;
      }

      if (
        row.id ===
        (destinationIndex < destTasks.length
          ? destTasks[destinationIndex]?.id
          : destTasks[destinationIndex - 1]?.id)
      ) {
        //get the index of the row before which the dragged row needs to be inserted
        destIndex = destinationIndex < destTasks.length ? index : index + 1;
      }
      //get the index of the dragged row
      if (row.id.toString() === draggableId) {
        sourceIndex = index;
      }

      return row;
    });

    //if source is before destination, then we need to decrement the destination index by 1
    if (sourceIndex < destIndex) {
      destIndex = destIndex - 1;
    }

    const [changed] = newRows.splice(sourceIndex, 1);
    newRows.splice(destIndex, 0, changed);

    newRows[destIndex][currentView.config?.orderColumnId] = !destinationIndex
      ? 10
      : destTasks[destinationIndex - 1]
      ? destTasks[destinationIndex - 1][currentView.config?.orderColumnId] + 1
      : destTasks[destinationIndex][currentView.config?.orderColumnId] - 1;
    setRowDatas(newRows);

    if (source.droppableId !== destination.droppableId) {
      const updateRowRespone = await listContentService.updateContent(
        currentView.id,
        newRows[destIndex]
      );
      if (isSucc(updateRowRespone)) {
        setFlashMessage({
          message: "Row updated successfully",
          type: "success",
        });

        return;
      } else {
        setFlashMessage({
          type: "error",
          message: (updateRowRespone as FlexlistsError).message,
        });
        return;
      }
    }
  };

  const reorderContents = async (
    sourceContentId: number,
    targetContentId?: number
  ) => {
    const reorderContentResponse = await listContentService.reordercontents(
      currentView.id,
      sourceContentId,
      targetContentId
    );

    if (isSucc(reorderContentResponse)) {
      setFlashMessage({
        message: "Reordered successfully",
        type: "success",
      });

      return;
    } else {
      setFlashMessage({
        type: "error",
        message: (reorderContentResponse as FlexlistsError).message,
      });

      return;
    }
  };

  const handleRowData = (row: any, mode: any) => {
    setRowData(row);
    setMode(mode);
  };

  const updateSuccess = () => {
    setVisibleNewBoardModal(false);
    fetchColumns(currentView.id);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Head>
          <title>{t("Kanban Page Title")}</title>
          <meta name="description" content={t("Kanban Meta Description")} />
          <meta name="keywords" content={t("Kanban Meta Keywords")} />
        </Head>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided: any) =>
            provided.droppableProps && (
              <Container
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="board"
              >
                {boardColumns &&
                  boardColumns.length > 0 &&
                  boardColumns.map((boardColumn: any, index: number) => {
                    const tasks = rowDatas.filter(
                      (row: any) =>
                        row[kanbanConfig.boardColumnId] === boardColumn.label
                    );

                    return (
                      <KanbanColumn
                        translations={translations}
                        key={boardColumn.id}
                        kanbanConfig={kanbanConfig}
                        column={boardColumn}
                        tasks={tasks}
                        index={index}
                        openNewRowPanel={() => {
                          setVisibleAddRowPanel(true);
                        }}
                        handleRowData={handleRowData}
                      />
                    );
                  })}
                {provided.placeholder}
                <Box
                  sx={{
                    paddingTop: 3,
                    border: `dashed 2px ${theme.palette.palette_style.primary.main}`,
                    minWidth: { xs: 280, md: 345 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    setVisibleNewBoardModal(true);
                  }}
                >
                  <Box
                    component="span"
                    className="svg-color"
                    sx={{
                      width: 88,
                      height: 88,
                      display: "inline-block",
                      bgcolor: theme.palette.palette_style.primary.main,
                      mask: `url(/assets/icons/table/Plus.svg) no-repeat center / contain`,
                      WebkitMask: `url(/assets/icons/table/Plus.svg) no-repeat center / contain`,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setVisibleNewBoardModal(true);
                    }}
                  />
                  {t("Add New Board")}
                </Box>
              </Container>
            )
          }
        </Droppable>
      </DragDropContext>

      <KanbanBoard
        translations={translations}
        open={visibleNewBoardModal}
        handleClose={() => {
          setVisibleNewBoardModal(false);
        }}
        updateSuccess={updateSuccess}
      />
      <ViewFooter
        visibleAddRowPanel={visibleAddRowPanel}
        rowData={rowData}
        setVisibleAddRowPanel={setVisibleAddRowPanel}
        setRowData={setRowData}
        translations={translations}
        mode={mode}
        setMode={setMode}
      />
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  rows: state.view.rows,
  columns: state.view.columns,
  currentView: state.view.currentView,
});

const mapDispatchToProps = {
  fetchRows,
  setCurrentView,
  fetchColumns,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(KanbanView);
