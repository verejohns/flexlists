import {
  ExportType,
  FieldUiTypeEnum,
  ImportType,
  ViewType,
} from "src/enums/SharedEnums";
import { ChoiceModel } from "src/models/ChoiceModel";
import { ViewField } from "src/models/ViewField";
import { convertToInteger, convertToNumber } from "./convertUtils";
import { filter, min } from "lodash";
import { listContentService } from "flexlists-api";
import { isSucc } from "./responses";
import {
  FieldValidatorEnum,
  ModelValidatorEnum,
  frontendValidate,
  isFrontendError,
} from "./validatorHelper";
import { isDateTime, isInteger, isNumber } from "./validateUtils";
import bigDecimal from "js-big-decimal";
import { fi } from "date-fns/locale";
import { ViewFieldConfig } from "src/models/SharedModels";

export const getDefaultValues = (columns: ViewField[]): any => {
  var defautValues: any = {};
  for (const column of filter(columns, (x) => !x.system)) {
    let defaultValue: any = column.defaultValue
      ? column.defaultValue
      : undefined;
    let fielduiType = column.uiField;
    switch (fielduiType) {
      case FieldUiTypeEnum.Date:
      case FieldUiTypeEnum.DateTime:
      case FieldUiTypeEnum.Time:
        try {
          if (!isDateTime(defaultValue)) {
            defaultValue = "";
          }
        } catch (error) {
          defaultValue = "";
        }
        break;
      case FieldUiTypeEnum.Integer:
        try {
          if (defaultValue && isInteger(defaultValue)) {
            defaultValue = convertToInteger(defaultValue);
          } else {
            defaultValue = 0;
          }
        } catch {
          defaultValue = 0;
        }
        break;
      case FieldUiTypeEnum.Float:
      case FieldUiTypeEnum.Double:
      case FieldUiTypeEnum.Decimal:
      case FieldUiTypeEnum.Money:
      case FieldUiTypeEnum.Percentage:
        try {
          if (defaultValue && isNumber(defaultValue)) {
            defaultValue = convertToNumber(defaultValue);
          } else {
            defaultValue = 0;
          }
        } catch {
          defaultValue = 0;
        }
        break;
      case FieldUiTypeEnum.Text:
      case FieldUiTypeEnum.HTML:
      case FieldUiTypeEnum.LongText:
      case FieldUiTypeEnum.Markdown:
        break;
      case FieldUiTypeEnum.Image:
      case FieldUiTypeEnum.Video:
      case FieldUiTypeEnum.Document:
        try {
          if (defaultValue) {
            defaultValue = JSON.parse(defaultValue);
            defaultValue["fieldDefault"] = true;
          }
        } catch (error) {
          defaultValue = undefined;
        }

        break;
      case FieldUiTypeEnum.Lookup:
      case FieldUiTypeEnum.Sublist:
        try {
          if (defaultValue) {
            defaultValue = JSON.parse(defaultValue);
          }
        } catch (error) {
          defaultValue = undefined;
        }

        break;
      case FieldUiTypeEnum.User:
        try {
          if (defaultValue && isInteger(defaultValue)) {
            defaultValue = convertToInteger(defaultValue);
          }
        } catch (error) {
          defaultValue = undefined;
        }

        break;
      case FieldUiTypeEnum.Link:
        try {
          if (defaultValue) {
            defaultValue = JSON.parse(defaultValue);
          }
        } catch {
          defaultValue = undefined;
        }
        break;
      case FieldUiTypeEnum.Formula:
        break;
      case FieldUiTypeEnum.Choice:
        try {
          if (column.config?.multiple) {
            defaultValue = defaultValue ?? "";
          } else {
            defaultValue = defaultValue
              ? defaultValue
              : column.config?.values
              ? column.config?.values[0]?.label
              : "";
          }
        } catch {
          defaultValue = column.config?.values
            ? column.config?.values[0]?.label
            : "";
        }

        break;
      case FieldUiTypeEnum.Boolean:
        defaultValue = defaultValue == "true" ? true : false;
        break;
      case FieldUiTypeEnum.Color:
        defaultValue = defaultValue ? defaultValue : "#000000";
      default:
        break;
    }

    defautValues[column.id] = defaultValue;
  }
  return defautValues;
};
export const isValidFieldValue = async (
  fieldName: string,
  fieldType: FieldUiTypeEnum,
  value: any,
  required: boolean,
  setError: (message: string) => void,
  minimum?: bigint,
  maximum?: bigint
): Promise<boolean> => {
  let _errors: { [key: string]: string | boolean } = {};
  let _setErrors = (e: { [key: string]: string | boolean }) => {
    _errors = e;
  };
  let _setCustomErrorMessage = (message: string) => {
    setError(`Field ${fieldName}:${message}`);
  };
  let setRequiredErrorMessage = () => {
    setError(`Field ${fieldName} required`);
  };
  let isValid: boolean =
    !required ||
    (required &&
      value !== null &&
      value !== undefined &&
      (typeof value === "string" ? value.trim() !== "" : true));
  if (!isValid) {
    setRequiredErrorMessage();
    return isValid;
  }
  switch (fieldType) {
    case FieldUiTypeEnum.Text:
      await frontendValidate(
        ModelValidatorEnum.GenericTypes,
        FieldValidatorEnum.text,
        value,
        _errors,
        _setErrors,
        required,
        undefined,
        minimum,
        maximum
      );
      if (
        isFrontendError(
          FieldValidatorEnum.text,
          _errors,
          undefined,
          _setCustomErrorMessage
        )
      ) {
        isValid = false;
      }
      break;
    case FieldUiTypeEnum.LongText:
      await frontendValidate(
        ModelValidatorEnum.GenericTypes,
        FieldValidatorEnum.longText,
        value,
        _errors,
        _setErrors,
        required,
        undefined,
        minimum,
        maximum
      );
      if (
        isFrontendError(
          FieldValidatorEnum.longText,
          _errors,
          undefined,
          _setCustomErrorMessage
        )
      ) {
        isValid = false;
      }
      break;
    case FieldUiTypeEnum.Markdown:
    case FieldUiTypeEnum.HTML:
      break;
    case FieldUiTypeEnum.Integer:
      await frontendValidate(
        ModelValidatorEnum.GenericTypes,
        FieldValidatorEnum.integer,
        value,
        _errors,
        _setErrors,
        required,
        undefined,
        minimum,
        maximum
      );
      if (
        isFrontendError(
          FieldValidatorEnum.integer,
          _errors,
          undefined,
          _setCustomErrorMessage
        )
      ) {
        isValid = false;
      }
      break;
    case FieldUiTypeEnum.Boolean:
      break;
    case FieldUiTypeEnum.Decimal:
    case FieldUiTypeEnum.Money:
    case FieldUiTypeEnum.Percentage:
      if (value !== null && value !== undefined) {
        isValid =
          !value ||
          (value.replace(".", "").replace("-", "").length <= 30 &&
            value.split(".")[0].replace("-", "").length <= 20 &&
            (value.split(".").length === 1 ||
              value.split(".")[1].length <= 10));
        if (!isValid && value && value.includes("-")) {
          setError(`Field ${fieldName} must be at least -99999999999999999999`);
        }
        if (!isValid) {
          setError(`Field ${fieldName} must be at most 99999999999999999999`);
        }
      }
      break;
    case FieldUiTypeEnum.Float:
    case FieldUiTypeEnum.Double:
      if (minimum && value && parseFloat(value) < minimum) {
        setError(`Field ${fieldName} must be at least ${minimum}`);
      }
      if (maximum && value && parseFloat(value) > maximum) {
        setError(`Field ${fieldName} must be at most ${maximum}`);
      }
      break;
    case FieldUiTypeEnum.Link:
      let linkValue = value ? linkStringToJSON(value)?.linkValue : "";

      if (required && !linkValue) {
        setRequiredErrorMessage();
        break;
      }
      if (linkValue) {
        await frontendValidate(
          ModelValidatorEnum.GenericTypes,
          FieldValidatorEnum.url,
          linkValue,
          _errors,
          _setErrors,
          required,
          undefined,
          minimum,
          maximum
        );
        if (
          isFrontendError(
            FieldValidatorEnum.url,
            _errors,
            undefined,
            _setCustomErrorMessage
          )
        ) {
          isValid = false;
        }
      }
      break;
    default:
      break;
  }
  return isValid;
};
export const getDataColumnId = (
  fieldId: number,
  columns: ViewField[]
): string => {
  const field = columns.find((x) => x.id === fieldId);

  if (
    field &&
    field.system &&
    (field.name === "id" ||
      field.name === "createdAt" ||
      field.name === "updatedAt")
  ) {
    return field.name;
  }

  return `${fieldId}`;
};
export const getColumn = (
  column_id: any,
  columns: any[]
): ViewField | undefined => {
  const column = columns.find(
    (item: any) =>
      item.id === convertToInteger(column_id) || item.name === column_id
    // (!item.system && item.id === convertToInteger(column_id)) ||
    // (item.system &&
    //   (item.name === "createdAt" || item.name === "updatedAt") &&
    //   item.name === column_id)
  );
  return column;
};
export const getChoiceField = (
  fieldDataId: string,
  column: any,
  isSubField?: boolean
): { label: string; font: string; color: { bg: string; fill: string } }[] => {
  let color = { bg: "#333", fill: "white" };
  let font = "inherit";
  let choiceLabel: string = "";

  let resolveLabels =
    column.config?.multiple || isSubField
      ? fieldDataId
        ? fieldDataId.split(",")
        : []
      : [fieldDataId];
  let result: {
    id: string;
    label: string;
    font: string;
    color: { bg: string; fill: string };
  }[] = [];
  for (const label of resolveLabels) {
    let choiceValue: ChoiceModel = column.config?.values?.find(
      (x: any) => x.label === label
    );
    if (choiceValue) {
      choiceLabel = choiceValue.label;
      color = choiceValue.color ?? { bg: "white", fill: "black" };
      font = choiceValue.font;
    }
    result.push({
      id: choiceValue?.id ?? "",
      label: choiceLabel,
      font: font,
      color: color,
    });
  }

  // // order result in the same way as the choices in the config
  // if (column.config?.values) {
  //   let orderedResult: {
  //     id:string;
  //     label: string;
  //     font: string;
  //     color: { bg: string; fill: string };
  //   }[] = [];
  //   for (const choice of column.config?.values) {
  //     let resultItem = result.find((x) => x.label === choice.label);
  //     if (resultItem) {
  //       orderedResult.push(resultItem);
  //     }
  //   }
  //   result = orderedResult;
  // }

  return result; // [{ label: choiceLabel, font: font, color: color }];
};
export const getChoiceValues = (
  availableValues: any[],
  choiceLabels: string[]
) => {
  let choiceValues: any[] = [];
  for (const choiceLabel of choiceLabels) {
    let choiceValue = availableValues.find(
      (x) =>
        x.label?.trim()?.toLowerCase() === choiceLabel?.trim()?.toLowerCase()
    );
    if (choiceValue) {
      choiceValues.push(choiceValue);
    }
  }
  return choiceValues;
};
export const downloadFileDefault = (
  viewId: string,
  fieldId?: number,
  fileId?: string
) => {
  if (!viewId || viewId === "" || viewId === null) {
    return "";
  }
  if (!fieldId || fieldId === null) {
    return "";
  }
  return `${process.env.NEXT_PUBLIC_FLEXLIST_API_URL}/api/file/downloadFileDefault?viewId=${viewId}&fieldId=${fieldId}&fileId=${fileId}`;
};
export const downloadFileUrl = (
  id: string,
  viewId?: number,
  fieldId?: number
) => {
  if (!id || id === "" || id === null) {
    return "";
  }
  return `${process.env.NEXT_PUBLIC_FLEXLIST_API_URL}/api/file/downloadFile?id=${id}&viewId=${viewId}&fieldId=${fieldId}`;
};
export const downloadGroupAvatarUrl = (id: string, groupId?: number) => {
  if (!id || id === "" || id === null) {
    return "";
  }
  return `${process.env.NEXT_PUBLIC_FLEXLIST_API_URL}/api/file/downloadGroupAvatar?id=${id}&groupId=${groupId}`;
};
export const downloadUserAvatarUrl = (id: string) => {
  if (!id || id === "" || id === null) {
    return "";
  }
  return `${process.env.NEXT_PUBLIC_FLEXLIST_API_URL}/api/file/downloadUserAvatar?id=${id}`;
};
export const getExportFileExtension = (exportFile: ExportType): string => {
  switch (exportFile) {
    case ExportType.CSV:
      return "csv";
    case ExportType.JSON:
      return "json";
    case ExportType.RSS:
      return "rss";
    case ExportType.XML:
      return "xml";
    case ExportType.YML:
      return "yml";
    case ExportType.XLSX:
      return "xlsx";
    case ExportType.HTML:
      return "html";
  }
  return "csv";
};
export const getExportMimeType = (exportFile: ExportType): string => {
  switch (exportFile) {
    case ExportType.CSV:
      return "text/csv";
    case ExportType.JSON:
      return "application/json";
    case ExportType.RSS:
      return "application/rss+xml";
    case ExportType.XML:
      return "application/xml";
    case ExportType.YML:
      return "application/x-yaml";
    case ExportType.XLSX:
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ExportType.HTML:
      return "text/html";
  }
  return "application/json";
};

export const getImportFileExtension = (importFile: ImportType): string => {
  switch (importFile) {
    case ImportType.CSV:
      return "csv";
    case ImportType.JSON:
      return "json";
    case ImportType.XML:
      return "xml";
    case ImportType.YML:
      return "yml";
    case ImportType.XLSX:
      return "xlsx";
  }
  return "csv";
};
export const validateViewConfig = (
  viewType: ViewType,
  config: any,
  setError: (message: string) => void
): boolean => {
  let isValidConfig: boolean = true;
  switch (viewType) {
    case ViewType.Calendar:
      if (!config) {
        setError("Config invalid");
        isValidConfig = false;
        break;
      }
      if (!config.titleId || config.titleId === 0) {
        setError("Title field required");
        isValidConfig = false;
        break;
      }
      if (!config.beginDateTimeId || config.beginDateTimeId === 0) {
        setError("Begin Date field required");
        isValidConfig = false;
      }
      break;
    case ViewType.Gallery:
      if (!config) {
        setError("Config invalid");
        isValidConfig = false;
        break;
      }
      if (!config.imageId || config.imageId === 0) {
        setError("Image field required");
        isValidConfig = false;
      }
      break;
    case ViewType.KanBan:
      if (!config) {
        setError("Config invalid");
        isValidConfig = false;
        break;
      }
      if (!config.boardColumnId || config.boardColumnId === 0) {
        setError("Board field required");
        isValidConfig = false;
        break;
      }
      if (!config.titleId || config.titleId === 0) {
        setError("Title field required");
        isValidConfig = false;
      }
      break;
    case ViewType.Map:
      if (!config) {
        setError("Config invalid");
        isValidConfig = false;
        break;
      }
      if (!config.titleId || config.titleId === 0) {
        setError("Title field required");
        isValidConfig = false;
        break;
      }
      if (!config.latId || config.latId === 0) {
        setError("Latitude field required");
        isValidConfig = false;
        break;
      }
      if (!config.lngId || config.lngId === 0) {
        setError("Longitude field required");
        isValidConfig = false;
      }
      break;
    case ViewType.TimeLine:
      if (!config) {
        setError("Config invalid");
        isValidConfig = false;
        break;
      }
      if (!config.titleId || config.titleId === 0) {
        setError("Title field required");
        isValidConfig = false;
        break;
      }
      if (!config.colorId || config.colorId === 0) {
        setError("Color field required");
        isValidConfig = false;
        break;
      }
      if (!config.levelId || config.levelId === 0) {
        setError("Level field required");
        isValidConfig = false;
        break;
      }
      if (!config.fromId || config.fromId === 0) {
        setError("From field required");
        isValidConfig = false;
        break;
      }
      if (!config.toId || config.toId === 0) {
        setError("To field required");
        isValidConfig = false;
      }
      break;
    case ViewType.Gantt:
      if (!config) {
        setError("Config invalid");
        isValidConfig = false;
        break;
      }
      if (!config.titleId || config.titleId === 0) {
        setError("Title field required");
        isValidConfig = false;
        break;
      }
      if (!config.colorId || config.colorId === 0) {
        setError("Color field required");
        isValidConfig = false;
        break;
      }
      if (!config.progressId || config.progressId === 0) {
        setError("Level field required");
        isValidConfig = false;
        break;
      }
      if (!config.fromId || config.fromId === 0) {
        setError("From field required");
        isValidConfig = false;
        break;
      }
      if (!config.toId || config.toId === 0) {
        setError("To field required");
        isValidConfig = false;
      }
      break;
    case ViewType.Chart:
      if (!config) {
        setError("Config invalid");
        isValidConfig = false;
        break;
      }
      if (!config.xId || config.xId === 0) {
        setError("X field required");
        isValidConfig = false;
        break;
      }
      if (!config.yId || config.yId === 0) {
        setError("Y field required");
        isValidConfig = false;
        break;
      }
      if (
        (config.type === "pie" || config.type === "doughnut") &&
        (!config.colorId || config.colorId === 0)
      ) {
        setError("Pie and Doughnut chart required color");
        isValidConfig = false;
      }
    default:
      break;
  }
  return isValidConfig;
};
export async function getRowContent(
  viewId: number,
  contentId: number,
  rows: any[]
): Promise<any> {
  if (contentId && rows.length > 0) {
    let currentRow = rows.find((row) => row.id === contentId);
    if (!currentRow) {
      let currentRowResponse = await listContentService.getContent(
        viewId,
        contentId
      );
      if (isSucc(currentRowResponse) && currentRowResponse.data) {
        currentRow = Object.fromEntries(currentRowResponse.data);
        return currentRow;
      }
    }
    return currentRow;
  }
  return undefined;
}
export function getDefaultFieldIcon(fieldType: FieldUiTypeEnum): string {
  let icon: string = "";
  switch (fieldType) {
    case FieldUiTypeEnum.Choice:
      icon = "Choice";
      break;
    case FieldUiTypeEnum.Boolean:
      icon = "Boolean";
      break;
    case FieldUiTypeEnum.Color:
      icon = "Color";
      break;
    case FieldUiTypeEnum.Date:
      icon = "Date";
      break;
    case FieldUiTypeEnum.DateTime:
      icon = "Date-Time";
      break;
    case FieldUiTypeEnum.Decimal:
      icon = "Decimal";
      break;
    case FieldUiTypeEnum.Document:
      icon = "Document";
      break;
    case FieldUiTypeEnum.Double:
      icon = "Double";
      break;
    case FieldUiTypeEnum.Float:
      icon = "Float";
      break;
    case FieldUiTypeEnum.HTML:
      icon = "HTML";
      break;
    case FieldUiTypeEnum.Image:
      icon = "Image";
      break;
    case FieldUiTypeEnum.Integer:
      icon = "Integer";
      break;
    case FieldUiTypeEnum.LongText:
      icon = "Long-Text";
      break;
    case FieldUiTypeEnum.Markdown:
      icon = "Markdown";
      break;
    case FieldUiTypeEnum.Money:
      icon = "Price";
      break;
    case FieldUiTypeEnum.Percentage:
      icon = "";
      break;
    case FieldUiTypeEnum.Text:
      icon = "Text";
      break;
    case FieldUiTypeEnum.Time:
      icon = "Time";
      break;
    case FieldUiTypeEnum.Video:
      icon = "Video";
      break;
    case FieldUiTypeEnum.User:
      icon = "User";
      break;
    case FieldUiTypeEnum.Lookup:
      icon = "Lookup";
      break;
    case FieldUiTypeEnum.Sublist:
      icon = "Sublist";
      break;
    case FieldUiTypeEnum.ManyToMany:
      icon = "ManyToMany";
      break;
    case FieldUiTypeEnum.Link:
      icon = "Link";
      break;
    case FieldUiTypeEnum.Formula:
      icon = "Formula";
      break;
    default:
      break;
  }
  return icon;
}
export function getFieldIcons(): string[] {
  return [
    "Text",
    "Long-Text",
    "HTML",
    "Markdown",
    "Integer",
    "Float",
    "Double",
    "Decimal",
    "Choice",
    "Boolean",
    "Color",
    "Date",
    "Time",
    "Date-Time",
    "Image",
    "Video",
    "Document",
    "Lookup",
    "Sublist",
    "ManyToMany",
    "Formula",
    "Link",
    "Price",
    "User",
    "Down",
    "Close",
    "Importance",
    "Phase",
    "Plus",
  ];
}

export const enabledViewCards = (views: any[]) => {
  const enabledViews = process.env.NEXT_PUBLIC_FLEXLIST_VIEWS
    ? process.env.NEXT_PUBLIC_FLEXLIST_VIEWS.split(",")
    : [];

  return views.filter(
    (view: any) =>
      enabledViews.includes(view.type.toLowerCase()) || view.type === "List"
  );
};

export const comingsoonViewCard = (view: any) => {
  const comingsoonViews = process.env.NEXT_PUBLIC_FLEXLIST_COMINGSOON_VIEWS
    ? process.env.NEXT_PUBLIC_FLEXLIST_COMINGSOON_VIEWS.split(",")
    : [];

  return comingsoonViews.includes(view.type.toLowerCase());
};

export const getIdFromUserFieldData = (userData: string) => {
  return userData
    ? userData.split(" ")[1].replace("(", "").replace(")", "")
    : "";
};

export function imageStringToJSON(x: any) {
  if (typeof x !== "string") return x;
  if (!x || x.trim() === "") return undefined;
  let result: { fileId: string; fileName: string } | undefined;
  try {
    result = JSON.parse(x);
  } catch {
    try {
      result = {
        fileName: x.split("(")[0].trim(),
        fileId: x.split("(")[1].trim().split(")")[0],
      };
    } catch {}
  }
  return result;
}

export const getLinkFromLinkFieldData = (link: string) => {
  return link ? link.split("(")[0].trim() : "";
};

export function linkStringToJSON(x: any) {
  if (typeof x !== "string") return x;
  if (!x || x.trim() === "") return undefined;
  let result: { linkValue: string; name: string };
  try {
    result = JSON.parse(x);
  } catch {
    let s = x.substring(x.indexOf("(") + 1).trim();
    s = s.substring(0, s.length - 1);
    result = {
      linkValue: x.split("(")[0].trim(),
      name: s,
    };
  }
  return result;
}
export function sortFields(fields: any[], isView?: boolean) {
  return fields.sort((a: any, b: any) => {
    return a.ordering - b.ordering;
  });

  let firstNormalSystemField: any = null;
  let systemFieldsBeforeNormalFields: any[] = [];
  console.log(fields);
  for (const field of fields) {
    if (!field.system) {
      firstNormalSystemField = field;
      break;
    }
    systemFieldsBeforeNormalFields.push(field);
  }
  console.log("firstNormalSystemField", firstNormalSystemField);
  let newSortFields: any[] = [];
  if (
    systemFieldsBeforeNormalFields.length > 0 &&
    systemFieldsBeforeNormalFields.find((x) => x.name === "id")
  ) {
    newSortFields.push(
      systemFieldsBeforeNormalFields.find((x) => x.name === "id")
    );
  }
  if (firstNormalSystemField) {
    newSortFields = newSortFields.concat(
      fields.filter((x) =>
        isView
          ? x.viewFieldOrdering >= firstNormalSystemField.viewFieldOrdering
          : x.ordering >= firstNormalSystemField.ordering
      )
    );
  }
  let systemFieldsWithoutIdField = systemFieldsBeforeNormalFields.filter(
    (x) => x.name !== "id"
  );
  if (systemFieldsWithoutIdField.length > 0) {
    newSortFields = newSortFields.concat(systemFieldsWithoutIdField);
  }
  return newSortFields;
  // return fields.sort((a: any, b: any) => {
  //   if (a.system && a.name === "id") {
  //     return -1;
  //   }
  //   if (b.system && b.name === "id") {
  //     return 1;
  //   }
  //   if (a.system && !b.system) {
  //     return 1; // b comes before a
  //   } else if (!a.system && b.system) {
  //     return -1; // a comes before b
  //   } else {
  //     // Both have the same value for the "system" property or both are true/false
  //     if (a.system) {
  //       return a.ordering - b.ordering; // order in ascending  order when system is true
  //     } else {
  //       return a.ordering - b.ordering; // order in descending order when system is false
  //     }
  //   }
  // });
}
export const isFieldDetailOnlys = (
  column: ViewField,
  fields?: ViewFieldConfig[]
) => {
  let fieldConfig = fields?.find((x) => x.id === column.id);
  if (fieldConfig) {
    return fieldConfig.visible && !fieldConfig.detailsOnly;
  }
  return column.viewFieldVisible && !column.viewFieldDetailsOnly;
};
export const isFieldVisible = (
  column: ViewField,
  fields?: ViewFieldConfig[]
) => {
  let fieldConfig = fields?.find((x) => x.id === column.id);
  if (fieldConfig) {
    return fieldConfig.visible;
  }
  return column.viewFieldVisible;
};
