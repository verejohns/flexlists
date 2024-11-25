import { useTheme } from '@mui/material/styles';
import {
  Box, Button
} from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
import { connect } from 'react-redux';
import { View } from 'src/models/SharedModels';
import { hasPermission } from 'src/utils/permissionHelper';
import AddIcon from "@mui/icons-material/Add";
import { ViewField } from 'src/models/ViewField';
import { getDefaultValues } from 'src/utils/flexlistHelper';
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

interface Props {
  handleAddNewRow: (values: any) => void;
  currentView: View;
  columns: ViewField[];
  translations: TranslationText[];
}

function AddRowButton({
  handleAddNewRow,
  currentView,
  columns,
  translations
}: Props) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Box
      sx={{
        display: "flex",
        px: { xs: 0 },
        gap: { xs: 1, md: 4 }
      }}
      onClick={() => { handleAddNewRow(getDefaultValues(columns)) }}>
      {hasPermission(currentView?.role, "Create") && (
        <Button
          variant="contained"
          onClick={handleAddNewRow}
          sx={{
            // position: "absolute",
            // top: -80,
            // left: 80,
            flex: { md: 1 },
            backgroundColor: theme.palette.palette_style.primary.main,
            color: theme.palette.palette_style.text.white,
            // opacity: 0.2,
            px: { xs: 1, md: 2 },
            height: 32,
            ml: { xs: 0, lg: 6 },
            width: "max-content",
            "&:hover": {
              backgroundColor: theme.palette.palette_style.primary.dark,
              // opacity: 1,
            },
          }}
        >
          <AddIcon sx={{ mr: 0.5, }} />
          {isDesktop ? t("Add New Row") : ""}
        </Button>
      )}
    </Box>
  );
};
const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
  columns: state.view.columns,
});

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(AddRowButton);