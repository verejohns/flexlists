import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box component={"div"} sx={{ py: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
};

type TabViewProps = {
  translations: TranslationText[];
};

const TabView = ({ translations }: TabViewProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const theme = useTheme();

  const details = [
    {
      image: t("Section5 Item1 Image"),
      alt: t("Section5 Item1 Title"),
      description: t("Section5 Item1 Description"),
    },
    {
      image: t("Spreadsheet view image"),
      alt: t("Spreadsheet view title"),
      description: t("Spreadsheet view description"),
    },
    {
      image: t("Section5 Item2 Image"),
      alt: t("Section5 Item2 Title"),
      description: t("Section5 Item2 Description"),
    },
    {
      image: t("Section5 Item3 Image"),
      alt: t("Section5 Item3 Title"),
      description: t("Section5 Item3 Description"),
    },
    {
      image: t("Section5 Item4 Image"), // kanban
      alt: t("Section5 Item4 Title"),
      description: t("Section5 Item4 Description"),
    },
    {
      image: t("Map view image"),
      alt: t("Map view title"),
      description: t("Map view description"),
    },
    {
      image: t("Section5 Item5 Image"),
      alt: t("Section5 Item5 Title"),
      description: t("Section5 Item5 Description"),
    },
    {
      image: t("Section5 Item6 Image"),
      alt: t("Section5 Item6 Title"),
      description: t("Section5 Item6 Description"),
    },
    {
      image: t("Section5 Item7 Image"),
      alt: t("Section5 Item7 Title"),
      description: t("Section5 Item7 Description"),
    },
  ];

  const items = [
    { title: t("Section5 Item1 Title") },
    { title: t("Spreadsheet view title") },
    { title: t("Section5 Item2 Title") },
    { title: t("Section5 Item3 Title") },
    { title: t("Section5 Item4 Title") }, // kanban
    { title: t("Maps view title") },
    { title: t("Section5 Item5 Title") },
    { title: t("Section5 Item6 Title") },
    { title: t("Section5 Item7 Title") },
  ];

  return (
    <Box sx={{ my: { xs: 2, md: 4 } }}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Tabs
            variant="scrollable"
            allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
          >
            {items.map((item, index) => (
              <Tab
                key={index}
                label={item.title}
                sx={{
                  minWidth: "fit-content",
                  flex: 1,
                  color: theme.palette.palette_style.text.primary,
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      {details.map((detail, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Grid container spacing={2} sx={{ py: 2, p: 0 }}>
            <Grid
              item
              md={6}
              sx={{
                position: "relative",
              }}
            >
              <img
                style={{ width: "100%" }}
                src={detail.image}
                alt={detail.alt}
              />
            </Grid>
            <Grid item md={6}>
              <Typography variant="body1">{detail.description}</Typography>
            </Grid>
          </Grid>
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabView;
