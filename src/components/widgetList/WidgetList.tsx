import React, {memo} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material/IconButton";
// import styles from "./WidgetList.module.scss";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import WidgetListItem from "./WidgetListItem";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { toggleOpenWidget } from "src/redux/actions/applicationActions";
import { connect } from "react-redux";
import { drawerWidthLeft, INewWidget, widgetsNew } from "src/constants/widget";
import { Drawer, Divider, Box } from "@mui/material";

type WidgetListProps = {
  translations: TranslationText[];
  openWidget: boolean;
  toggleOpenWidget: () => void;
};

const WidgetList = ({
  translations,
  openWidget,
  toggleOpenWidget
}: WidgetListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState<string | false>("panel1a");
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  return (
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: "#f5f5f5",
        },
      }}
      sx={{
        width: `${drawerWidthLeft}px`,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: `${drawerWidthLeft}px`,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={openWidget}
    >
      <Box sx={{ padding: '4px 0', textAlign: 'right' }}>
        <IconButton onClick={toggleOpenWidget}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ padding: '10px 10px 0 10px' }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>{t('Forms')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {widgetsNew.map((item: INewWidget, id: number) => {
                return (
                  <Grid xs="auto" padding={0} key={id}>
                    <WidgetListItem widgetTemplate={item} />
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  );
};

const mapStateToProps = (state: any) => ({
  openWidget: state.application.openWidget
});

const mapDispatchToProps = {
  toggleOpenWidget
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetList);
