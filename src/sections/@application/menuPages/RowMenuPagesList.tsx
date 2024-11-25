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
import SwitchRightLabels from "./SwitchRightLabels";
import EditIcon from "@mui/icons-material/Edit";
import { applicationService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { fetchApplicationMenus } from "src/redux/actions/applicationActions";

type RowMenuPagesListProps = {
  translations: TranslationText[];
  menu: any;
  applicationId: number;
  fetchApplicationMenus: (applicationId: number) => void;
  handleClickEditOpen: ({ id, name, description }: any) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const frameBox: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "40vh",
  paddingRight: "13px",
  paddingTop: "10px",
  paddingBottom: "10px",
};

const RowMenuPagesList = ({
  translations,
  menu,
  applicationId,
  fetchApplicationMenus,
  handleClickEditOpen,
  setFlashMessage,
}: RowMenuPagesListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const { id, name, description, roles }: any = menu;
  const [open, setOpen] = useState(false);
  const [roleIds, setRoleIds] = useState([]);

  const handleRemove = async () => {
    const response = await applicationService.removeApplicationMenuPage(
      applicationId,
      id
    );

    if (isSucc(response) && response.data) {
      fetchApplicationMenus(applicationId);
      setFlashMessage({
        message: "Removed menu successfully",
        type: "success",
      });
    } else {
      setFlashMessage({ message: response?.data?.message, type: "error" });
    }
  };

  const handleButtonClick = () => {
    setOpen(!open);
  };

  const handleUpdate = async () => {
    const response = await applicationService.updateApplicationMenuPage(
      id,
      applicationId,
      null,
      name,
      description,
      roleIds
    );

    if (isSucc(response) && response.data) {
      fetchApplicationMenus(applicationId);
      setFlashMessage({
        message: "Updated menu page successfully",
        type: "success",
      });
    } else {
      setFlashMessage({ message: response?.data?.message, type: "error" });
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell onClick={handleButtonClick}>{name}</TableCell>
        <TableCell onClick={handleButtonClick}>{description}</TableCell>
        <TableCell align="right" sx={{ display: "flex" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleButtonClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <IconButton
            onClick={handleRemove}
            size="small"
            aria-label="delete"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() =>
              handleClickEditOpen({ id: id.toString(), name, description })
            }
            size="small"
            aria-label="edit"
          >
            <EditIcon fontSize="small" />
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
              {roles &&
                roles.map(({ name, id, inKey }: any) => {
                  return (
                    <SwitchRightLabels
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
              <Button variant="contained" size="small" onClick={handleUpdate}>
                {t("Update")}
              </Button>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  applicationId: state.application.selectedId,
});

const mapDispatchToProps = {
  fetchApplicationMenus,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(RowMenuPagesList);
