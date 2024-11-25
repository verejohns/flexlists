import { useState, useEffect } from "react";
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import { fetchRows, setCurrentView } from '../../redux/actions/viewActions';
import useResponsive from '../../hooks/useResponsive';
import ViewFooter from '../../components/view-footer/ViewFooter';
import { format, startOfMonth, endOfMonth, subDays, eachDayOfInterval, subMonths, addMonths } from 'date-fns';
import { FlatWhere, View } from 'src/models/SharedModels';
import { getDataColumnId } from 'src/utils/flexlistHelper';
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Head from 'next/head';
import { getDefaultValues } from 'src/utils/flexlistHelper';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

type Props = {
  columns: any;
  rows: any;
  currentView: View;
  translations: TranslationText[];
  refresh: Boolean;
  fetchRows: () => void;
  setCurrentView: (view: View) => void;
  clearRefresh: () => void;
};

const GanttView = (props: Props) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { columns, rows, currentView, translations, refresh, fetchRows, setCurrentView, clearRefresh } = props;
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">("view");
  const [tasks, setTasks] = useState([]);

  const LEVELS = 10;
  const startMonth = startOfMonth(new Date());
  const endMonth = endOfMonth(new Date());
  const currentDateUnit = Math.floor((new Date()).getDate() / 10);

  useEffect(() => {
    if (refresh) fetchRows();
  }, [refresh]);

  useEffect(() => {
    clearRefresh();

    setTasks(rows.map((row: any) => (
      {
        id: row.id,
        name: row[currentView.config?.titleId],
        type: 'task',
        progress: row[currentView.config?.progressId],
        start: new Date(row[currentView.config?.fromId]),
        end: new Date(row[currentView.config?.toId]),
        styles: { progressColor: currentView.config?.colorId ? row[currentView.config?.colorId] : theme.palette.palette_style.background.calendarItem,
          progressSelectedColor: '#ff9e0d' },
        dependencies: currentView.config?.dependencyId ? row[currentView.config?.dependencyId] : []
      }
    )));
  }, [rows]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    let newView: View = Object.assign({}, currentView);
    newView.conditions = [];

    const fromColumn = getDataColumnId(currentView.config.fromId, columns);
    const toColumn = getDataColumnId(currentView.config.toId, columns);
    const filter1: FlatWhere = {
      left: fromColumn,
      leftType: "Field",
      right: `${format(thirdRange[thirdRange.length - 1], 'MM/dd/yyyy')} 00:00:00`,
      rightType: "SearchString",
      cmp: 'lt',
    } as FlatWhere;
    const filter2: FlatWhere = {
      left: toColumn,
      leftType: "Field",
      right: `${format(firstRange[0], 'MM/dd/yyyy')} 23:59:59`,
      rightType: "SearchString",
      cmp: 'gt',
    } as FlatWhere;
    
    newView.conditions.push(filter1);
    newView.conditions.push("And");
    newView.conditions.push(filter2);

    setCurrentView(newView);
    fetchRows();
  }, []);

  const getRange = (startMonth: Date, endMonth: Date, unit: number) => {
    return eachDayOfInterval({ start: startMonth, end: endMonth }).filter((date, i) => Math.floor(date.getDate() / 10) === unit);
  };

  const lastRange = (startMonth: Date, endMonth: Date) => {
    let rangeDays = eachDayOfInterval({ start: startMonth, end: endMonth }).filter((date, i) => Math.floor(date.getDate() / 10) === 2);
    
    if (endMonth.getDate() === 31) {
      rangeDays.push(subDays(endMonth, 1));
    }

    rangeDays.push(endMonth);
    
    return rangeDays;
  };

  const firstRange = currentDateUnit < 1 ?
    lastRange(startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))) :
    getRange(startMonth, endMonth, currentDateUnit - 1);
  const secondRange = currentDateUnit > 1 ? lastRange(startMonth, endMonth) : getRange(startMonth, endMonth, currentDateUnit);
  const thirdRange = currentDateUnit === 2 ?
    getRange(startOfMonth(addMonths(new Date(), 1)), endOfMonth(addMonths(new Date(), 1)), 0) :
    currentDateUnit === 1 ? lastRange(startMonth, endMonth) : getRange(startMonth, endMonth, currentDateUnit + 1);
  const ganttDays = firstRange.concat(secondRange, thirdRange);

  const handleClickCell = (level: number, row?: any) => {
    if (row) {
      setRowData(row);
      setMode('view');
    } else {
      const newRow: any = getDefaultValues(columns);

      newRow[currentView.config?.levelId] = level;

      setRowData(newRow);
      setMode('create');
    }
    
    setVisibleAddRowPanel(true);    
  };

  return (
    <Box sx={{ p: {xs: 0.5, md: 1} }}>
      <Head>
        <title>{t("Gantt Page Title")}</title>
        <meta name="description" content={t("Gantt Meta Description")} />
        <meta name="keywords" content={t("Gantt Meta Keywords")} />
      </Head>
      <Box sx={{ height: `${windowHeight - (isDesktop ? 195 : 240)}px`, overflow: 'auto' }}>
        {tasks.length && <Gantt
          tasks={tasks}
          viewMode={ViewMode.Day}
          viewDate={new Date()}
          // ganttHeight={200}
          // listCellWidth={"0"}
        />}
      </Box>

      <ViewFooter
        translations={translations}
        visibleAddRowPanel={visibleAddRowPanel}
        rowData={rowData}
        setVisibleAddRowPanel={setVisibleAddRowPanel}
        setRowData={setRowData}
        mode={mode}
        setMode={setMode}
      />
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
  rows: state.view.rows,
  currentView:state.view.currentView
});

const mapDispatchToProps = {
  fetchRows,
  setCurrentView
};

export default connect(mapStateToProps, mapDispatchToProps)(GanttView);
