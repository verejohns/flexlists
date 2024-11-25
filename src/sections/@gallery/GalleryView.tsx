import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { connect } from "react-redux";
import useResponsive from "../../hooks/useResponsive";
import ViewFooter from "../../components/view-footer/ViewFooter";
import Pagination from "@mui/material/Pagination";
import { View } from "src/models/SharedModels";
import { fetchRowsByPage, setCurrentView } from "src/redux/actions/viewActions";
import {
  getDataColumnId,
  downloadFileUrl,
  imageStringToJSON,
} from "src/utils/flexlistHelper";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";

type Props = {
  rows: any;
  columns: any;
  currentView: View;
  count: number;
  translations: TranslationText[];
  refresh: Boolean;
  fetchRowsByPage: (page?: number, limit?: number) => void;
  setCurrentView: (view: View) => void;
  clearRefresh: () => void;
};

const GalleryView = (props: Props) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const {
    rows,
    columns,
    currentView,
    count,
    translations,
    refresh,
    fetchRowsByPage,
    setCurrentView,
    clearRefresh,
  } = props;
  const isXL = useResponsive("up", "xl");
  const isLG = useResponsive("up", "lg");
  const isMD = useResponsive("up", "md");
  const [visibleAddRowPanel, setVisibleAddRowPanel] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowHeight, setWindowHeight] = useState(0);
  const [mode, setMode] = useState<"view" | "create" | "update" | "comment">(
    "view"
  );

  const PAGE_SIZE = isXL ? 12 : isLG ? 10 : isMD ? 8 : 6;

  useEffect(() => {
    if (refresh) fetchRowsByPage(currentView.page, PAGE_SIZE);
  }, [refresh]);

  useEffect(() => {
    clearRefresh();
  }, [rows]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    fetchRowsByPage(0, PAGE_SIZE);
  }, []);

  const handlePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const newView: View = Object.assign({}, currentView);
    newView.page = value - 1;
    setCurrentPage(value);
    setCurrentView(newView);
    fetchRowsByPage(newView.page, PAGE_SIZE);
  };

  const handleData = (data: any) => {
    setSelectedRowData(data);
    setVisibleAddRowPanel(true);
    setMode("view");
  };

  const getImage = (data: any): string => {
    const columnData =
      data[getDataColumnId(currentView.config.imageId, columns)];
    return columnData
      ? downloadFileUrl(
          imageStringToJSON(columnData)?.fileId,
          currentView.id,
          parseInt(
            getDataColumnId(currentView.config.imageId, columns) as string
          )
        )
      : `/assets/images/noImage.jpg`;
  };

  const getTitle = (data: any): string => {
    return data[getDataColumnId(currentView.config.titleId, columns)];
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1,
        overflowY: "auto",
        height: `${windowHeight - (isLG ? 205 : isMD ? 260 : 262)}px`,
      }}
    >
      <Head>
        <title>{t("Gallery Page Title")}</title>
        <meta name="description" content={t("Gallery Meta Description")} />
        <meta name="keywords" content={t("Gallery Meta Keywords")} />
      </Head>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
            xl: "repeat(6, 1fr)",
          },
          gap: "24px",
        }}
      >
        {rows.map((row: any) => (
          <Box
            key={row.id}
            sx={{
              boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "16px",
              overflow: "hidden",
              maxHeight: { sm: "408px" },
              cursor: "pointer",
              background: theme.palette.palette_style.background.paper,
            }}
            onClick={() => {
              handleData(row);
            }}
          >
            <Box
              component="img"
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
              }}
              alt="User image"
              src={getImage(row)}
            />
            {getTitle(row) && (
              <Box sx={{ px: 1.5, py: 2, marginTop: 1 }}>
                <Box sx={{ marginBottom: 1.5 }}>
                  <Box sx={{ fontSize: "12px", textTransform: "uppercase" }}>
                    {t("Title")}
                  </Box>
                  <Box sx={{ fontWeight: "bold" }}>{getTitle(row)}</Box>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <ViewFooter
        translations={translations}
        visibleAddRowPanel={visibleAddRowPanel}
        rowData={selectedRowData}
        setVisibleAddRowPanel={setVisibleAddRowPanel}
        setRowData={setSelectedRowData}
        mode={mode}
        setMode={setMode}
      >
        <Pagination
          count={Math.ceil(count / PAGE_SIZE)}
          page={currentPage}
          onChange={handlePage}
        />
      </ViewFooter>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  rows: state.view.rows,
  columns: state.view.columns,
  currentView: state.view.currentView,
  count: state.view.count,
});

const mapDispatchToProps = {
  fetchRowsByPage,
  setCurrentView,
};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryView);
