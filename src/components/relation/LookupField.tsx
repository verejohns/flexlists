import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ViewField } from "src/models/ViewField";
import InputLabel from "@mui/material/InputLabel";
import { Box, FormControl } from "@mui/material";
import { listContentService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import {
  downloadFileUrl,
  imageStringToJSON,
  linkStringToJSON,
} from "src/utils/flexlistHelper";
import {
  getLocalDateTimeFromString,
  getLocalDateFromString,
} from "src/utils/convertUtils";

type LookupFieldProps = {
  column: ViewField;
  isPrint: boolean;
  currentMode: string;
  values: any;
  isError?: boolean;
  setValues: (values: any[]) => void;
};

const LookupField = ({
  column,
  isPrint,
  currentMode,
  values,
  isError,
  setValues,
}: LookupFieldProps) => {
  const [relationValues, setRelationValues] = useState<any[]>([]);

  useEffect(() => {
    const getFieldValues = async () => {
      const response = await listContentService.searchContents(
        column.config.values.viewId
      );

      const contents: any[] = [];

      if (isSucc(response) && response.data && response.data.content) {
        for (const row of response.data.content) {
          contents.push(Object.fromEntries(row));
        }

        setRelationValues(contents);
      }
    };

    getFieldValues();
  }, []);
  const getLookupItem = (value: any) => {
    if (!column.config.values.lookupField) return "";

    switch (column.config.values.lookupField.uiField) {
      case FieldUiTypeEnum.Image:
        return (
          <Box
            component="img"
            sx={{
              width: 30,
              height: 30,
            }}
            alt=""
            src={downloadFileUrl(
              imageStringToJSON(value[column.config.values.rightFieldId])
                ?.fileId,
              column.config.values.viewId,
              column.config.values.rightFieldId
            )}
          />
        );
      case FieldUiTypeEnum.DateTime:
        return getLocalDateTimeFromString(
          value[column.config.values.rightFieldId]
        );
      case FieldUiTypeEnum.Date:
        return getLocalDateFromString(value[column.config.values.rightFieldId]);
      case FieldUiTypeEnum.Time:
        return getLocalDateTimeFromString(
          value[column.config.values.rightFieldId]
        ).split(", ")[1];
      case FieldUiTypeEnum.Link:
        return linkStringToJSON(value[column.config.values.rightFieldId]).name
          ? linkStringToJSON(value[column.config.values.rightFieldId]).name
          : linkStringToJSON(value[column.config.values.rightFieldId])
              .linkValue;
      case FieldUiTypeEnum.Video:
        return (
          <Box
            component="video"
            sx={{
              width: 30,
              height: 30,
            }}
            src={downloadFileUrl(
              imageStringToJSON(value[column.config.values.rightFieldId])
                ?.fileId,
              column.config.values.viewId,
              column.config.values.rightFieldId
            )}
          />
        );
      case FieldUiTypeEnum.Document:
        return imageStringToJSON(value[column.config.values.rightFieldId])!
          .fileName;

      default:
        return value[column.config.values.rightFieldId];
    }
  };
  return (
    <FormControl
      key={column.id}
      required={column.required}
      sx={{ width: "100%" }}
    >
      <InputLabel id={`${column.id}`} sx={{ top: "-5px" }}>
        {column.name}
      </InputLabel>
      <Select
        key={column.id}
        disabled={currentMode === "view" || isPrint}
        label={column.name}
        id={`${column.id}`}
        value={values && values[column.id] ? values[column.id] : []}
        onChange={(e) => setValues({ ...values, [column.id]: e.target.value })}
        size="small"
        error={isError}
      >
        {column?.config?.values &&
          relationValues.map((value: any) => (
            <MenuItem key={value.id} value={value.id}>
              {getLookupItem(value)}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default LookupField;
