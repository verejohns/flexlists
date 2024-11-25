import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ViewField } from "src/models/ViewField";
import InputLabel from "@mui/material/InputLabel";
import { FormControl, Link } from "@mui/material";
import { listContentService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { Theme, useTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { ViewSublistFieldConfig } from "src/models/ViewSublistFieldConfig";

type SublistProps = {
  sublistConfig: ViewSublistFieldConfig;
  label: string;
  isEdit: boolean;
  submit: boolean;
  valueKey: string;
  values: any;
  setValues: (values: any[]) => void;
};

const SublistContentSelector = ({
  sublistConfig,
  label,
  isEdit,
  submit,
  valueKey,
  values,
  setValues,
}: SublistProps) => {
  const theme = useTheme();
  const [relationValues, setRelationValues] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    const getFieldValues = async () => {
      const response = await listContentService.searchContents(
        sublistConfig.viewId ?? 0
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

  const getStyles = (name: string, theme: Theme) => {
    return {
      fontWeight:
        !values || values.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

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
        value={values ?? []}
        onChange={(e) => setValues(e.target.value)}
        size="small"
        multiple
      >
        {sublistConfig &&
          relationValues.map((value: any) => (
            <MenuItem
              key={value.id}
              value={value.id}
              style={getStyles(value.id, theme)}
            >
              {value[sublistConfig.rightFieldId]}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

const mapStateToProps = (state: any) => ({});

export default connect(mapStateToProps)(SublistContentSelector);
