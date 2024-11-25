import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BooleanModel } from "src/models/BooleanModel";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { colors } from "./ChoiceConfig";

type BooleanConfigProps = {
  translations: TranslationText[];
  items: BooleanModel[];
  updateItems: (items: BooleanModel[]) => void;
};

export default function BooleanConfig({
  translations,
  items,
  updateItems,
}: BooleanConfigProps) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [newItems, setNewItems] = useState<BooleanModel[]>([]);

  useEffect(() => {
    if (items.length) {
      setNewItems(items);
    } else {
      setNewItems([
        {
          label: "Yes",
          color: colors[8],
          visibleColorBar: false
        },
        {
          label: "No",
          color: colors[7],
          visibleColorBar: false
        }
      ]);
    }
  }, []);

  const hideColorBar = (index: number) => {
    const updatedItems = newItems.map((item, i) => {
      if (index !== i) item.visibleColorBar = false;

      return item;
    });

    updateItems(updatedItems);
  };

  const handleColorBar = (index: number) => {
    hideColorBar(index);

    const updatedItems = newItems.map((item, i) => {
      if (index === i) item.visibleColorBar = !item.visibleColorBar;

      return item;
    });

    updateItems(updatedItems);
  };

  const handleColorItem = (index: number, color: any) => {
    const updatedItems = newItems.map((item, i) => {
      if (index === i) {
        item.color = color;
        item.visibleColorBar = false;
      }

      return item;
    });

    updateItems(updatedItems);
  };

  return (
    <FormControl required>
      <FormLabel sx={{ my: 1 }}>{t("Items")}</FormLabel>
      <Box>
        {newItems.map((item, index) => (
          <Box
            key={`${item.label}-${index}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 1,
              position: "relative",
            }}
          >
            <Box sx={{ marginRight: 1 }}>
              <Box
                className="item_wrap"
                sx={{
                  backgroundColor: item?.color?.bg,
                  width: "40px",
                  height: "40px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  handleColorBar(index);
                }}
              >
                <Box
                  component="span"
                  className="svg-color item_wrap"
                  sx={{
                    width: 24,
                    height: 24,
                    display: "inline-block",
                    bgcolor: item?.color?.fill,
                    mask: `url(/assets/icons/angle_down.svg) no-repeat center / contain`,
                    WebkitMask: `url(/assets/icons/angle_down.svg) no-repeat center / contain`,
                  }}
                />
              </Box>
              <Box
                sx={{
                  borderRadius: "5px",
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: "#fff",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  width: "342px",
                  height: item.visibleColorBar ? "inherit" : 0,
                  transition: "height 0.3s",
                  display: item.visibleColorBar ? "flex" : "none",
                  flexWrap: "wrap",
                  padding: 0.5,
                  left: 0,
                  top: 44,
                }}
              >
                {colors.map((color, sub_index) => (
                  <Box
                    key={sub_index}
                    sx={{
                      backgroundColor: color.bg,
                      width: "36px",
                      height: "36px",
                      cursor: "pointer",
                      margin: 0.7,
                      borderRadius: 5,
                      textAlign: "center",
                      paddingTop: "7px",
                      color: color.fill,
                    }}
                    onClick={() => {
                      handleColorItem(index, color);
                    }}
                  >
                    Tt
                  </Box>
                ))}
              </Box>
            </Box>
            <TextField
              className="choice_text"
              value={item.label}
              size="small"
              sx={{
                backgroundColor: item?.color?.bg,
                borderRadius: 1,
                width: "calc(100% - 30px)",
                input: { color: item?.color?.fill },
              }}
            />
          </Box>
        ))}
      </Box>
    </FormControl>
  );
}