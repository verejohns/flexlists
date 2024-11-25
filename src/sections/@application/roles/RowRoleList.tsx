import { useState } from "react";
import {
  Button,
  Collapse,
  IconButton,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SwitchRoleLabels from "./SwitchRoleLabels";
import { IRights } from "./AddRoleDialog";
import { applicationService } from "flexlists-api";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { isSucc } from "src/models/ApiResponse";
import { setFlashMessage } from "src/redux/actions/authAction";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { connect } from "react-redux";
import { fetchApplicationRoles } from "src/redux/actions/applicationActions";

type RowRolesListProps = {
  translations: TranslationText[];
  role: any;
  roles: any[];
  fetchApplicationRoles: (applicationId: number) => void;
  setFlashMessage: (message: FlashMessageModel) => void;
};

const frameBox: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "40vh",
  paddingRight: "13px",
  paddingTop: "10px",
  paddingBottom: "10px",
};

const RowRoleList = ({
  translations,
  role,
  roles,
  fetchApplicationRoles,
  setFlashMessage,
}: RowRolesListProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [open, setOpen] = useState(false);
  const [rights, setRights] = useState<IRights>({});
  const isAllowedRemove =
    role.name === "Admin" || role.name === "User" || role.name === "Anonymous";

  const handleRemove = async () => {
    const response = await applicationService.removeApplicationRole(
      role.applicationId,
      role.id
    );

    if (isSucc(response) && response.data) {
      fetchApplicationRoles(role.applicationId);
      setFlashMessage({
        message: "Removed role successfully",
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
    const response = await applicationService.updateApplicationRole(
      role.applicationId,
      role.name,
      role.id,
      rights
    );

    if (isSucc(response) && response.data) {
      fetchApplicationRoles(role.applicationId);
      setFlashMessage({
        message: "Updated role successfully",
        type: "success",
      });
    } else {
      setFlashMessage({ message: response?.data?.message, type: "error" });
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell onClick={handleButtonClick}>{role.name}</TableCell>
        <TableCell onClick={handleButtonClick}>{role.description}</TableCell>
        <TableCell align="right">
          <Stack
            direction="row"
            spacing={0}
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            {!isAllowedRemove && (
              <IconButton
                onClick={handleRemove}
                size="small"
                aria-label="delete"
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleButtonClick}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Stack>
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
              {roles.map((item: any) => {
                if (
                  item.id === role.id &&
                  item.applicationRoleTableView &&
                  item.applicationRoleTableView.length > 0
                ) {
                  return item.applicationRoleTableView.map(
                    ({ rights, tableViewId, id }: any) => (
                      <SwitchRoleLabels
                        key={`${tableViewId}-${id}`}
                        id={tableViewId}
                        rights={rights}
                        setRights={setRights}
                        translations={translations}
                      />
                    )
                  );
                }
                return null;
              })}
            </div>
            <div style={{ padding: "15px 0" }}>
              <Button variant="contained" size="small" onClick={handleUpdate}>
                {t("Update Role")}
              </Button>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  roles: state.application.roles,
});

const mapDispatchToProps = {
  fetchApplicationRoles,
  setFlashMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(RowRoleList);
