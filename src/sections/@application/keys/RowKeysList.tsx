import React, { useState } from "react";
import {
  Button,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SwitchKeyLabels from "./SwitchKeyLabels";
import { applicationService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { fetchApplicationKeys } from "src/redux/actions/applicationActions";

type RowKeysListProps = {
  translations: TranslationText[];
  item: any;
  fetchApplicationKeys: (applicationId: number) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const frameBox: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "40vh",
  paddingRight: "13px",
  paddingTop: "10px",
  paddingBottom: "10px",
};

const RowKeysList = ({
  translations,
  item,
  fetchApplicationKeys,
  setFlashMessage,
}: RowKeysListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [open, setOpen] = useState(false);
  const [roleIds, setRoleIds] = useState([]);

  const handleRemove = async () => {
    const response = await applicationService.removeApplicationKey(
      item.applicationId,
      item.id
    );

    if (isSucc(response) && response.data) {
      fetchApplicationKeys(item.applicationId);
      setFlashMessage({ message: "Removed key successfully", type: "success" });
    } else {
      setFlashMessage({ message: response?.data?.message, type: "error" });
    }
  };

  const handleButtonClick = () => {
    setOpen(!open);
  };

  const handleUpdate = async () => {
    const response = await applicationService.updateApplicationKey(
      item.applicationId,
      item.name,
      item.id,
      roleIds
    );

    if (isSucc(response) && response.data) {
      fetchApplicationKeys(item.applicationId);
      setFlashMessage({ message: "Updated key successfully", type: "success" });
    } else {
      setFlashMessage({ message: response?.data?.message, type: "error" });
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell onClick={handleButtonClick}>{item.name}</TableCell>
        <TableCell onClick={handleButtonClick}>{item.description}</TableCell>
        <TableCell align="right">
          <IconButton
            onClick={handleRemove}
            size="small"
            aria-label="delete"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleButtonClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          align="right"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={3}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div style={frameBox}>
              {item.roles &&
                item.roles.map(({ name, id, inKey }: any) => {
                  return (
                    <SwitchKeyLabels
                      key={id}
                      id={id}
                      name={name}
                      inKey={inKey}
                      setRoleIds={setRoleIds}
                    />
                  );
                })}
            </div>
            <div style={{ padding: "15px 0" }}>
              <Button
                // disabled={statusUpdate === "resolved"}
                variant="contained"
                size="small"
                onClick={handleUpdate}
              >
                {t("Update Key")}
              </Button>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  fetchApplicationKeys,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(RowKeysList);
