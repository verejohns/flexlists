import { useTheme } from "@mui/material/styles";
import { Box, Button } from "@mui/material";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import AddIcon from "@mui/icons-material/Add";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type Props = {
  translations: TranslationText[];
  modalHandle: (value: boolean) => void;
  disabled: boolean;
};

export default function AddColumnButton({
  translations,
  modalHandle,
  disabled,
}: Props) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();

  return (
    // <Box
    //   component="span"
    //   onClick={() => modalHandle(true)}
    //   className="svg-color"
    //   sx={{
    //     width: 18,
    //     height: 18,
    //     display: "inline-block",
    //     bgcolor: theme.palette.palette_style.text.primary,
    //     mask: `url(/assets/icons/menu/Plus.svg) no-repeat center / contain`,
    //     WebkitMask: `url(/assets/icons/menu/Plus.svg) no-repeat center / contain`,
    //     cursor: "pointer",
    //   }}
    // />
    <Button
      onClick={() => modalHandle(true)}
      fullWidth
      size="large"
      variant="contained"
      disabled={disabled}
    >
      <AddIcon sx={{ mr: 1 }} />
      {t("Edit Fields")}
    </Button>
  );
}
