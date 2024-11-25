import { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  TextField
} from "@mui/material";
import { connect } from "react-redux";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import { ViewField } from "src/models/ViewField";
import { convertToInteger } from "src/utils/convertUtils";
import { FieldUIType } from "src/models/SharedModels";
import CreateFieldModal from "./CreateFieldModal";
import { ChartConfig } from "src/models/ViewConfig";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { ChartType } from "src/enums/ChartTypes";

type ChartViewConfigProps = {
  translations: TranslationText[];
  submit: boolean;
  columns: ViewField[];
  availableFieldUiTypes: FieldUIType[];
  config?: ChartConfig;
  updateConfig: (config: ChartConfig) => void;
};

function ChartViewConfig({
  translations,
  submit,
  columns,
  availableFieldUiTypes,
  config,
  updateConfig,
}: ChartViewConfigProps) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };

  const types = [
    {label: t('Line'), value: ChartType.Line},
    {label: t('Bar'), value: ChartType.Bar},
    {label: t('Pie'), value: ChartType.Pie},
    {label: t('Doughnut'), value: ChartType.Doughnut},
    {label: t('Scatter'), value: ChartType.Scatter}
  ];

  const [type, setType] = useState(config && config.type ? config.type : types[0].value);
  const [xId, setXId] = useState<number>(config && config.xId ? config.xId : 0);
  const [yId, setYId] = useState<number>(config && config.yId ? config.yId : 0);
  const [xLabel, setXLabel] = useState<string>(config && config.xLabel ? config.xLabel : '');
  const [yLabel, setYLabel] = useState<string>(config && config.yLabel ? config.yLabel : '');
  const [colorId, setColorId] = useState<number>(config && config.colorId ? config.colorId : (type === ChartType.Pie || type === ChartType.Doughnut) ? 0 : -2);
  const [multiLineChoiceId, setMultiLineChoiceId] = useState<number>(config && config.multiLineChoiceId ? config.multiLineChoiceId : -2);

  const [isOpenXModal, setIsOpenXModal] = useState<boolean>(false);
  const [isOpenYModal, setIsOpenYModal] = useState<boolean>(false);
  const [isOpenColorModal, setIsOpenColorModal] = useState<boolean>(false);
  const [isOpenMultiLineChoiceModal, setIsOpenMultiLineChoiceModal] = useState<boolean>(false);

  const isXFieldType = (value: string) => {
    return value === FieldUiTypeEnum.Text ||
    value === FieldUiTypeEnum.Integer ||
    value === FieldUiTypeEnum.Float ||
    value === FieldUiTypeEnum.Date ||
    value === FieldUiTypeEnum.DateTime ||
    value === FieldUiTypeEnum.Time;
  };

  const xFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => isXFieldType(uiType.name)
  );
  const floatFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Float
  );
  const colorFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Color
  );
  const choiceFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter(
    (uiType) => uiType.name === FieldUiTypeEnum.Choice
  );

  const getXFields = (): ViewField[] => {
    return columns.filter((x) => isXFieldType(x.uiField));
  };
  const getFloatFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Float);
  };
  const getColorFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Color);
  };
  const getChoiceFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Choice);
  };

  const [xFields, setXFields] = useState<ViewField[]>(getXFields());
  const [yFields, setYFields] = useState<ViewField[]>(getFloatFields());
  const [colorFields, setColorFields] = useState<ViewField[]>(getColorFields());
  const [multiLineChoiceFields, setMultiLineChoiceFields] = useState<ViewField[]>(getChoiceFields());

  const newXField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Text,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
  };
  const newFloatField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Float,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
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
  const newMultiLineChoiceField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Choice,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
  };

  const reloadColumns = () => {
    const newXFields: ViewField[] = getXFields();
    const newFloatFields: ViewField[] = getFloatFields();
    const newColorFields: ViewField[] = getColorFields();
    const newMultiLineChoiceFields: ViewField[] = getChoiceFields();
    const defaultXId =
      xId && !isOpenXModal
        ? xId
        : newXFields.length > 0
        ? newXFields[0].id
        : 0;
    const defaultYId =
      yId && !isOpenYModal
        ? yId
        : newFloatFields.length > 0
        ? newFloatFields[0].id
        : 0;
    const defaultColorId =
      colorId && !isOpenColorModal
        ? colorId
        : newColorFields.length > 0
        ? newColorFields[0].id
        : 0;
    const defaultMultiLineChoiceId =
      multiLineChoiceId && !isOpenMultiLineChoiceModal
        ? multiLineChoiceId
        : newMultiLineChoiceFields.length > 0
        ? newMultiLineChoiceFields[0].id
        : 0;

    if (newXFields.length > 0) {
      setXId(defaultXId);
    }
    if (newFloatFields.length > 0) {
      setYId(defaultYId);
    }
    if (newColorFields.length > 0) {
      setColorId(defaultColorId);
    }
    if (newMultiLineChoiceFields.length > 0) {
      setMultiLineChoiceId(defaultMultiLineChoiceId);
    }

    setXFields(newXFields);
    setYFields(newFloatFields);
    setColorFields(newColorFields);
    setMultiLineChoiceFields(newMultiLineChoiceFields);
    
    updateChartConfig(
      type,
      defaultXId,
      defaultYId,
      xLabel,
      yLabel,
      defaultColorId,
      defaultMultiLineChoiceId
    );
  };

  useEffect(() => {
    reloadColumns();
  }, [columns]);

  const onXFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    const newYFields = getFloatFields().filter(
      (floatField: ViewField) => floatField.id !== convertToInteger(value)
    );

    if (value === "-1") {
      setIsOpenXModal(true);
      return;
    }

    setXId(convertToInteger(value));
    setYFields(newYFields);

    if (convertToInteger(value) === yId) {
      setYId(
        newYFields.length ? newYFields[0].id : 0
      );
    }

    updateChartConfig(
      type,
      convertToInteger(value),
      yId,
      xLabel,
      yLabel,
      colorId,
      multiLineChoiceId
    );
  };

  const onYFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenYModal(true);
      return;
    }

    setYId(convertToInteger(value));
    
    updateChartConfig(
      type,
      xId,
      convertToInteger(value),
      xLabel,
      yLabel,
      colorId,
      multiLineChoiceId
    );
  };

  const onXLabelChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value as string;

    setXLabel(value);

    updateChartConfig(
      type,
      xId,
      yId,
      value,
      yLabel,
      colorId,
      multiLineChoiceId
    );
  };

  const onYLabelChange = (event: { target: { value: string; }; }) => {
    const value = event.target.value as string;

    setYLabel(value);

    updateChartConfig(
      type,
      xId,
      yId,
      xLabel,
      value,
      colorId,
      multiLineChoiceId
    );
  };

  const onColorChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenColorModal(true);
      return;
    }

    setColorId(convertToInteger(value));
    
    updateChartConfig(
      type,
      xId,
      yId,
      xLabel,
      yLabel,
      convertToInteger(value),
      multiLineChoiceId
    );
  };

  const onMultiLineChoiceChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;

    if (value === "-1") {
      setIsOpenMultiLineChoiceModal(true);
      return;
    }

    setMultiLineChoiceId(convertToInteger(value));
    
    updateChartConfig(
      type,
      xId,
      yId,
      xLabel,
      yLabel,
      colorId,
      convertToInteger(value)
    );
  };

  const updateChartConfig = (
    newType: string,
    newXId: number,
    newYId: number,
    newXLabel: string,
    newYLabel: string,
    newColorId: number,
    newMultiLineChoiceId: number
  ) => {
    updateConfig({
      type: newType,
      xId: newXId,
      yId: newYId,
      xLabel: newXLabel,
      yLabel: newYLabel,
      colorId: newColorId === -2 ? 0 : newColorId,
      multiLineChoiceId: newMultiLineChoiceId === -2 ? 0 : newMultiLineChoiceId
    });
  };

  const handleType = (event: SelectChangeEvent) => {
    if ((event.target.value === ChartType.Pie || event.target.value === ChartType.Doughnut) && colorId === -2) setColorId(0);

    setType(event.target.value as string);
    updateChartConfig(
      event.target.value as string,
      xId,
      yId,
      xLabel,
      yLabel,
      colorId,
      multiLineChoiceId
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <FormControl required>
        <InputLabel required id="chart_type" shrink>{t('Type')}</InputLabel>
        <Select
          labelId="chart_type"
          label={t('Type')}
          value={type}
          onChange={handleType}
          notched
          fullWidth
          required
        >
          {types.map((type: any) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel required id="chart_x_label" shrink>
          X
        </InputLabel>
        <Select
          labelId="chart_x_label"
          label={"X"}
          value={`${xId ? xId : ''}`}
          required
          error={submit && (!xId || xId === 0)}
          onChange={onXFieldChange}
          fullWidth
          notched
        >
          {xFields.map((xField: ViewField) => (
            <MenuItem key={`${xField.id}`} value={`${xField.id}`}>
              {xField.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel required id="chart_y_label" shrink>
          Y
        </InputLabel>
        <Select
          label={t("Y")}
          labelId="chart_y_label"
          value={`${yId ? yId : ''}`}
          onChange={onYFieldChange}
          required
          error={submit && (!yId || yId === 0)}
          fullWidth
          notched
        >
          {yFields.map((yField: ViewField) => (
            <MenuItem key={`${yField.id}`} value={`${yField.id}`}>
              {yField.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="chart_xLabel_label" shrink>
          {t("X Label")}
        </InputLabel>
        <TextField
          fullWidth
          label={t("X Label")}
          InputLabelProps={{ shrink: true }}
          name='xLabel'
          type={"text"}
          onChange={onXLabelChange}
          value={xLabel}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="chart_yLabel_label" shrink>
          {t("Y Label")}
        </InputLabel>
        <TextField
          fullWidth
          label={t("Y Label")}
          InputLabelProps={{ shrink: true }}
          name='yLabel'
          type={"text"}
          onChange={onYLabelChange}
          value={yLabel}
        />
      </FormControl>
      {(type !== ChartType.Line || (type === ChartType.Line && multiLineChoiceId === -2)) && <FormControl fullWidth>
        <InputLabel required={type === ChartType.Pie || type === ChartType.Doughnut} id="chart_color_label" shrink>
          {t("Color")}
        </InputLabel>
        <Select
          labelId="chart_color_label"
          label={t("Color")}
          value={`${colorId ? colorId : ''}`}
          onChange={onColorChange}
          fullWidth
          notched
          required={type === ChartType.Pie || type === ChartType.Doughnut}
          error={submit && (type === ChartType.Pie || type === ChartType.Doughnut) && (!colorId || colorId === 0)}
        >
          {type !== ChartType.Pie && type !== ChartType.Doughnut && <MenuItem key={"-2"} value={"-2"}>
            {t("Leave Empty")}
          </MenuItem>}
          {colorFields.map((colorField: ViewField) => (
            <MenuItem key={`${colorField.id}`} value={`${colorField.id}`}>
              {colorField.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>}
      {type === ChartType.Line && <FormControl fullWidth>
        <InputLabel id="chart_multi_line_choice_label" shrink>
          {t("MultiLine Choices")}
        </InputLabel>
        <Select
          labelId="chart_multi_line_choice_label"
          label={t("MultiLine Choices")}
          value={`${multiLineChoiceId ? multiLineChoiceId : ''}`}
          onChange={onMultiLineChoiceChange}
          fullWidth
          notched
        >
          <MenuItem key={"-2"} value={"-2"}>
            {t("Leave Empty")}
          </MenuItem>
          {multiLineChoiceFields.map((multiLineChoiceField: ViewField) => (
            <MenuItem key={`${multiLineChoiceField.id}`} value={`${multiLineChoiceField.id}`}>
              {multiLineChoiceField.name}
            </MenuItem>
          ))}
          <MenuItem key={"-1"} value={"-1"}>
            {t("Create New Field")}
          </MenuItem>
        </Select>
      </FormControl>}
      {isOpenXModal && (
        <CreateFieldModal
          translations={translations}
          field={newXField}
          fieldUiTypes={xFieldUiTypes}
          open={isOpenXModal}
          handleClose={() => setIsOpenXModal(false)}
        />
      )}
      {isOpenYModal && (
        <CreateFieldModal
          translations={translations}
          field={newFloatField}
          fieldUiTypes={floatFieldUiTypes}
          open={isOpenYModal}
          handleClose={() => setIsOpenYModal(false)}
        />
      )}
      {isOpenColorModal && (
        <CreateFieldModal
          translations={translations}
          field={newColorField}
          fieldUiTypes={colorFieldUiTypes}
          open={isOpenColorModal}
          handleClose={() => setIsOpenColorModal(false)}
        />
      )}
      {isOpenMultiLineChoiceModal && (
        <CreateFieldModal
          translations={translations}
          field={newMultiLineChoiceField}
          fieldUiTypes={choiceFieldUiTypes}
          open={isOpenMultiLineChoiceModal}
          handleClose={() => setIsOpenMultiLineChoiceModal(false)}
        />
      )}
    </Box>
  );
}

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChartViewConfig);
