import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Divider,
  Button,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralModal from "src/components/modal/CentralModal";
import { connect } from "react-redux";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { contentManagementService } from "flexlists-api";
import { ContentManagementDto } from "src/models/ContentManagementDto";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type ContentManagementFormProps = {
  open: boolean;
  handleClose: () => void;
  currentContentManagement: ContentManagementDto;
  onAdd: (newContentManagement: ContentManagementDto) => void;
  onUpdate: (editContentManagement: ContentManagementDto) => void;
};

const ContentManagementForm = ({
  open,
  handleClose,
  currentContentManagement,
  onAdd,
  onUpdate,
}: ContentManagementFormProps) => {
  const theme = useTheme();
  const isCreating = currentContentManagement.id === 0;
  const [contentManagement, setContentManagement] = useState<{
    id: number;
    name: string;
    type: string;
    slug: string;
    publishedDate: Date;
    ownerId: number;
  }>(currentContentManagement);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);

  useEffect(() => {
    setContentManagement(currentContentManagement);
  }, [currentContentManagement]);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newContentManagement = Object.assign({}, contentManagement);
    newContentManagement.name = event.target.value;
    setIsUpdate(true);
    setContentManagement(newContentManagement);
  };
  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var newContentManagement = Object.assign({}, contentManagement);
    newContentManagement.slug = event.target.value;
    setIsUpdate(true);
    setContentManagement(newContentManagement);
  };
  const handleTypeChange = (newValue: string) => {
    var newContentManagement = Object.assign({}, contentManagement);
    newContentManagement.type = newValue;
    setIsUpdate(true);
    setContentManagement(newContentManagement);
  };
  const handlePublishedDateChange = (newValue: Date) => {
    var newContentManagement = Object.assign({}, contentManagement);
    newContentManagement.publishedDate = newValue;
    setIsUpdate(true);
    setContentManagement(newContentManagement);
  };
  const contentManagementTypes = ["Blog", "Roadmap", "Tutorials"];
  const onSubmit = async () => {
    setSubmit(true);
    if (!contentManagement.name) {
      setError("Name required");
      return;
    }
    if (isCreating) {
      let response = await contentManagementService.createContentManagement(
        contentManagement.name.trim(),
        contentManagement.type.trim(),
        contentManagement.publishedDate,
        contentManagement.slug,
        currentContentManagement.ownerId
      );
      if (isSucc(response)) {
        contentManagement.id = (response.data as any).id;
        onAdd(contentManagement);
        handleClose();
      } else {
        setError((response as FlexlistsError).message);
      }
    } else {
      let response = await contentManagementService.updateContentManagement(
        contentManagement.id,
        contentManagement.name.trim(),
        contentManagement.type.trim(),
        contentManagement.publishedDate,
        contentManagement.slug,
        currentContentManagement.ownerId
      );
      if (isSucc(response)) {
        onUpdate(contentManagement);
        handleClose();
      } else {
        setError((response as FlexlistsError).message);
      }
    }
  };
  return (
    <CentralModal open={open} handleClose={handleClose} zIndex={1200}>
      {contentManagement && (
        <>
          <Typography variant="h6">{isCreating ? "Add" : "Edit"}</Typography>
          <Divider sx={{ my: 2 }}></Divider>
          <Box>{error && <Alert severity="error">{error}</Alert>}</Box>
          <Box>
            <Typography variant="subtitle2">Name</Typography>
            <TextField
              fullWidth
              onChange={handleNameChange}
              value={contentManagement?.name}
              placeholder="Name"
              required
              error={submit && !contentManagement?.name}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2">Slug</Typography>
            <TextField
              fullWidth
              onChange={handleSlugChange}
              value={contentManagement?.slug}
              placeholder="Slug for this page"
              required
              error={submit && !contentManagement?.slug}
            />
          </Box>
          Category:
          <Select
            label="Type"
            value={
              contentManagement?.type && contentManagement?.type.length > 0
                ? contentManagement?.type
                : "Tutorials"
            }
            onChange={(e) => handleTypeChange(e.target.value)}
            size="small"
            error={submit && !contentManagement?.type}
          >
            {contentManagementTypes.map((value: string) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
          <br />
          Pulished date:
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={dayjs(contentManagement.publishedDate)}
              onChange={(e: any) => {
                handlePublishedDateChange(e.toDate());
              }}
              sx={{
                width: { md: "168px" },
                marginLeft: { xs: "8px", md: "30px" },
              }}
            />
          </LocalizationProvider>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {/* DISABLED BUTTON UNTIL CHANGE IS MADE */}
            <Button
              disabled={!isUpdate}
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => onSubmit()}
            >
              {isCreating ? "Add" : "Edit"}
            </Button>
            <Button
              onClick={handleClose}
              sx={{ mt: 2, ml: 2, color: "#666" }}
              variant="text"
            >
              Cancel
            </Button>
          </Box>
        </>
      )}
    </CentralModal>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentManagementForm);
