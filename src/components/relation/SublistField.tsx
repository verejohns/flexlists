import { useEffect, useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ViewField } from "src/models/ViewField";
import InputLabel from "@mui/material/InputLabel";
import { FormControl, Link, Box } from "@mui/material";
import { listContentService } from "flexlists-api";
import { isSucc } from "src/models/ApiResponse";
import { Theme, useTheme } from "@mui/material/styles";
import { connect } from "react-redux";
import { View } from "src/models/SharedModels";
import { useRouter } from "next/router";
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
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import { listViewService } from "flexlists-api";
import { PATH_MAIN } from "src/routes/paths";

type SublistFieldProps = {
  column: ViewField;
  isPrint: boolean;
  currentMode: string;
  values: any;
  isError?: boolean;
  currentView: View;
  translations: TranslationText[];
  setValues: (values: any[]) => void;
};

const SublistField = ({
  column,
  isPrint,
  currentMode,
  values,
  isError,
  currentView,
  translations,
  setValues,
}: SublistFieldProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const theme = useTheme();
  const [relationValues, setRelationValues] = useState<any[]>([]);
  const [subView, setSubView] = useState<View>();
  const router = useRouter();
  const [ppid, setPpid] = useState("");

  useEffect(() => {
    if (router.query.cpid) {
      const oldPpid = router.query.ppid ? `${router.query.ppid};` : "";
      setPpid(`${oldPpid}${router.query.cpid}`);
    }
  }, [router.isReady]);

  useEffect(() => {
    const getSubViewContents = async () => {
      const viewResponse = await listViewService.getView(
        column.config.values.viewId
      );

      if (isSucc(viewResponse) && viewResponse.data)
        setSubView(viewResponse.data);

      const contentResponse = await listContentService.searchContents(
        column.config.values.viewId,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );

      const contents: any[] = [];

      if (
        isSucc(contentResponse) &&
        contentResponse.data &&
        contentResponse.data.content
      ) {
        for (const row of contentResponse.data.content) {
          contents.push(Object.fromEntries(row));
        }

        setRelationValues(contents);
      }
    };

    getSubViewContents();
  }, []);

  const getStyles = (name: string, theme: Theme) => {
    return {
      fontWeight:
        !values || !values[column.id] || values[column.id].indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  const getSublistItem = (value: any) => {
    if (!column.config.values.subField) return "";

    switch (column.config.values.subField.uiField) {
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
        className="sublist_select"
        key={column.id}
        disabled={currentMode === "view" || isPrint}
        label={column.name}
        id={`${column.id}`}
        value={values && values[column.id] ? values[column.id] : []}
        onChange={(e) => setValues({ ...values, [column.id]: e.target.value })}
        size="small"
        error={isError}
        multiple
        // renderValue={(selected) => (
        //   <Box>
        //     {selected.map((value: any) => {
        //       const selectedData = relationValues.find((el: any) => el.id === value);
        //       return <Box>{selectedData[column.config.values.rightFieldId]}</Box>
        //     })}
        //   </Box>
        // )}
      >
        {column?.config?.values &&
          relationValues.map(
            (value: any) =>
              value[column.config.values.rightFieldId] && (
                <MenuItem
                  key={value.id}
                  value={value.id}
                  style={getStyles(value.id, theme)}
                >
                  {getSublistItem(value)}
                </MenuItem>
              )
          )}
      </Select>

      {values && currentMode !== "create" && (
        <Link
          sx={{ marginTop: 1, textAlign: "right" }}
          href={`${
            subView?.isDefaultView ? PATH_MAIN.lists : PATH_MAIN.views
          }/${column.config.values.viewId}?${
            ppid ? "ppid=" + ppid + "&" : ""
          }cpid=${currentView.id}-${column.id}-${values.id}`}
        >
          {t("Subview")}
        </Link>
      )}
    </FormControl>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView,
});

export default connect(mapStateToProps)(SublistField);
