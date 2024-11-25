import React from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

interface PricingTableProps {
  styles?: any;
  translations: TranslationText[];
}

function createData(
  id: number,
  name: any,
  free: any,
  premium: any,
  // professional: any,
  enterprise: any
) {
  return { id, name, free, premium, enterprise };
}

const rows = [
  createData(
    1,
    <Typography variant="subtitle2">Overview</Typography>,
    "",
    "",
    ""
  ),
  createData(
    2,
    "Unlimited lists (limited by storage only)",
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),
  createData(
    3,
    "Unlimited rows (limited by storage only)",
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),
  createData(
    4,
    "Cluster setup",
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),
  createData(
    20,
    "Dedicated cluster",
    <CloseIcon sx={{ color: "red" }} />,
    <CloseIcon sx={{ color: "red" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),
  createData(
    5,
    "Users",
    "1 Admin/5 Viewers&Editors",
    "Unlimited Paid Admins&Editors, Free Viewers",
    "Unlimited Included Admins, Editors and Viewers"
  ),
  createData(
    11,
    "File storage (docs, image, video, audio)",
    "2GB",
    "4GB +)",
    "250GB+ (expandable)"
  ),
  createData(12, "Row storage", "1GB", "2GB +)", "250GB+ (expandable)"),
  // createData(
  //   18,
  //   "Cluster setup",
  //   "2x Shared 12 vCPU/64Gb RAM",
  //   "2x Shared 12 vCPU/64Gb RAM",
  //   "2x Dedicated 12 vCPU/64Gb RAM"
  // ),

  createData(
    13,
    "Support",
    "Within 48 hours",
    "Within 12 hours",
    "Within 4 hours"
  ),
  createData(15, "Delivery", "Instant", "Instant", "Within 24 hours"),
  createData(
    14,
    "Location",
    "EU only",
    "Choose US/EU (UK/Asia coming soon)",
    "Choose US/EU/UK/Asia/Australia"
  ),
  createData(
    30,
    "Data type",
    "OTLP (transactional)",
    "OTLP (transactional)",
    "OLTP/OLAP (transactional and analytical)"
  ),
  createData(
    6,
    <Typography variant="subtitle2">Features</Typography>,
    "",
    "",
    ""
  ),
  createData(
    7,
    "Views",
    "List, Sheet, Calendar",
    "List, Sheet, Calendar, Gantt, Kanban, Maps, Charts and more",
    "List, Sheet, Calendar, Gantt, Kanban, Maps, Charts and more"
  ),
  createData(
    9,
    "Create your own views",
    <CloseIcon sx={{ color: "red" }} />,
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),
  createData(
    8,
    "Integrations",
    <CloseIcon sx={{ color: "red" }} />,
    "Email, Webhooks, API and others coming soon",
    "Email, Webhooks, API and others coming soon"
  ),
  createData(
    26,
    "REST/GraphQL API",
    <CloseIcon sx={{ color: "red" }} />,
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),
  createData(
    25,
    "Export/Import XML, JSON, CSV/XLSX etc",
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),
  createData(
    9,
    "Create Applications",
    <CloseIcon sx={{ color: "red" }} />,
    <CloseIcon sx={{ color: "red" }} />,
    <DoneIcon sx={{ color: "green" }} />
  ),

  createData(
    16,
    <Typography variant="subtitle2">Comments</Typography>,
    "",
    "",
    ""
  ),
  createData(
    17,
    "",
    "",
    "+) Storage in premium plans gets shared between paying users in the same company, for instance, if you have paying 10 users in your company, you have 60Gb of storage in total.",
    "*) Enterprise cluster can handle very large amounts of users and data and can be extended at any time."
  ),
];

export default function PricingTable({
  styles,
  translations,
}: PricingTableProps) {
  const theme = useTheme();
  const t = (key: string): string => {
    if (!translations) return key;
    return getTranslation(key, translations);
  };
  styles = {
    tableBodyCell: {
      whiteSpace: { xs: "nowrap", md: "wrap" },
      overflow: "hidden",
      maxWidth: "256px",
      textOverflow: "ellipsis",
    },
    tableHeadCell: {
      color: theme.palette.palette_style.text.primary,
      maxWidth: "256px",
      minWidth: "256px",
    },
    tableBodyRow: {
      background: theme.palette.palette_style.background.paper,
      "&:last-child td, &:last-child th": { border: 0 },
      "&:hover": {
        backgroundColor:
          theme.palette.mode === "light"
            ? "rgba(250,250,250,1)"
            : "rgba(17,34,51,.7)",
      },
    },
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 320 }} /*size='small'*/ aria-label="simple table">
        <TableHead
          sx={{ background: theme.palette.palette_style.background.paper }}
        >
          <TableRow>
            <TableCell sx={styles?.tableHeadCell}>
              <Typography variant="h4">Pricing plans</Typography>
            </TableCell>
            <TableCell sx={styles?.tableHeadCell} align="center">
              <Typography variant="h5" gutterBottom>
                {t("Free")}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t(
                  "Best package for individuals just getting started with FlexLists.com."
                )}
              </Typography>
              <Button variant="contained" sx={{ mt: 1 }}>
                {t("Try Free Now")}
              </Button>
            </TableCell>
            <TableCell sx={styles?.tableHeadCell} align="center">
              <Typography variant="h5" gutterBottom>
                {t("Premium")}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t(
                  "Best package for individuals or smaller teams and companies."
                )}
              </Typography>
              <Button variant="contained" sx={{ mt: 1 }}>
                {t("Buy Premium Now")}
              </Button>
            </TableCell>
            <TableCell sx={styles?.tableHeadCell} align="center">
              <Typography variant="h5" gutterBottom>
                {t("Enterprise")}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t(
                  "All you can eat! Best package for any size teams and companies. *)"
                )}
              </Typography>
              <Button
                variant="contained"
                href="mailto:sales@flexlists.com"
                sx={{ mt: 1 }}
              >
                {t("Buy Enterprise Now")}
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={styles?.tableBodyRow}>
              <TableCell sx={styles?.tableBodyCell}>
                {typeof row.name === "string" ? t(row.name) : row.name}
              </TableCell>
              <TableCell sx={styles?.tableBodyCell} align="center">
                {typeof row.free === "string" ? t(row.free) : row.free}
              </TableCell>
              <TableCell sx={styles?.tableBodyCell} align="center">
                {typeof row.premium === "string" ? t(row.premium) : row.premium}
              </TableCell>

              <TableCell sx={styles?.tableBodyCell} align="center">
                {typeof row.enterprise === "string"
                  ? t(row.enterprise)
                  : row.enterprise}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
