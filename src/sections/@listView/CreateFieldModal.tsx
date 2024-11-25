import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import CentralModal from "src/components/modal/CentralModal";
import { connect } from "react-redux";
import { Field, FieldUIType, View } from "src/models/SharedModels";
import FieldFormPanel from "../@list/FieldFormPanel";
import { fetchRows, setColumns } from "src/redux/actions/viewActions";
import { ViewField } from "src/models/ViewField";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { Drawer } from "@mui/material";

type ViewFieldConfigProps = {
  translations: TranslationText[];
  open: boolean;
  handleClose: () => void;
  field: Field;
  currentView: View;
  columns: ViewField[];
  fieldUiTypes: FieldUIType[];
  fetchRows: () => void;
  setColumns: (columns: ViewField[]) => void;
};

const ViewFieldsConfig = ({
  translations,
  open,
  handleClose,
  field,
  currentView,
  columns,
  fieldUiTypes,
  fetchRows,
  setColumns,
}: ViewFieldConfigProps) => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [windowHeight, setWindowHeight] = useState(0);

  const addField = async (field: Field) => {
    var viewField: ViewField = Object.assign(field);
    viewField.viewFieldName = field.name;
    viewField.viewFieldDetailsOnly = field.detailsOnly;
    viewField.viewFieldVisible = true;
    setColumns([viewField].concat(columns));
    fetchRows();
  };
  return (
    // <CentralModal open={open} handleClose={handleClose} zIndex={1200}>
    //   {
    //     <FieldFormPanel
    //       fieldUiTypes={fieldUiTypes}
    //       viewId={currentView.id}
    //       field={field}
    //       onAdd={(field) => addField(field)}
    //       onUpdate={(field) => {}}
    //       onDelete={(id) => {}}
    //       onClose={() => handleClose()}
    //       translations={translations}
    //     />
    //   }
    // </CentralModal>
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: {xs: '100%', lg: '500px'},
          border: 'none',
          minHeight: "100svh",
          backgroundColor: theme.palette.palette_style.background.default,
        }
      }}
    >
      {
        <FieldFormPanel
          fieldUiTypes={fieldUiTypes}
          viewId={currentView.id}
          field={field}
          onAdd={(field) => addField(field)}
          onUpdate={(field) => {}}
          onDelete={(id) => {}}
          onClose={() => handleClose()}
          translations={translations}
        />
      }
    </Drawer>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
  columns: state.view.columns,
});

const mapDispatchToProps = {
  setColumns,
  fetchRows,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewFieldsConfig);
