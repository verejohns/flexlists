import { useEffect, useState } from "react";
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import useResponsive from '../../hooks/useResponsive';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Scatter } from 'react-chartjs-2';
import ViewFooter from '../../components/view-footer/ViewFooter';
import { TranslationText, View } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { fetchRows, setCurrentView } from '../../redux/actions/viewActions';
import { ViewField } from 'src/models/ViewField';
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import { getLocalDateTimeFromString, getLocalDateFromString } from "src/utils/convertUtils";
import { getDefaultValues } from 'src/utils/flexlistHelper';
import { ChartType } from "src/enums/ChartTypes";
import Head from 'next/head';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ChartViewProps = {
  translations: TranslationText[];
  columns: ViewField[];
  rows: any;
  refresh: Boolean;
  currentView: View;
  fetchRows: () => void;
  clearRefresh: () => void;
  setCurrentView: (view: View) => void;
};

const ChartView = ({
  translations,
  columns,
  rows,
  refresh,
  currentView,
  fetchRows,
  clearRefresh,
  setCurrentView
}: ChartViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const [windowHeight, setWindowHeight] = useState(0);
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">("view");

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    let newView: View = Object.assign({}, currentView);

    newView.order = [
      {
        fieldId: currentView.config?.xId,
        direction: "asc",
      },
      {
        fieldId: currentView.config?.yId,
        direction: "desc",
      }
    ];

    setCurrentView(newView);
    fetchRows();
  }, []);

  useEffect(() => {
    if (refresh) fetchRows();
  }, [refresh]);

  useEffect(() => {
    clearRefresh();
  }, [rows]);

  const getColor = (row: any) => currentView.config?.colorId ?
    row[currentView.config?.colorId] :
    theme.palette.palette_style.background.calendarItem;

  const getColors = () => {
    if (currentView.config?.colorId) return rows.map((row: any) => getColor(row));      
    else {
      return Array.from(
        { length: rows.length },
        (_, index) => theme.palette.palette_style.background.calendarItem
      )
    }
  };

  const getChartData = () => {
    if (currentView.config?.multiLineChoiceId) {
      const multiLineChoiceField = columns.find((column: ViewField) => column.id === currentView.config?.multiLineChoiceId);

      return multiLineChoiceField?.config.values.map((value: any) => ({
        label: value.label,
        data: rows.filter((row: any) => row[multiLineChoiceField.id] === value.label).map((row: any) =>
          ({x: getXLabel(columns.find((column: ViewField) => column.id === currentView.config?.xId)?.uiField, row), y: row[currentView.config?.yId]})
        ),
        borderColor: value.color.bg,
        backgroundColor: value.color.bg,
        pointRadius: 6
      }));
    } else {
      return [{
        label: currentView.config?.yLabel ?
          currentView.config?.yLabel :
          columns.find((column: ViewField) => column.id === currentView.config?.yId)?.name,
        data: rows.map((row: any) => (currentView.config?.type === ChartType.Pie || currentView.config?.type === ChartType.Doughnut) ?
          row[currentView.config?.yId] :
          ({x: getXLabel(columns.find((column: ViewField) => column.id === currentView.config?.xId)?.uiField, row), y: row[currentView.config?.yId]})
        ),
        borderColor: getColors(),
        backgroundColor: getColors(),
        elements: {
          point: {
            pointStyle: 'circle',
            radius: 6,
            hoverRadius: 8,
            backgroundColor: getColors(),
            borderColor: getColors()
          },
        }
      }];
    }
  };

  const getXLabel = (xUiField: any, row: any) => {
    switch (xUiField) {
      case FieldUiTypeEnum.DateTime:
        return getLocalDateTimeFromString(row[currentView.config?.xId]);
      case FieldUiTypeEnum.Date:
        return getLocalDateFromString(row[currentView.config?.xId]);
      default:
        return row[currentView.config?.xId];
    }
  }

  const getLabels = () => {
    const xField = columns.find((column: ViewField) => column.id === currentView.config?.xId);

    return currentView.config?.type === ChartType.Scatter ?
      [...new Set(rows.map((row: any) => getXLabel(xField?.uiField, row)))] :
      rows.map((row: any) => getXLabel(xField?.uiField, row));
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>, activeElements: any[]) => {
    if (activeElements.length > 0) {
      const clickedElement = activeElements[0];

      if (currentView.config?.multiLineChoiceId) {
        const multiLineChoiceField = columns.find((column: ViewField) => column.id === currentView.config?.multiLineChoiceId);
        const dataset = multiLineChoiceField?.config.values.map((value: any) =>
          rows.filter((row: any) => row[multiLineChoiceField.id] === value.label));
        
        setRowData(dataset[clickedElement.datasetIndex][clickedElement.index]);
      } else setRowData(rows[clickedElement.index]);

      setMode('view');
    } else {
      setRowData(getDefaultValues(columns));
      setMode('create');
    }

    setVisibleAddRowPanel(true);
  };

  const chartOptions: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: currentView.config?.multiLineChoiceId,
        text: currentView.config?.yLabel ? currentView.config?.yLabel : columns.find((column: ViewField) => column.id === currentView.config?.yId)?.name
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        display: currentView.config?.type !== ChartType.Pie && currentView.config?.type !== ChartType.Doughnut,
        type: 'category',
        title: {
          display: true,
          text: currentView.config?.xLabel ? currentView.config?.xLabel : columns.find((column: ViewField) => column.id === currentView.config?.xId)?.name
        },
      }
    },
    onClick: handleClick
  };

  const chartData: any = {
    labels: currentView.config?.type === ChartType.Pie || currentView.config?.type === ChartType.Doughnut ? getLabels() : [],
    datasets: getChartData(),
  };

  return (
    <Box sx={{ paddingTop: 2 }}>
      <Head>
        <title>{t("Chart Page Title")}</title>
        <meta name="description" content={t("Chart Meta Description")} />
        <meta name="keywords" content={t("Chart Meta Keywords")} />
      </Head>

      {windowHeight && <Box sx={{ height: {xs: `${windowHeight - 250}px`, md: `${windowHeight - 206}px`} }}>
        {currentView.config?.type === ChartType.Line && <Line options={chartOptions} data={chartData} />}
        {currentView.config?.type === ChartType.Bar && <Bar options={chartOptions} data={chartData} />}
        {currentView.config?.type === ChartType.Pie && <Pie options={chartOptions} data={chartData} />}
        {currentView.config?.type === ChartType.Doughnut && <Doughnut options={chartOptions} data={chartData} />}
        {currentView.config?.type === ChartType.Scatter && <Scatter options={chartOptions} data={chartData} />}
      </Box>}

      <ViewFooter
        visibleAddRowPanel={visibleAddRowPanel}
        rowData={rowData}
        setVisibleAddRowPanel={setVisibleAddRowPanel}
        setRowData={setRowData}
        translations={[]}
        mode={mode}
        setMode={setMode}
      />
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
  columns: state.view.columns,
  rows: state.view.rows
});

const mapDispatchToProps = {
  fetchRows,
  setCurrentView
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartView);
