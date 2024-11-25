import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import { listContentService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { ViewLookupFieldConfig } from "src/models/ViewLookupFieldConfig";

type LookupFieldProps = {
  lookupConfig: ViewLookupFieldConfig;
  label: string;
  isEdit: boolean;
  valueKey: string;
  values: any;
  submit: boolean;
  setValues: (values: any) => void;
};

const LookupContentSelector = ({
  lookupConfig,
  label,
  isEdit,
  valueKey,
  values,
  submit,
  setValues,
}: LookupFieldProps) => {
  const [relationValues, setRelationValues] = useState<any[]>([]);

  useEffect(() => {
    const getFieldValues = async () => {
      const response = await listContentService.searchContents(
        lookupConfig.viewId ?? 0
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

  return (
    <FormControl key={valueKey} sx={{ width: "100%" }}>
      <InputLabel id={`${valueKey}`} sx={{ top: "-5px" }}>
        {label}
      </InputLabel>
      <Select
        key={valueKey}
        disabled={!isEdit}
        label={label}
        id={`${valueKey}`}
        value={values}
        onChange={(e) => setValues(e.target.value)}
        size="small"
      >
        {lookupConfig &&
          relationValues.map((value: any) => (
            <MenuItem key={value.id} value={value.id}>
              {value[lookupConfig.rightFieldId]}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default LookupContentSelector;
