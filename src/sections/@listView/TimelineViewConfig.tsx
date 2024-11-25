import { useEffect, useState } from "react";
import { Box, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from "@mui/material";
import { connect } from "react-redux";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import { ViewField } from "src/models/ViewField";
import { convertToInteger } from "src/utils/convertUtils";
import { FieldUIType } from "src/models/SharedModels";
import CreateFieldModal from "./CreateFieldModal";
import { TimelineConfig } from "src/models/ViewConfig";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type TimelineViewConfigProps = {
  translations: TranslationText[];
  submit : boolean,
  columns:ViewField[];
  availableFieldUiTypes: FieldUIType[];
  config?: TimelineConfig;
  updateConfig :(config : TimelineConfig) => void;
}

function TimelineViewConfig({ translations, submit, columns, availableFieldUiTypes, config, updateConfig }: TimelineViewConfigProps)
{
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [titleFieldId, setTitleFieldId] = useState<number>(config && config.titleId ? config.titleId : 0);
  const [colorFieldId, setColorFieldId] = useState<number>(config && config.colorId ? config.colorId : 0);
  const [levelFieldId, setLevelFieldId] = useState<number>(config && config.levelId ? config.levelId : 0);
  const [fromFieldId, setFromFieldId] = useState<number>(config && config.fromId ? config.fromId : 0);
  const [toFieldId, setToFieldId] = useState<number>(config && config.toId ? config.toId : 0);
  const [isOpenTitleFieldModal, setIsOpenTitleFieldModal] = useState<boolean>(false);
  const [isOpenColorFieldModal, setIsOpenColorFieldModal] = useState<boolean>(false);
  const [isOpenLevelFieldModal, setIsOpenLevelFieldModal] = useState<boolean>(false);
  const [isOpenFromFieldModal, setIsOpenFromFieldModal] = useState<boolean>(false);
  const [isOpenToFieldModal, setIsOpenToFieldModal] = useState<boolean>(false);
  const titleFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Text);
  const colorFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Color);
  const levelFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Integer);
  const dateFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Date);

  const getTitleFields = () :ViewField[]=>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Text);
  };

  const getColorFields = () :ViewField[] =>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Color);
  };

  const getLevelFields = () :ViewField[]=>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Integer);
  };

  const getDateFields = () :ViewField[]=>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Date);
  };

  const [titleFields, setTitleFields] = useState<ViewField[]>(getTitleFields());
  const [colorFields, setColorFields] = useState<ViewField[]>(getColorFields());
  const [levelFields, setLevelFields] = useState<ViewField[]>(getLevelFields());
  const [fromFields, setFromFields] = useState<ViewField[]>(getDateFields());
  const [toFields, setToFields] = useState<ViewField[]>(getDateFields());

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
  const newColorField : any  = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Color,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: ""
  };
  const newLevelField : any  = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Integer,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: ""
  };
  const newFromField : any  = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Date,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: ""
  };
  const newToField : any  = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Date,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: ""
  };

  const reloadColumns = () =>
  {
    const newTitleFields : ViewField[] = getTitleFields();
    const newColorFields : ViewField[] = getColorFields();
    const newLevelFields : ViewField[] = getLevelFields();
    const newDateFields : ViewField[] = getDateFields();

    const defaultTitleId =
      titleFieldId && !isOpenTitleFieldModal
        ? titleFieldId
        : newTitleFields.length > 0
        ? newTitleFields[0].id
        : 0;
    const defaultColorId =
      colorFieldId && !isOpenColorFieldModal
        ? colorFieldId
        : newColorFields.length > 0
        ? newColorFields[0].id
        : 0;
    const defaultLevelId =
      levelFieldId && !isOpenLevelFieldModal
        ? levelFieldId
        : newLevelFields.length > 0
        ? newLevelFields[0].id
        : 0;
    const defaultFromId =
      fromFieldId && !isOpenFromFieldModal
        ? fromFieldId
        : newDateFields.length > 0
        ? newDateFields[0].id
        : 0;
    const defaultToId =
      toFieldId && !isOpenToFieldModal
        ? toFieldId
        : newDateFields.length > 1
        ? newDateFields.filter((dateField) => dateField.id !== defaultFromId)[0].id
        : 0;

    if(newTitleFields.length > 0)
    {
      setTitleFieldId(defaultTitleId);
    }

    if(newColorFields.length > 0)
    {
      setColorFieldId(defaultColorId);
    }

    if(newLevelFields.length > 0)
    {
      setLevelFieldId(defaultLevelId);
    }

    if(newDateFields.length > 0)
    {
      setFromFieldId(defaultFromId);
    }

    if(newDateFields.length > 1)
    {
      setToFieldId(defaultToId);
    }

    setTitleFields(newTitleFields);
    setColorFields(newColorFields);
    setLevelFields(newLevelFields);
    setFromFields(newDateFields);
    setToFields(newDateFields.length > 1 ? newDateFields.filter((dateField) => dateField.id !== defaultFromId) : []);
    updateTimelineConfig(defaultTitleId, defaultColorId, defaultLevelId, defaultFromId, defaultToId);
  }

  useEffect(()=>{
    reloadColumns();
  }, [columns]);

  const onTitleFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenTitleFieldModal(true);
      return;
    }

    setTitleFieldId(convertToInteger(value));
    updateTimelineConfig(convertToInteger(value), colorFieldId, levelFieldId, fromFieldId, toFieldId);
  };
  
  const onColorFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenColorFieldModal(true);
      return;
    }

    setColorFieldId(convertToInteger(value));
    updateTimelineConfig(titleFieldId, convertToInteger(value), levelFieldId, fromFieldId, toFieldId);
  };

  const onLevelFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenLevelFieldModal(true);
      return;
    }

    setLevelFieldId(convertToInteger(value));
    updateTimelineConfig(titleFieldId, colorFieldId, convertToInteger(value), fromFieldId, toFieldId);
  };

  const onFromFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    const newToDateFields = getDateFields().filter(
      (dateField: ViewField) => dateField.id !== convertToInteger(value)
    );

    if(value === "-1")
    {
      setIsOpenFromFieldModal(true);
      return;
    }

    setFromFieldId(convertToInteger(value));
    setToFields(newToDateFields);

    if (convertToInteger(value) === toFieldId) {
      setToFieldId(
        newToDateFields.length ? newToDateFields[0].id : 0
      );
    }

    updateTimelineConfig(titleFieldId, colorFieldId, levelFieldId, convertToInteger(value), toFieldId);
  };

  const onToFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenToFieldModal(true);
      return;
    }

    setToFieldId(convertToInteger(value));
    updateTimelineConfig(titleFieldId, colorFieldId, levelFieldId, fromFieldId, convertToInteger(value));
  };

  const updateTimelineConfig = (newTitleFieldId: number, newColorId: number, newLevelId: number, newFromId: number, newToId: number) =>
  {
    updateConfig({titleId: newTitleFieldId, colorId: newColorId, levelId: newLevelId, fromId: newFromId, toId: newToId});
  };
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <FormControl fullWidth>
        <InputLabel required id="timeline_title_label" shrink>
          {t("Title")}
        </InputLabel>
        <Select
          labelId="timeline_title_label"
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
        <InputLabel required id="timeline_color_label" shrink>
          {t("Color")}
        </InputLabel>
        <Select
          labelId="timeline_color_label"
          label={t("Color")}
          value={`${colorFieldId ? colorFieldId : ''}`}
          required
          error={submit && (!colorFieldId || colorFieldId === 0)}
          onChange={onColorFieldChange}
          fullWidth
          notched
        >
          {colorFields.map((colorColumn: ViewField) => (
            <MenuItem key={`${colorColumn.id}`} value={`${colorColumn.id}`}>
              {colorColumn.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel required id="timeline_level_label" shrink>
          {t("Level")}
        </InputLabel>
        <Select
          labelId="timeline_level_label"
          label={t("Level")}
          value={`${levelFieldId ? levelFieldId : ''}`}
          required
          error={submit && (!levelFieldId || levelFieldId === 0)}
          onChange={onLevelFieldChange}
          fullWidth
          notched
        >
          {levelFields.map((levelColumn: ViewField) => (
            <MenuItem key={`${levelColumn.id}`} value={`${levelColumn.id}`}>
              {levelColumn.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel required id="timeline_from_label" shrink>
          {t("From")}
        </InputLabel>
        <Select
          labelId="timeline_from_label"
          label={t("From")}
          value={`${fromFieldId ? fromFieldId : ''}`}
          required
          error={submit && (!fromFieldId || fromFieldId === 0)}
          onChange={onFromFieldChange}
          fullWidth
          notched
        >
          {fromFields.map((fromColumn: ViewField) => (
            <MenuItem key={`${fromColumn.id}`} value={`${fromColumn.id}`}>
              {fromColumn.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel required id="timeline_to_label" shrink>
          {t("To")}
        </InputLabel>
        <Select
          labelId="timeline_to_label"
          label={t("To")}
          value={`${toFieldId ? toFieldId : ''}`}
          required
          error={submit && (!toFieldId || toFieldId === 0)}
          onChange={onToFieldChange}
          fullWidth
          notched
        >
          {toFields.map((toColumn: ViewField) => (
            <MenuItem key={`${toColumn.id}`} value={`${toColumn.id}`}>
              {toColumn.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      {isOpenTitleFieldModal && 
        <CreateFieldModal
          translations={translations}
          field={newTitleField}
          fieldUiTypes={titleFieldUiTypes}
          open = {isOpenTitleFieldModal}
          handleClose={()=>setIsOpenTitleFieldModal(false)}
        />
      }
      {isOpenColorFieldModal && 
        <CreateFieldModal
          translations={translations}
          field={newColorField}
          fieldUiTypes={colorFieldUiTypes}
          open = {isOpenColorFieldModal}
          handleClose={()=>setIsOpenColorFieldModal(false)}
        />
      }
      {isOpenLevelFieldModal && 
        <CreateFieldModal
          translations={translations}
          field={newLevelField}
          fieldUiTypes={levelFieldUiTypes}
          open = {isOpenLevelFieldModal}
          handleClose={()=>setIsOpenLevelFieldModal(false)}
        />
      }
      {isOpenFromFieldModal && 
        <CreateFieldModal
          translations={translations}
          field={newFromField}
          fieldUiTypes={dateFieldUiTypes}
          open = {isOpenFromFieldModal}
          handleClose={()=>setIsOpenFromFieldModal(false)}
        />
      }
      {isOpenToFieldModal && 
        <CreateFieldModal
          translations={translations}
          field={newToField}
          fieldUiTypes={dateFieldUiTypes}
          open = {isOpenToFieldModal}
          handleClose={()=>setIsOpenToFieldModal(false)}
        />
      }
    </Box>
  )
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns
});
  
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelineViewConfig);