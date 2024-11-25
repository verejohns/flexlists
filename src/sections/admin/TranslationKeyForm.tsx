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
  SelectChangeEvent,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralModal from "src/components/modal/CentralModal";
import { connect } from "react-redux";
import { FlexlistsError, isSucc } from "src/models/ApiResponse";
import { contentManagementService } from "flexlists-api";
import { TranslationKeyDto } from "src/models/TranslationKeyDto";
import { translationKeyService } from "flexlists-api";
import { TranslationKeyType } from "src/enums/SharedEnums";
import { useRouter } from "next/router";
import { use } from "passport";
import { all } from "axios";
import { UserProfile } from "src/models/UserProfile";

type TranslationKeyFormProps = {
  open: boolean;
  handleClose: () => void;
  currentTranslationKey: TranslationKeyDto;
  onAdd: (newTranslationKey: TranslationKeyDto) => void;
  onUpdate: (editTranslationKey: TranslationKeyDto) => void;
  userProfile: UserProfile;
  contentTranslationKeys: TranslationKeyDto[];
};

const TranslationKeyForm = ({
  open,
  handleClose,
  currentTranslationKey,
  onAdd,
  onUpdate,
  userProfile,
  contentTranslationKeys,
}: TranslationKeyFormProps) => {
  const theme = useTheme();
  const router = useRouter();
  const isCreating = currentTranslationKey.id === 0;
  const [translationKey, setTranslationKey] = useState<TranslationKeyDto>(
    currentTranslationKey
  );
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [allTranslationKeys, setAllTranslationKeys] = useState<
    TranslationKeyDto[]
  >([]);
  const [remainTranslationKeys, setRemainTranslationKeys] = useState<
    TranslationKeyDto[]
  >([]);
  const translationKeyTypes = Object.keys(TranslationKeyType).filter((item) => {
    return isNaN(Number(item));
  });
  useEffect(() => {
    const fetchAllTranslationKeys = async () => {
      let response = await translationKeyService.getAllTranslationKey();

      if (isSucc(response)) {
        console.log(response.data);
        setAllTranslationKeys(response.data as TranslationKeyDto[]);
        setRemainTranslationKeys(
          (response.data as TranslationKeyDto[]).filter(
            (item) => !contentTranslationKeys.find((c) => c.name === item.name)
          )
        );
      }
    };
    fetchAllTranslationKeys();
  }, [router.isReady]);
  useEffect(() => {
    if (allTranslationKeys.length > 0) {
      setRemainTranslationKeys(
        (allTranslationKeys as TranslationKeyDto[]).filter(
          (item) => !contentTranslationKeys.find((c) => c.name === item.name)
        )
      );
    }
  }, [contentTranslationKeys]);

  useEffect(() => {
    setTranslationKey(currentTranslationKey);
  }, [currentTranslationKey]);

  const handleNameChange = (newName: string) => {
    var newTranslationKey = Object.assign({}, translationKey);
    newTranslationKey.name = newName;
    var existingTranslationKey = allTranslationKeys.find(
      (item) => item.name === newName && item.reusable
    );
    if (existingTranslationKey) {
      newTranslationKey.id = existingTranslationKey.id;
      newTranslationKey.type = existingTranslationKey.type;
    }
    setIsUpdate(true);
    setTranslationKey(newTranslationKey);
  };

  const onSubmit = async () => {
    setSubmit(true);
    if (!translationKey.name) {
      setError("Name required");
      return;
    }
    if (isCreating) {
      let response =
        await contentManagementService.addTranslationKeyToContentManagement(
          translationKey.name,
          translationKey.type,
          translationKey.contentManagementId,
          translationKey.reusable,
          translationKey.config
        );
      if (isSucc(response)) {
        translationKey.id = (response.data as any).id;
        onAdd(translationKey);
        handleClose();
      } else {
        setError((response as FlexlistsError).message);
      }
    } else {
      let response = await translationKeyService.updateTranslationKey(
        translationKey.id,
        translationKey.name,
        translationKey.type,
        userProfile ? userProfile.id : 0,
        translationKey.reusable,
        translationKey.config
      );
      if (isSucc(response)) {
        onUpdate(translationKey);
        handleClose();
      } else {
        setError((response as FlexlistsError).message);
      }
    }
  };
  const onTypeChange = (event: SelectChangeEvent) => {
    var newTranslationKey = Object.assign({}, translationKey);
    newTranslationKey.type = event.target.value as TranslationKeyType;
    setIsUpdate(true);
    setTranslationKey(newTranslationKey);
  };
  return (
    <CentralModal open={open} handleClose={handleClose} zIndex={1200}>
      {translationKey && (
        <>
          <Typography variant="h6">{isCreating ? "Add" : "Edit"}</Typography>
          <Divider sx={{ my: 2 }}></Divider>
          <Box>{error && <Alert severity="error">{error}</Alert>}</Box>
          <Box>
            <Typography variant="subtitle2">Name</Typography>
            <Autocomplete
              freeSolo
              id="free-solo-2-name"
              fullWidth
              disableClearable
              inputValue={translationKey?.name}
              onInputChange={(event, newInputValue) => {
                handleNameChange(newInputValue);
              }}
              options={remainTranslationKeys.map((option) => option.name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                  required
                  error={submit && !translationKey?.name}
                />
              )}
            />
            {/* // <TextField
              //   fullWidth
              //   onChange={handleNameChange}
              //   value={translationKey?.name}
              //   placeholder="Name"
              //   required
              //   error = {submit && !translationKey?.name}
              // /> */}
          </Box>
          <Box>
            <Typography variant="subtitle2">Type</Typography>
            <Select
              id="select-translation-key-type"
              value={translationKey.type}
              onChange={(e) => {
                onTypeChange(e);
              }}
              fullWidth
              sx={{
                fontSize: 14,
                "&::before": { borderBottom: "none" },
                "&:focused": { backgroundColor: "transparent !important" },
              }}
            >
              {translationKeyTypes &&
                translationKeyTypes.map((translationKeyType, index) => {
                  return (
                    <MenuItem key={index} value={translationKeyType}>
                      {translationKeyType}
                    </MenuItem>
                  );
                })}
            </Select>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={translationKey.reusable}
                  onChange={(e) => {
                    var newTranslationKey = Object.assign({}, translationKey);
                    newTranslationKey.reusable = e.target.checked;
                    setIsUpdate(true);
                    setTranslationKey(newTranslationKey);
                  }}
                  name="required"
                />
              }
              label="Re-usable"
            />
          </Box>
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

const mapStateToProps = (state: any) => ({
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TranslationKeyForm);
