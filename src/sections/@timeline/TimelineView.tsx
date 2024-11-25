import { useState, useEffect } from "react";
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import { fetchRows, setCurrentView } from '../../redux/actions/viewActions';
import ViewFooter from '../../components/view-footer/ViewFooter';
import { format, startOfMonth, endOfMonth, getDaysInMonth } from 'date-fns';
import { FlatWhere, View } from 'src/models/SharedModels';
import { getDataColumnId } from 'src/utils/flexlistHelper';
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Head from 'next/head';
import { getDefaultValues } from 'src/utils/flexlistHelper';
import TimelineRows from "./TimelineRows";
import useResponsive from '../../hooks/useResponsive';

type TimelineViewProps = {
  columns: any;
  rows: any;
  currentView: View,
  translations: TranslationText[];
  refresh: Boolean;
  fetchRows: () => void;
  setCurrentView: (view: View) => void;
  clearRefresh: () => void;
};

const TimelineView = ({
  columns,
  rows,
  currentView,
  translations,
  refresh,
  fetchRows,
  setCurrentView,
  clearRefresh
}: TimelineViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [windowHeight, setWindowHeight] = useState(0);
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">("view");

  const LEVELS = 10;
  const currentMonth = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());
  const daysInMonth = getDaysInMonth(new Date());

  useEffect(() => {
    if (refresh) fetchRows();
  }, [refresh]);

  useEffect(() => {
    clearRefresh();
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
      right: `${format(endDate, 'MM/dd/yyyy')} 00:00:00`,
      rightType: "SearchString",
      cmp: 'lt',
    } as FlatWhere;
    const filter2: FlatWhere = {
      left: toColumn,
      leftType: "Field",
      right: `${format(currentMonth, 'MM/dd/yyyy')} 23:59:59`,
      rightType: "SearchString",
      cmp: 'gt',
    } as FlatWhere;
    
    newView.conditions.push(filter1);
    newView.conditions.push("And");
    newView.conditions.push(filter2);

    setCurrentView(newView);
    fetchRows();
  }, []);

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
        <title>{t("Timeline Page Title")}</title>
        <meta name="description" content={t("Timeline Meta Description")} />
        <meta name="keywords" content={t("Timeline Meta Keywords")} />
      </Head>
      <Box sx={{ textTransform: 'uppercase', backgroundColor: '#F6F8FA', px:2, py: 1.2 }}>
        {format(currentMonth, 'MMMM yyyy')}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: `repeat(${LEVELS}, 1fr)`,
          border: `1px solid ${theme.palette.palette_style.border.default}`,
          height: `${windowHeight - (isDesktop ? 235 : 280)}px`,
          overflow: 'auto'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`, height: '60px' }}>
          {Array.from(
            { length: daysInMonth },
            (_, index) => (
              <Box
                key={`daytitle-${index}`}
                sx={{
                  minWidth: '40px',
                  height: '66px',
                  textAlign: 'center',
                  fontSize: '14px',
                  borderRight: `1px solid ${theme.palette.palette_style.border.default}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {index + 1}
              </Box>
            )
          )}
        </Box>
        {Array.from(
          { length: LEVELS },
          (_, index) => (
            <TimelineRows key={`showRows-${index}`} rowIndex={index} handleClickCell={handleClickCell} />
          )
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(TimelineView);
