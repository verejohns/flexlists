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
import { MapConfig } from "src/models/ViewConfig";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type MapViewConfigProps = {
  translations: TranslationText[];
  submit: boolean;
  columns: ViewField[];
  availableFieldUiTypes: FieldUIType[];
  config?: MapConfig;
  updateConfig: (config: MapConfig) => void;
};

function MapViewConfig({
  translations,
  submit,
  columns,
  availableFieldUiTypes,
  config,
  updateConfig,
}: MapViewConfigProps) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  const [titleFieldId, setTitleFieldId] = useState<number>(config && config.titleId ? config.titleId : 0);
  const [latFieldId, setLatFieldId] = useState<number>(config && config.latId ? config.latId : 0);
  const [lngFieldId, setLngFieldId] = useState<number>(config && config.lngId ? config.lngId : 0);
  const [colorId, setColorId] = useState<number>(config && config.colorId ? config.colorId : -2);

  const [isOpenTitleFieldModal, setIsOpenTitleFieldModal] = useState<boolean>(false);
  const [isOpenLatFieldModal, setIsOpenLatFieldModal] = useState<boolean>(false);
  const [isOpenLngFieldModal, setIsOpenLngFieldModal] = useState<boolean>(false);
  const [isOpenColorModal, setIsOpenColorModal] = useState<boolean>(false);

  const titleFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Text
  );
  const latFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Double
  );
  const lngFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Double
  );
  const colorUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Color
  );

  const getTitleFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Text);
  };  
  const getDoubleFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Double);
  };
  const getColorFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Color);
  };

  const [titleFields, setTitleFields] = useState<ViewField[]>(getTitleFields());
  const [latFields, setLatFields] = useState<ViewField[]>(getDoubleFields());
  const [lngFields, setLngFields] = useState<ViewField[]>(getDoubleFields());
  const [colorFields, setColorFields] = useState<ViewField[]>(getColorFields());

  const newTitleField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Text,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
  };
  const newLatField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Double,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
  };
  const newLngField : any  = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Double,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: ""
  };
  const newColorField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Color,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
  };

  const reloadColumns = () => {
    const newTitleFields: ViewField[] = getTitleFields();
    const newDoubleFields: ViewField[] = getDoubleFields();
    const newColorFields: ViewField[] = getColorFields();
    const defaultTitleId =
      titleFieldId && !isOpenTitleFieldModal
        ? titleFieldId
        : newTitleFields.length > 0
        ? newTitleFields[0].id
        : 0;
    const defaultLatFieldId =
      latFieldId && !isOpenLatFieldModal
        ? latFieldId
        : newDoubleFields.length > 0
        ? newDoubleFields[0].id
        : 0;
    const defaultLngFieldId =
      lngFieldId && !isOpenLngFieldModal
        ? lngFieldId
        : newDoubleFields.length > 0
        ? newDoubleFields[0].id
        : 0;
    const defaultColorId =
      colorId && !isOpenColorModal
        ? colorId
        : newColorFields.length > 0
        ? newColorFields[0].id
        : 0;

    if (newTitleFields.length > 0) {
      setTitleFieldId(defaultTitleId);
    }
    if (newDoubleFields.length > 0) {
      setLatFieldId(defaultLatFieldId);
    }
    if (newDoubleFields.length > 1) {
      setLngFieldId(defaultLngFieldId);
    }
    if (newColorFields.length > 0) {
      setColorId(defaultColorId);
    }

    setTitleFields(newTitleFields);
    setLatFields(newDoubleFields);
    setLngFields(newDoubleFields.length > 1 ? newDoubleFields.filter((doubleField) => doubleField.id !== defaultLatFieldId) : []);
    setColorFields(newColorFields);
    
    updateMapConfig(
      defaultTitleId,
      defaultLatFieldId,
      defaultLngFieldId,
      defaultColorId
    );
  };

  useEffect(() => {
    reloadColumns();
  }, [columns]);

  const onTitleFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenTitleFieldModal(true);
      return;
    }

    setTitleFieldId(convertToInteger(value));
    updateMapConfig(
      convertToInteger(value),
      latFieldId,
      lngFieldId,
      colorId
    );
  };

  const onLatFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    const newLngFields = getDoubleFields().filter(
      (doubleField: ViewField) => doubleField.id !== convertToInteger(value)
    );

    if (value === "-1") {
      setIsOpenLatFieldModal(true);
      return;
    }

    setLatFieldId(convertToInteger(value));
    setLngFields(newLngFields);

    if (convertToInteger(value) === lngFieldId) {
      setLngFieldId(
        newLngFields.length ? newLngFields[0].id : 0
      );
    }

    updateMapConfig(
      titleFieldId,
      convertToInteger(value),
      lngFieldId,
      colorId
    );
  };

  const onLngFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenLngFieldModal(true);
      return;
    }

    setLngFieldId(convertToInteger(value));
    updateMapConfig(
      titleFieldId,
      latFieldId,
      convertToInteger(value),
      colorId
    );
  };

  const onColorChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenColorModal(true);
      return;
    }

    setColorId(convertToInteger(value));
    
    updateMapConfig(
      titleFieldId,
      latFieldId,
      lngFieldId,
      convertToInteger(value)
    );
  };

  const updateMapConfig = (
    newTitleId: number,
    newLatFieldId: number,
    newLngFieldId: number,
    newColorId: number
  ) => {
    updateConfig({
      titleId: newTitleId,
      latId: newLatFieldId,
      lngId: newLngFieldId,
      colorId: newColorId === -2 ? 0 : newColorId
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <FormControl fullWidth>
        <InputLabel required id="map_title_label" shrink>
          {t("Title")}
        </InputLabel>
        <Select
          labelId="map_title_label"
          label={t("Title")}
          value={`${titleFieldId ? titleFieldId : ''}`}
          required
          error={submit && (!titleFieldId || titleFieldId === 0)}
          onChange={onTitleFieldChange}
          fullWidth
          notched
        >
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
      <FormControl fullWidth>
        <InputLabel required id="map_lat_label" shrink>
          {t("Latitude")}
        </InputLabel>
        <Select
          label={t("Latitude")}
          labelId="map_lat_label"
          value={`${latFieldId ? latFieldId : ''}`}
          onChange={onLatFieldChange}
          required
          error={submit && (!latFieldId || latFieldId === 0)}
          fullWidth
          notched
        >
          {latFields.map((viewColumn: ViewField) => (
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
        <InputLabel required id="map_lng_label" shrink>
          {t("Longitude")}
        </InputLabel>
        <Select
          label={t("Longitude")}
          labelId="map_lng_label"
          value={`${lngFieldId ? lngFieldId : ''}`}
          onChange={onLngFieldChange}
          fullWidth
          notched
          required
          error={submit && (!lngFieldId || lngFieldId === 0)}
        >
          {lngFields.map((titleColumn: ViewField) => (
            <MenuItem key={`${titleColumn.id}`} value={`${titleColumn.id}`}>
              {titleColumn.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="map_color_label" shrink>
          {t("Color")}
        </InputLabel>
        <Select
          labelId="map_color_label"
          label={t("Color")}
          value={`${colorId ? colorId : ''}`}
          onChange={onColorChange}
          fullWidth
          notched
        >
          <MenuItem key={"-2"} value={"-2"}>
            {t("Leave Empty")}
          </MenuItem>
          {colorFields.map((colorField: ViewField) => (
            <MenuItem key={`${colorField.id}`} value={`${colorField.id}`}>
              {colorField.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      {isOpenTitleFieldModal && (
        <CreateFieldModal
          translations={translations}
          field={newTitleField}
          fieldUiTypes={titleFieldUiTypes}
          open={isOpenTitleFieldModal}
          handleClose={() => setIsOpenTitleFieldModal(false)}
        />
      )}
      {isOpenLatFieldModal && (
        <CreateFieldModal
          translations={translations}
          field={newLatField}
          fieldUiTypes={latFieldUiTypes}
          open={isOpenLatFieldModal}
          handleClose={() => setIsOpenLatFieldModal(false)}
        />
      )}
      {isOpenLngFieldModal && (
        <CreateFieldModal
          translations={translations}
          field={newLngField}
          fieldUiTypes={lngFieldUiTypes}
          open={isOpenLngFieldModal}
          handleClose={() => setIsOpenLngFieldModal(false)}
        />
      )}
      {isOpenColorModal && (
        <CreateFieldModal
          translations={translations}
          field={newColorField}
          fieldUiTypes={colorUiTypes}
          open={isOpenColorModal}
          handleClose={() => setIsOpenColorModal(false)}
        />
      )}
    </Box>
  );
}

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MapViewConfig);
