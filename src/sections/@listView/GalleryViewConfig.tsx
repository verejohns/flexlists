import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { connect } from "react-redux";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import { ViewField } from "src/models/ViewField";
import { convertToInteger } from "src/utils/convertUtils";
import { FieldUIType } from "src/models/SharedModels";
import CreateFieldModal from "./CreateFieldModal";
import { GalleryConfig } from "src/models/ViewConfig";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type GalleryViewConfigProps = {
  translations: TranslationText[];
  submit: boolean;
  columns: ViewField[];
  availableFieldUiTypes: FieldUIType[];
  config?: GalleryConfig;
  updateConfig: (config: GalleryConfig) => void;
};

function GalleryViewConfig({
  translations,
  submit,
  columns,
  availableFieldUiTypes,
  config,
  updateConfig,
}: GalleryViewConfigProps) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [imageFieldId, setImageFieldId] = useState<number>(config && config.imageId? config.imageId: 0);
  const [titleFieldId, setTitleFieldId] = useState<number>(config && config.titleId? config.titleId: -2);
  const [isOpenImageFieldModal, setIsOpenImageFieldModal] = useState<boolean>(false);
  const [isOpenTitleFieldModal, setIsOpenTitleFieldModal] = useState<boolean>(false);
  const imageFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Image
  );
  const titleFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Text
  );

  const getImageFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Image);
  };

  const getTitleFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Text);
  };

  const [imageFields, setImageFields] = useState<ViewField[]>(getImageFields());
  const [titleFields, setTitleFields] = useState<ViewField[]>(getTitleFields());

  const newImageField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Image,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
  };
  const newTitleField : any  = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Text,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: ""
  };

  const reloadColumns = () => {
    const newImageFields: ViewField[] = getImageFields();
    const newTitleFields: ViewField[] = getTitleFields();
    const defaultImageFieldId =
      imageFieldId && !isOpenImageFieldModal
        ? imageFieldId
        : newImageFields.length > 0
        ? newImageFields[0].id
        : 0;
    const defaultTitleFieldId =
      titleFieldId && !isOpenTitleFieldModal
        ? titleFieldId
        : 0;

    if (newImageFields.length > 0) {
      setImageFieldId(defaultImageFieldId);
    }

    if (newTitleFields.length > 0) {
      setTitleFieldId(defaultTitleFieldId);
    }

    setImageFields(newImageFields);
    setTitleFields(newTitleFields);
    
    updateGalleryConfig(
      defaultImageFieldId,
      defaultTitleFieldId
    );
  };

  useEffect(() => {
    reloadColumns();
  }, [columns]);

  const onImageFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenImageFieldModal(true);
      return;
    }

    setImageFieldId(convertToInteger(value));
    updateGalleryConfig(
      convertToInteger(value),
      titleFieldId
    );
  };

  const onTitleFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenTitleFieldModal(true);
      return;
    }

    setTitleFieldId(convertToInteger(value));
    updateGalleryConfig(
      imageFieldId,
      convertToInteger(value)
    );
  };

  const updateGalleryConfig = (
    newImageFieldId: number,
    newTitleFieldId: number
  ) => {
    updateConfig({
      imageId: newImageFieldId,
      titleId: newTitleFieldId === -2 ? 0 : newTitleFieldId
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <FormControl fullWidth>
        <InputLabel required id="select-image-label" shrink>
          {t("Image")}
        </InputLabel>
        <Select
          label={t("Image")}
          labelId="select-image-label"
          value={`${imageFieldId ? imageFieldId : ''}`}
          onChange={onImageFieldChange}
          required
          error={submit && (!imageFieldId || imageFieldId === 0)}
          fullWidth
          notched
        >
          {imageFields.map((viewColumn: ViewField) => (
            <MenuItem key={`${viewColumn.id}`} value={`${viewColumn.id}`}>
              {viewColumn.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="select-title-label" shrink>
          {t("Title")}
        </InputLabel>
        <Select
          label={t("Title")}
          labelId="select-title-label"
          value={`${titleFieldId ? titleFieldId : ''}`}
          onChange={onTitleFieldChange}
          fullWidth
          notched
        >
          <MenuItem key={"-2"} value={"-2"}>
            {t("Leave Empty")}
          </MenuItem>
          {titleFields.map((titleColumn: ViewField) => (
            <MenuItem key={`${titleColumn.id}`} value={`${titleColumn.id}`}>
              {titleColumn.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      {isOpenImageFieldModal && (
        <CreateFieldModal
          translations={translations}
          field={newImageField}
          fieldUiTypes={imageFieldUiTypes}
          open={isOpenImageFieldModal}
          handleClose={() => setIsOpenImageFieldModal(false)}
        />
      )}
      {isOpenTitleFieldModal && (
        <CreateFieldModal
          translations={translations}
          field={newTitleField}
          fieldUiTypes={titleFieldUiTypes}
          open={isOpenTitleFieldModal}
          handleClose={() => setIsOpenTitleFieldModal(false)}
        />
      )}
    </Box>
  );
}

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryViewConfig);
