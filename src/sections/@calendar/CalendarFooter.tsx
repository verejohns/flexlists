import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddRowButton from "../../components/add-button/AddRowButton";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type Props = {
  mode: string;
  translations: TranslationText[];
  handleNewRowPanel: (values: any) => void;
  handleMode: (mode: string) => void;
};

const CalendarFooter = (props: Props) => {
  const { mode, translations, handleNewRowPanel, handleMode } = props;
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();

  const modes = ["month", "week", "day", "list"];
  const labels = [t("Month"), t("Week"), t("Day"), t("List")];

  return (
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
      <Box
        sx={{
          display: "flex",
          backgroundColor: theme.palette.palette_style.background.nav_icon,
          borderRadius: "8px",
          overflow: "hidden",
          my: 0.2,
          textTransform: "capitalize",
        }}
      >
        {modes.map((item: string, i: number) => (
          <Box
            key={item}
            sx={{
              py: 0.3,
              px: { xs: 2, md: 4 },
              backgroundColor:
                mode === item
                  ? theme.palette.palette_style.text.selected
                  : "inherit",
              color: mode === item ? "white" : "inherit",
              cursor: "pointer",
            }}
            onClick={() => {
              handleMode(item);
            }}
          >
            {labels[i]}
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default CalendarFooter;
