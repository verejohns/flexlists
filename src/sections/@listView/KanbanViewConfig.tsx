import { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";
import { connect } from "react-redux";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import { ViewField } from "src/models/ViewField";
import { convertToInteger } from "src/utils/convertUtils";
import { Field, FieldUIType } from "src/models/SharedModels";
import CreateFieldModal from "./CreateFieldModal";
import { KanbanConfig } from "src/models/ViewConfig";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";

type KanbanViewConfigProps = {
  translations: TranslationText[];
  submit: boolean;
  columns: ViewField[];
  availableFieldUiTypes: FieldUIType[];
  config?: KanbanConfig;
  updateConfig: (config: KanbanConfig) => void;
};

function KanbanViewConfig({
  translations,
  submit,
  columns,
  availableFieldUiTypes,
  config,
  updateConfig,
}: KanbanViewConfigProps) {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const [boardColumnId, setBoardColumnId] = useState<number>(config && config.boardColumnId ? config.boardColumnId : 0);
  const [titleFieldId, setTitleFieldId] = useState<number>(config && config.titleId ? config.titleId : 0);
  const [isOpenBoardFieldModal, setIsOpenBoardFieldModal] = useState<boolean>(false);
  const [isOpenTitleFieldModal, setIsOpenTitleFieldModal] = useState<boolean>(false);
  const boardFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Choice);
  const titleFieldUiTypes: FieldUIType[] = availableFieldUiTypes.filter((uiType) => uiType.name === FieldUiTypeEnum.Text);

  const getBoardFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Choice);
  };
  const getTitleFields = (): ViewField[] => {
    return columns.filter((x) => x.uiField === FieldUiTypeEnum.Text);
  };

  const [boardFields, setBoardFields] = useState<ViewField[]>(getBoardFields());
  const [titleFields, setTitleFields] = useState<ViewField[]>(getTitleFields());

  const newBoardField: any = {
    name: "",
    required: true,
    uiField: FieldUiTypeEnum.Choice,
    description: "",
    detailsOnly: false,
    icon: "",
    config: {},
    defaultValue: "",
  };

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

  const reloadColumns = () => {
    const newBoardFields: ViewField[] = getBoardFields();
    const newTitleFields: ViewField[] = getTitleFields();

    const defaultBoardId =
      boardColumnId && !isOpenBoardFieldModal
        ? boardColumnId
        : newBoardFields.length > 0
        ? newBoardFields[0].id
        : 0;
    const defaultTitleId =
      titleFieldId && !isOpenTitleFieldModal
        ? titleFieldId
        : newTitleFields.length > 0
        ? newTitleFields[0].id
        : 0;

    if (newBoardFields.length > 0) {
      setBoardColumnId(defaultBoardId);
    }
    if (newTitleFields.length > 0) {
      setTitleFieldId(defaultTitleId);
    }

    setBoardFields(newBoardFields);
    setTitleFields(newTitleFields);
    updateKanbanConfig(
      defaultBoardId,
      defaultTitleId
    );
  };

  useEffect(() => {
    reloadColumns();
  }, [columns]);

  const onBoardFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === "-1") {
      setIsOpenBoardFieldModal(true);
      return;
    }
    setBoardColumnId(convertToInteger(value));
    updateKanbanConfig(convertToInteger(value), titleFieldId);
  };

  const onTitleFieldChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === "-1") {
      setIsOpenTitleFieldModal(true);
      return;
    }
    setTitleFieldId(convertToInteger(value));
    updateKanbanConfig(boardColumnId, convertToInteger(value));
  };

  const updateKanbanConfig = (
    newBoardColumnId: number,
    newTitleId: number
  ) => {
    updateConfig({
      boardColumnId: newBoardColumnId,
      titleId: newTitleId,
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <FormControl fullWidth>
          <InputLabel required id="select-board-label" shrink>
            {t("Board")}
          </InputLabel>
          <Select
            label={t("Board")}
            labelId="select-board-label"
            value={`${boardColumnId ? boardColumnId : ''}`}
            onChange={onBoardFieldChange}
            required
            error={submit && (!boardColumnId || boardColumnId === 0)}
            fullWidth
            notched
            // sx={{ width: { md: "168px" }, marginLeft: { xs: "8px", md: "30px" } }}
          >
            {boardFields.map((viewColumn: ViewField) => (
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
          <InputLabel required id="select-title-label" shrink>
            {t("Title")}
          </InputLabel>
          <Select
            label={t("Title")}
            labelId="select-title-label"
            value={`${titleFieldId ? titleFieldId : ''}`}
            required
            error={submit && (!titleFieldId || titleFieldId === 0)}
            onChange={onTitleFieldChange}
            fullWidth
            notched
            // sx={{ width: { md: "168px" }, marginLeft: { xs: "8px", md: "30px" } }}
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
      </Box>

      {isOpenBoardFieldModal && (
        <CreateFieldModal
          translations={translations}
          field={newBoardField}
          fieldUiTypes={boardFieldUiTypes}
          open={isOpenBoardFieldModal}
          handleClose={() => setIsOpenBoardFieldModal(false)}
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
    </>
  );
}
const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(KanbanViewConfig);
