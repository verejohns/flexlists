import { useEffect, useState } from "react";
import { Box, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from "@mui/material";
import { connect } from "react-redux";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import { ViewField } from "src/models/ViewField";
import { convertToInteger } from "src/utils/convertUtils";
import { FieldUIType } from "src/models/SharedModels";
import CreateFieldModal from "./CreateFieldModal";
import { GanttConfig } from "src/models/ViewConfig";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type GanttViewConfigProps = {
  translations: TranslationText[];
  submit : boolean;
  columns:ViewField[];
  availableFieldUiTypes: FieldUIType[];
  config?: GanttConfig;
  updateConfig :(config : GanttConfig) => void;
}

const GanttViewConfig = ({
  translations,
  submit,
  columns,
  availableFieldUiTypes,
  config,
  updateConfig
}: GanttViewConfigProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [titleFieldId, setTitleFieldId] = useState<number>(config && config.titleId ? config.titleId : 0);
  const [colorFieldId, setColorFieldId] = useState<number>(config && config.colorId ? config.colorId : 0);
  const [progressFieldId, setProgressFieldId] = useState<number>(config && config.progressId ? config.progressId : 0);
  const [fromFieldId, setFromFieldId] = useState<number>(config && config.fromId ? config.fromId : 0);
  const [toFieldId, setToFieldId] = useState<number>(config && config.toId ? config.toId : 0);
  const [dependencyFieldId, setDependencyFieldId] = useState<number>(config && config.dependencyId ? config.dependencyId : -2);
  const [isOpenTitleFieldModal, setIsOpenTitleFieldModal] = useState<boolean>(false);
  const [isOpenColorFieldModal, setIsOpenColorFieldModal] = useState<boolean>(false);
  const [isOpenProgressFieldModal, setIsOpenProgressFieldModal] = useState<boolean>(false);
  const [isOpenFromFieldModal, setIsOpenFromFieldModal] = useState<boolean>(false);
  const [isOpenToFieldModal, setIsOpenToFieldModal] = useState<boolean>(false);
  const [isOpenDependencyFieldModal, setIsOpenDependencyFieldModal] = useState<boolean>(false);
  const titleFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Text);
  const colorFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Color);
  const progressFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Integer || uiType.name === FieldUiTypeEnum.Decimal);
  const dateFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Date || uiType.name === FieldUiTypeEnum.DateTime);
  const dependencyFieldUiTypes : FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Sublist);

  const getTitleFields = () :ViewField[]=>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Text);
  };

  const getColorFields = () :ViewField[] =>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Color);
  };

  const getProgressFields = () :ViewField[]=>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Integer || x.uiField === FieldUiTypeEnum.Decimal);
  };

  const getDateFields = () :ViewField[]=>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Date || x.uiField === FieldUiTypeEnum.DateTime);
  };

  const getDependencyFields = () :ViewField[]=>
  {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Sublist);
  };

  const [titleFields, setTitleFields] = useState<ViewField[]>(getTitleFields());
  const [colorFields, setColorFields] = useState<ViewField[]>(getColorFields());
  const [progressFields, setProgressFields] = useState<ViewField[]>(getProgressFields());
  const [fromFields, setFromFields] = useState<ViewField[]>(getDateFields());
  const [toFields, setToFields] = useState<ViewField[]>(getDateFields());
  const [dependencyFields, setDependencyFields] = useState<ViewField[]>(getDependencyFields());

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
  const newProgressField : any  = {
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
  const newDependencyField : any  = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Sublist,
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
    const newProgressFields : ViewField[] = getProgressFields();
    const newDateFields : ViewField[] = getDateFields();
    const newDependencyFields : ViewField[] = getDependencyFields();

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
    const defaultProgressId =
      progressFieldId && !isOpenProgressFieldModal
        ? progressFieldId
        : newProgressFields.length > 0
        ? newProgressFields[0].id
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
        ? newDateFields[1].id
        : 0;
    const defaultDependencyId =
      dependencyFieldId && !isOpenDependencyFieldModal
        ? dependencyFieldId
        : newDependencyFields.length > 0
        ? newDependencyFields[0].id
        : 0;

    if(newTitleFields.length > 0)
    {
      setTitleFieldId(defaultTitleId);
    }

    if(newColorFields.length > 0)
    {
      setColorFieldId(defaultColorId);
    }

    if(newProgressFields.length > 0)
    {
      setProgressFieldId(defaultProgressId);
    }

    if(newDateFields.length > 0)
    {
      setFromFieldId(defaultFromId);
    }

    if(newDateFields.length > 1)
    {
      setToFieldId(defaultToId);
    }

    if(newDependencyFields.length > 0)
    {
      setDependencyFieldId(defaultDependencyId);
    }

    setTitleFields(newTitleFields);
    setColorFields(newColorFields);
    setProgressFields(newProgressFields);
    setFromFields(newDateFields);
    setToFields(newDateFields.length > 1 ? newDateFields.slice(1) : []);
    setDependencyFields(newDependencyFields);
    updateGanttConfig(defaultTitleId, defaultColorId, defaultProgressId, defaultFromId, defaultToId, defaultDependencyId);
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
    updateGanttConfig(convertToInteger(value), colorFieldId, progressFieldId, fromFieldId, toFieldId, dependencyFieldId);
  };
  
  const onColorFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenColorFieldModal(true);
      return;
    }

    setColorFieldId(convertToInteger(value));
    updateGanttConfig(titleFieldId, convertToInteger(value), progressFieldId, fromFieldId, toFieldId, dependencyFieldId);
  };

  const onProgressFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenProgressFieldModal(true);
      return;
    }

    setProgressFieldId(convertToInteger(value));
    updateGanttConfig(titleFieldId, colorFieldId, convertToInteger(value), fromFieldId, toFieldId, dependencyFieldId);
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

    updateGanttConfig(titleFieldId, colorFieldId, progressFieldId, convertToInteger(value), toFieldId, dependencyFieldId);
  };

  const onToFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenToFieldModal(true);
      return;
    }

    setToFieldId(convertToInteger(value));
    updateGanttConfig(titleFieldId, colorFieldId, progressFieldId, fromFieldId, convertToInteger(value), dependencyFieldId);
  };

  const onDependencyFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if(value === "-1")
    {
      setIsOpenDependencyFieldModal(true);
      return;
    }

    setDependencyFieldId(convertToInteger(value));
    updateGanttConfig(titleFieldId, colorFieldId, progressFieldId, fromFieldId, toFieldId, convertToInteger(value));
  };

  const updateGanttConfig = (newTitleFieldId: number, newColorId: number, newProgressId: number, newFromId: number, newToId: number, newDependencyId: number) =>
  {
    updateConfig({
      titleId: newTitleFieldId,
      colorId: newColorId,
      progressId: newProgressId,
      fromId: newFromId,
      toId: newToId,
      dependencyId: newDependencyId === -2 ? 0 : newDependencyId
    });
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
        <InputLabel required id="timeline_progress_label" shrink>
          {t("Progress")}
        </InputLabel>
        <Select
          labelId="timeline_progress_label"
          label={t("Progress")}
          value={`${progressFieldId ? progressFieldId : ''}`}
          required
          error={submit && (!progressFieldId || progressFieldId === 0)}
          onChange={onProgressFieldChange}
          fullWidth
          notched
        >
          {progressFields.map((progressColumn: ViewField) => (
            <MenuItem key={`${progressColumn.id}`} value={`${progressColumn.id}`}>
              {progressColumn.name}
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
      <FormControl fullWidth>
        <InputLabel required id="timeline_dependency_label" shrink>
          {t("Dependency")}
        </InputLabel>
        <Select
          labelId="timeline_dependency_label"
          label={t("Dependency")}
          value={`${dependencyFieldId ? dependencyFieldId : ''}`}
          required
          error={submit && (!dependencyFieldId || dependencyFieldId === 0)}
          onChange={onDependencyFieldChange}
          fullWidth
          notched
        >
          <MenuItem key={"-2"} value={"-2"}>
            {t("Leave Empty")}
          </MenuItem>
          {dependencyFields.map((dependencyColumn: ViewField) => (
            <MenuItem key={`${dependencyColumn.id}`} value={`${dependencyColumn.id}`}>
              {dependencyColumn.name}
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
      {isOpenProgressFieldModal && 
        <CreateFieldModal
          translations={translations}
          field={newProgressField}
          fieldUiTypes={progressFieldUiTypes}
          open = {isOpenProgressFieldModal}
          handleClose={() => setIsOpenProgressFieldModal(false)}
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
      {isOpenDependencyFieldModal && 
        <CreateFieldModal
          translations={translations}
          field={newDependencyField}
          fieldUiTypes={dependencyFieldUiTypes}
          open = {isOpenDependencyFieldModal}
          handleClose={() => setIsOpenDependencyFieldModal(false)}
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

export default connect(mapStateToProps, mapDispatchToProps)(GanttViewConfig);