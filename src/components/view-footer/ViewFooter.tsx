import { ReactNode } from "react";
import { Stack, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import { setColumns } from "../../redux/actions/viewActions";
import { setRows } from "../../redux/actions/viewActions";
import AddRowButton from "../../components/add-button/AddRowButton";
import RowFormPanel from "src/sections/@list/RowFormPanel";
import { TranslationText } from "src/models/SharedModels";

type Props = {
  columns: any;
  rows: any;
  rowData: any;
  visibleAddRowPanel: boolean;
  translations: TranslationText[];
  children?: ReactNode;
  mode: any;
  setColumns: (columns: any) => void;
  setRows: (columns: any) => void;
  setVisibleAddRowPanel: (visibleAddRowPanel: boolean) => void;
  setRowData: (rowData: any) => void;
  setMode: (mode: any) => void;
};

const ViewFooter = (props: Props) => {
  const {
    columns,
    rows,
    visibleAddRowPanel,
    rowData,
    translations,
    children,
    mode,
    setRows,
    setVisibleAddRowPanel,
    setRowData,
    setMode,
  } = props;
  const theme = useTheme();

  const handleNewRowPanel = (values: any) => {
    setRowData(values);
    setVisibleAddRowPanel(true);
    setMode("create");
  };

  const handleNewRow = (values: any, action: string) => {
    if (action === "create" || action === "clone") {
      rows.push(values);
      setRows([...rows]);
    } else if (action === "update")
      setRows(rows.map((row: any) => (row.id === values.id ? values : row)));
    else if (action === "delete")
      setRows(rows.filter((row: any) => row.id !== values.id));
    else {
    }
  };

  return (
    <Box sx={{}}>
      <Stack
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          py: 0.5,
          px: 1,
          height: 40,
          left: 0,
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: {
            xs: theme.palette.palette_style.background.default,
            md: "transparent",
          },
          flexDirection: "inherit",
        }}
      >
        <AddRowButton
          handleAddNewRow={(values) => handleNewRowPanel(values)}
          translations={translations}
        />
        {children}
      </Stack>

      <RowFormPanel
        rowData={[rowData]}
        columns={columns}
        onSubmit={handleNewRow}
        open={visibleAddRowPanel}
        onClose={() => setVisibleAddRowPanel(false)}
        mode={mode}
        translations={translations}
      />
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
  rows: state.view.rows,
});

const mapDispatchToProps = {
  setColumns,
  setRows,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewFooter);
