import {
  TextField,
  Box,
  FormControlLabel,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { connect } from "react-redux";
import useResponsive from "../../hooks/useResponsive";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ViewField } from "src/models/ViewField";
import { FieldUiTypeEnum } from "src/enums/SharedEnums";
import {
  getChoiceValues,
  imageStringToJSON,
  linkStringToJSON,
} from "src/utils/flexlistHelper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  getAmPm,
  getDateFromTimeString,
  getDateFormatString,
  utcFormat,
} from "src/utils/convertUtils";
import { DatePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MarkdownEditor from "src/components/rowedit/MarkdownEditor";
import HTMLEditor from "src/components/rowedit/HTMLEditor";
import UploadButton from "src/components/upload/UploadButton";
import ColorPicker from "src/components/color-picker/ColorPicker";
import LinkFieldInput from "./fields/LinkFieldInput";
import RatingField from "src/components/rating-field/RatingField";
import CheckboxRating from "src/components/rating-field/CheckboxRating";
import NumericRating from "src/components/rating-field/NumericRating";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import ViewUserSelect from "../user/ViewUserSelect";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import SublistContentSelector from "./fields/SublistContentSelector";
import LookupContentSelector from "./fields/LookupContentSelector";
import { isDateTime, isInteger } from "src/utils/validateUtils";
import { documentAcceptFiles } from "src/utils/fileUtils";
import { createFileObject, FileImpl } from "flexlists-api";
import SwitchBox from "src/components/switch/SwitchBox";
import { colors } from "src/sections/@list/fieldConfig/ChoiceConfig";

type RenderFieldDefaultProps = {
  field: ViewField;
  submit: boolean;
  translations: TranslationText[];
  viewId: number;
  setField: (newField: ViewField) => void;
};

const RenderFieldDefault = ({
  field,
  submit,
  translations,
  viewId,
  setField,
}: RenderFieldDefaultProps) => {
  const defaultValueName = "defaultValue";
  const defaultLabel = "Default";
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const isDesktop = useResponsive("up", "md");
  const [rating, setRating] = useState<number | null>(null);

  const handleRatingChange = (newValue: number | null) => {
    setRating(newValue);
  };

  const setDateValue = (date: Dayjs | null) => {
    try {
      if (date == null) return;

      if (typeof date === "string") {
        setField({ ...field, [defaultValueName]: date });

        return;
      }

      const dateString = date.format(utcFormat);

      setField({ ...field, [defaultValueName]: dateString });
    } catch (e) {}
  };

  const setTimeValue = (time: Dayjs | null) => {
    if (time == null) return;

    setField({
      ...field,
      [defaultValueName]: time.format(utcFormat),
    });
  };

  const setDateTimeValue = (date: Dayjs | Date | null) => {
    try {
      if (date == null) return;

      if (typeof date === "string") {
        setField({ ...field, [defaultValueName]: date });

        return;
      }

      setField({ ...field, [defaultValueName]: date.toISOString() });
    } catch (e) {}
  };

  const useStyles = makeStyles({
    paper: {
      "& > :first-of-type ": {
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
      },
    }
  });

  const classes = useStyles();

  const theme = useTheme();
  
  const getFileValue = () => {
    if (
      field &&
      field.typedDefaultValue &&
      field.typedDefaultValue instanceof FileImpl
    ) return field.typedDefaultValue.data;

    if (field && field[defaultValueName]) {
      let defaultImageValue = imageStringToJSON(field[defaultValueName]);

      defaultImageValue.fieldDefault = true;
      
      return defaultImageValue;
    }

    return undefined;
  };

  const parseToJson = (value: any) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  };

  switch (field.uiField) {
    case FieldUiTypeEnum.Text:
      return (
        <TextField
          key={field.id}
          style={{ width: "100%" }}
          label={defaultLabel}
          InputLabelProps={{ shrink: true }}
          name={`${field.id}`}
          // size="small"
          type={"text"}
          onChange={(e) => {
            setField({ ...field, [defaultValueName]: e.target.value });
          }}
          value={
            field && field[defaultValueName] ? field[defaultValueName] : ""
          }
          rows={4}
          required={field.required}
          // error={submit && field.required && (!field || !field[defaultValueName])}
        />
      );
    case FieldUiTypeEnum.LongText:
      return (
        <TextField
          key={field.id}
          label={defaultLabel}
          name={`${field.id}`}
          InputLabelProps={{ shrink: true }}
          size="small"
          type={"text"}
          onChange={(e) => {
            setField({ ...field, [defaultValueName]: e.target.value });
          }}
          value={
            field && field[defaultValueName] ? field[defaultValueName] : ""
          }
          minRows={4}
          maxRows={Infinity}
          multiline={true}
          required={field.required}
          // error={submit && field.required && !field[defaultValueName]}
          fullWidth
        />
      );
    case FieldUiTypeEnum.Integer:
    case FieldUiTypeEnum.Double:
    case FieldUiTypeEnum.Decimal:
    case FieldUiTypeEnum.Float:
    case FieldUiTypeEnum.Percentage:
    case FieldUiTypeEnum.Money:
      return (
        <TextField
          key={field.id}
          label={defaultLabel}
          InputLabelProps={{ shrink: true }}
          name={`${field.id}`}
          size="small"
          type={"number"}
          onChange={(e) =>
            setField({ ...field, [defaultValueName]: e.target.value })
          }
          value={
            field && field[defaultValueName] ? field[defaultValueName] : ""
          }
          rows={4}
          required={field.required}
          // error={
          //   submit &&
          //   field.required &&
          //   (field[defaultValueName] == null || field[defaultValueName] == undefined)
          // }
          fullWidth
        />
      );
    case FieldUiTypeEnum.DateTime:
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} key={field.id}>
          <DateTimePicker
            sx={{ width: "100%" }}
            value={
              field &&
              field[defaultValueName] &&
              field[defaultValueName] != null
                ? isDateTime(field[defaultValueName])
                  ? dayjs(field[defaultValueName])
                  : null
                : null
            }
            label={defaultLabel}
            onChange={(x) => {
              setDateTimeValue(x);
            }}
            className={
              submit && field.required && !field[defaultValueName]
                ? "Mui-error"
                : ""
            }
            ampm={getAmPm()}
            format={`${getDateFormatString(window.navigator.language)} ${
              getAmPm() ? "hh" : "HH"
            }:mm:ss${getAmPm() ? " a" : ""}`}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            slotProps={{
              textField: {
                required: field.required,
                InputLabelProps: {
                  shrink: true,
                },
              },
            }}
          />
        </LocalizationProvider>
      );
    case FieldUiTypeEnum.Date:
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} key={field.id}>
          <DatePicker
            sx={{ width: "100%" }}
            value={
              field &&
              field[defaultValueName] &&
              field[defaultValueName] != null
                ? isDateTime(field[defaultValueName])
                  ? dayjs(field[defaultValueName])
                  : null
                : null
            }
            label={defaultLabel}
            onChange={(x) => {
              setDateValue(x);
            }}
            className={
              submit && field.required && !field[defaultValueName]
                ? "Mui-error"
                : ""
            }
            format={getDateFormatString(window.navigator.language)}
            slotProps={{
              textField: {
                required: field.required,
              },
            }}
          />
        </LocalizationProvider>
      );
    case FieldUiTypeEnum.Time:
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} key={field.id}>
          <TimePicker
            sx={{ width: "100%" }}
            value={
              field && field[defaultValueName]
                ? isDateTime(getDateFromTimeString(field[defaultValueName]))
                  ? dayjs(getDateFromTimeString(field[defaultValueName]))
                  : null
                : null
            }
            label={defaultLabel}
            onChange={(x) => {
              setTimeValue(x);
            }}
            className={
              submit && field.required && !field[defaultValueName]
                ? "Mui-error"
                : ""
            }
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            ampm={getAmPm()}
            slotProps={{
              textField: {
                required: field.required,
              },
            }}
          />
        </LocalizationProvider>
      );
    case FieldUiTypeEnum.Choice:
      return field?.config?.multiple ? (
        <FormControl
          key={field.id}
          required={field.required}
          sx={{ width: "100%", mb: "5px" }}
        >
          <Autocomplete
            classes={{ paper: classes.paper }}
            key={field.id}
            multiple
            id="tags-choice"
            size="small"
            onChange={(event, newValue) => {
              setField({
                ...field,
                [defaultValueName]: (newValue as any[])
                  .map((x) => x.label)
                  .join(","),
              });
            }}
            value={
              field
                ? field[defaultValueName]
                  ? getChoiceValues(
                      field?.config?.values ?? [],
                      field[defaultValueName].split(",")
                    )
                  : []
                : []
            }
            options={field?.config?.values ?? []}
            getOptionLabel={(option: any) => option?.label}
            renderOption={(props, option, { selected }) => (
              <li
                style={{
                  backgroundColor: option.color?.bg ?? "white",
                  color: option.color?.fill ?? "black",
                  borderRadius: "60px",
                  height: 28,
                  width: "max-content",
                }}
                {...props}
              >
                {option.label}
              </li>
            )}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder=""
                label={defaultLabel}
                // error={submit && field.required && !field[defaultValueName]}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...otherProps } = getTagProps({ index });
                return (
                  <Chip
                    key={index}
                    size="small"
                    label={option.label}
                    sx={{
                      backgroundColor: option.color?.bg || "white",
                      color: option.color?.fill ?? "black",
                      width: "max-content",
                      "& .MuiChip-deleteIcon": {
                        color: option.color?.fill ?? "black",
                      },
                    }}
                    {...otherProps}
                  />
                );
              })
            }
          />
        </FormControl>
      ) : (
        <FormControl
          key={field.id}
          required={field.required}
          sx={{ width: "100%" }}
        >
          <InputLabel id={`${field.id}`} sx={{ top: "-5px" }}>
            {defaultLabel}
          </InputLabel>
          <Select
            // sx={{ width: '100%' }}
            key={field.id}
            label={defaultLabel}
            id={`${field.id}`}
            value={
              field && field[defaultValueName] ? field[defaultValueName] : ""
            }
            onChange={(e) => {
              return setField({
                ...field,
                [defaultValueName]: e.target.value,
              });
            }}
            size="small"
            // error={submit && field.required && !field[defaultValueName]}
            fullWidth
            sx={{
              display: "flex",
            }}
            MenuProps={{
              sx: {
                "& .MuiMenu-list": {
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: "wrap",
                  maxWidth: 452,
                  gap: 1,
                  p: 1,
                },
              },
            }}
          >
            {field?.config?.values &&
              field.config.values.map((choice: any) => (
                <MenuItem
                  key={choice.id}
                  value={choice.label}
                  sx={{
                    backgroundColor: choice.color?.bg ?? "white",
                    color: choice.color?.fill ?? "black",
                    borderRadius: "20px",
                    width: { xs: "100%", sm: "max-content" },
                    minHeight: 24,
                    "&:hover": {
                      backgroundColor: choice.color?.bg ?? "white",
                    },
                  }}
                >
                  {choice.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      );
    case FieldUiTypeEnum.Boolean:
      return (
        <div className="focusedNeed" tabIndex={8}>
          <Box
            className="booleanBox"
            sx={{
              border: "1px solid rgba(158, 158, 158, 0.32)",
              p: 1,
              px: 2,
              position: "relative",
              borderRadius: "6px",
              ".focusedNeed:focus &": {
                border: "2px solid #1976d2",
              },
              "&:hover": {
                border: "1px solid rgba(0, 0, 0, 0.87)",
              },
            }}
          >
            <Typography
              variant="body2"
              component={"label"}
              sx={{
                textTransform: "capitalize",
                fontSize: 12,
                position: "absolute",
                top: "-10px",
                left: "10px",
                background: theme.palette.palette_style.background.default,
                color:
                  theme.palette.mode === "light"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.7)",
                zIndex: 2,
                px: 0.5,
                ".focusedNeed:focus &": {
                  color: "#1976d2",
                  top: "-11px",
                  left: "9px",
                },
              }}
            >
              {field.name} {field.required ? "*" : ""}
            </Typography>
            <Box
              className="booleanWrapper"
              sx={{
                ".focusedNeed:focus &": {
                  margin: "-1px",
                },
              }}
            >
              <FormControlLabel
                key={field.id}
                control={
                  <SwitchBox
                    checked={
                      field &&
                      field[defaultValueName] &&
                      field[defaultValueName] == "true"
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      setField({
                        ...field,
                        [defaultValueName]: e.target.checked ? "true" : "false",
                      })
                    }
                    checkedColor={field?.config?.values?.length ? field?.config?.values[0].color.bg : colors[8].bg}
                    uncheckedColor={field?.config?.values?.length ? field?.config?.values[1].color.bg : colors[7].bg}
                  />
                }
                label={defaultLabel}
              />
            </Box>
          </Box>
        </div>
      );
    case FieldUiTypeEnum.Markdown:
      return (
        <MarkdownEditor
          key={field.id}
          id={field.id}
          name={defaultLabel}
          value={
            field && field[defaultValueName] ? field[defaultValueName] : ""
          }
          handleChange={(newValue: string) => {
            setField({ ...field, [defaultValueName]: newValue });
          }}
        />
      );
    case FieldUiTypeEnum.HTML:
      return (
        <HTMLEditor
          id={field.id}
          key={field.id}
          name={defaultLabel}
          value={
            field && field[defaultValueName] ? field[defaultValueName] : ""
          }
          handleChange={(newValue: string) => {
            setField({ ...field, [defaultValueName]: newValue });
          }}
        />
      );
    case FieldUiTypeEnum.Image:
      return (
        <Box
          className="focusedNeed"
          key={field.id}
          sx={{
            border: "1px solid rgba(158, 158, 158, 0.32)",
            p: 2,
            position: "relative",
            borderRadius: "6px",
            "&:hover": {
              border: "1px solid rgba(0, 0, 0, 0.87)",
            },
          }}
        >
          <Typography
            variant="body2"
            component={"label"}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
              position: "absolute",
              top: "-10px",
              left: "10px",
              background: theme.palette.palette_style.background.default,
              color:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(255, 255, 255, 0.7)",
              zIndex: 2,
              px: 0.5,
            }}
          >
            {field.name} {field.required ? "*" : ""}
          </Typography>
          <UploadButton
            viewId={viewId}
            translations={translations}
            fileAcceptTypes={["png", "jpg", "jpeg", "gif"]}
            file={
              getFileValue()
              //  field && field.typedDefaultValue
              //   ? field.typedDefaultValue instanceof File
              //     ? field.typedDefaultValue
              //     : field[defaultValueName]
              //     ? imageStringToJSON(field[defaultValueName])
              //     : undefined
              //   : undefined
            }
            onUpload={(file) => {
              setField({
                ...field,
                typedDefaultValue: file
                  ? createFileObject(file.name, file, file.type, file.size)
                  : undefined,
              });
              if (!file) {
                setField({
                  ...field,
                  defaultValue: undefined,
                });
              }
            }}
            type="image"
            fieldId={field.id}
          />
        </Box>
      );
    case FieldUiTypeEnum.Video:
      return (
        <Box
          className="focusedNeed"
          key={field.id}
          sx={{
            border: "1px solid rgba(158, 158, 158, 0.32)",
            p: 2,
            position: "relative",
            borderRadius: "6px",
            "&:hover": {
              border: "1px solid rgba(0, 0, 0, 0.87)",
            },
          }}
        >
          <Typography
            variant="body2"
            component={"label"}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
              position: "absolute",
              top: "-10px",
              left: "10px",
              background: theme.palette.palette_style.background.default,
              color:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(255, 255, 255, 0.7)",
              zIndex: 2,
              px: 0.5,
            }}
          >
            {field.name} {field.required ? "*" : ""}
          </Typography>
          <UploadButton
            viewId={viewId}
            translations={translations}
            fileAcceptTypes={["mp4", "mov", "wmv", "flv", "avi", "mkv", "webm"]}
            file={
              getFileValue()
              // field && field.typedDefaultValue
              //   ? field.typedDefaultValue instanceof File
              //     ? field.typedDefaultValue
              //     : field[defaultValueName]
              //     ? imageStringToJSON(field[defaultValueName])
              //     : undefined
              //   : undefined
            }
            onUpload={(file) => {
              setField({
                ...field,
                typedDefaultValue: file
                  ? createFileObject(file.name, file, file.type, file.size)
                  : undefined,
              });
              if (!file) {
                setField({
                  ...field,
                  defaultValue: undefined,
                });
              }
            }}
            type="video"
            fieldId={field.id}
          />
        </Box>
      );
    case FieldUiTypeEnum.Document:
      return (
        <Box
          className="focusedNeed"
          key={field.id}
          sx={{
            border: "1px solid rgba(158, 158, 158, 0.32)",
            p: 2,
            position: "relative",
            borderRadius: "6px",
            "&:hover": {
              border: "1px solid rgba(0, 0, 0, 0.87)",
            },
          }}
        >
          <Typography
            variant="body2"
            component={"label"}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
              position: "absolute",
              top: "-10px",
              left: "10px",
              background: theme.palette.palette_style.background.default,
              color:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(255, 255, 255, 0.7)",
              zIndex: 2,
              px: 0.5,
            }}
          >
            {field.name} {field.required ? "*" : ""}
          </Typography>
          <UploadButton
            viewId={viewId}
            translations={translations}
            fileAcceptTypes={documentAcceptFiles}
            file={
              getFileValue()
              // field && field.typedDefaultValue
              //   ? field.typedDefaultValue instanceof File
              //     ? field.typedDefaultValue
              //     : field[defaultValueName]
              //     ? imageStringToJSON(field[defaultValueName])
              //     : undefined
              //   : undefined
            }
            onUpload={(file) => {
              setField({
                ...field,
                typedDefaultValue: file
                  ? createFileObject(file.name, file, file.type, file.size)
                  : undefined,
              });
            }}
            type="doc"
            fieldId={field.id}
          />
        </Box>
      );
    case FieldUiTypeEnum.Color:
      return (
        <Box
          key={field.id}
          sx={{
            width: "100%",
            border: "1px solid rgba(158, 158, 158, 0.32)",
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            borderRadius: "6px",
            "&:hover": {
              border: "1px solid rgba(0, 0, 0, 0.87)",
            },
          }}
        >
          <Typography
            variant="body2"
            component={"label"}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
              position: "absolute",
              top: "-10px",
              left: "10px",
              background: theme.palette.palette_style.background.default,
              color:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.6)"
                  : "rgba(255, 255, 255, 0.7)",
              zIndex: 2,
              px: 0.5,
              ".focusedNeed:focus &": {},
            }}
          >
            {defaultLabel}
          </Typography>
          <ColorPicker
            selectedColor={
              field && field[defaultValueName]
                ? field[defaultValueName]
                : "#000000"
            }
            onColorChange={(color) => {
              setField({ ...field, [defaultValueName]: color });
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 2,
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor:
                  field && field[defaultValueName]
                    ? field[defaultValueName]
                    : "#000000",
                display: "grid",
                placeContent: "center",
                borderRadius: "100px",
                cursor: "pointer",
                position: "relative",
              }}
            ></div>
            <span
              style={{
                color:
                  field && field[defaultValueName]
                    ? field[defaultValueName]
                    : "#000000",
                backgroundColor: "#fff",
                borderRadius: "8px",
                paddingInline: 8,
                fontSize: 14,
              }}
            >
              {field && field[defaultValueName]
                ? field[defaultValueName]
                : "#000000"}
            </span>
          </Box>
        </Box>
      );
    case FieldUiTypeEnum.Rating:
      return (
        <Box
          key={field.id}
          sx={{
            border: "1px solid rgba(158, 158, 158, 0.32)",
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            borderRadius: "6px",
            "&:hover": {
              border: "1px solid rgba(0, 0, 0, 0.87)",
            },
          }}
        >
          <Typography
            variant="body2"
            component={"label"}
            sx={{
              textTransform: "capitalize",
              fontSize: 12,
              position: "absolute",
              top: "-10px",
              left: "10px",
              background: "#fff",
              zIndex: 2,
              px: 0.5,
              color: "rgba(0, 0, 0, 0.6)",
              ".focusedNeed:focus &": {},
            }}
          >
            {field.name} {field.required ? "*" : ""}
          </Typography>
          <Box
            sx={{
              py: 1,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <RatingField onRatingChange={handleRatingChange} />
            <CheckboxRating />
            <NumericRating />
          </Box>
        </Box>
      );
    case FieldUiTypeEnum.Lookup:
      return field.config?.values?.viewId &&
        field.config?.values?.rightFieldId ? (
        <LookupContentSelector
          label={defaultLabel}
          isEdit={true}
          submit={false}
          valueKey={defaultValueName}
          values={field[defaultValueName]}
          setValues={(values: any) => {
            setField({ ...field, [defaultValueName]: values });
          }}
          lookupConfig={field.config.values}
        />
      ) : (
        <></>
      );
    case FieldUiTypeEnum.Sublist:
      return field.config?.values?.viewId &&
        field.config?.values?.rightFieldId ? (
        <SublistContentSelector
          label={defaultLabel}
          isEdit={true}
          submit={false}
          valueKey={defaultValueName}
          values={
            field[defaultValueName] ? parseToJson(field[defaultValueName]) : []
          }
          setValues={(values: any[]) => {
            setField({ ...field, [defaultValueName]: JSON.stringify(values) });
          }}
          sublistConfig={field.config.values}
        />
      ) : (
        <></>
      );
    case FieldUiTypeEnum.Link:
      return (
        <LinkFieldInput
          mode={"create"}
          column={field}
          name={defaultLabel}
          selectedLink={
            field && field[defaultValueName]
              ? linkStringToJSON(field[defaultValueName] as string)
              : { linkValue: "", name: "" }
          }
          onLinkChange={(value: any) => {
            setField({ ...field, [defaultValueName]: JSON.stringify(value) });
          }}
        />
      );
    case FieldUiTypeEnum.User:
      return (
        <Box key={field.id} sx={{ width: "100%" }}>
          <ViewUserSelect
            isModeView={false}
            selectedUserData={field[defaultValueName] as string}
            setSelectedUserData={(userData: string) => {
              setField({ ...field, [defaultValueName]: userData });
            }}
            name={defaultLabel}
            isMultiple={field.config?.multiple}
          />
        </Box>
      );
    default:
      return <div key={field.id}></div>;
  }
};

const mapStateToProps = (state: any) => ({});

export default connect(mapStateToProps)(RenderFieldDefault);
