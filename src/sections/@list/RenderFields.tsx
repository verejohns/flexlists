import {
  TextField,
  Box,
  FormControlLabel,
  Typography,
  Link,
  FormGroup,
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
  downloadFileUrl,
  getChoiceField,
  getChoiceValues,
  getDataColumnId,
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
  getLocalDateTimeFromString,
  getLocalDateFromString,
  getDateFormatString,
  getDifferenceWithCurrent,
  utcFormat,
  getDifferenceDateWithCurrent,
} from "src/utils/convertUtils";
import { DatePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MarkdownEditor from "src/components/rowedit/MarkdownEditor";
import HTMLEditor from "src/components/rowedit/HTMLEditor";
import UploadButton from "src/components/upload/UploadButton";
import ReactPlayer from "react-player";
import ColorPicker from "src/components/color-picker/ColorPicker";
import LookupField from "src/components/relation/LookupField";
import SublistField from "src/components/relation/SublistField";
import LinkFieldInput from "./fields/LinkFieldInput";
import RatingField from "src/components/rating-field/RatingField";
import DisplayRating from "src/components/rating-field/DisplayRating";
import CheckboxRating from "src/components/rating-field/CheckboxRating";
import NumericRating from "src/components/rating-field/NumericRating";
import { TranslationText } from "src/models/SharedModels";
import { getTranslation } from "src/utils/i18n";
import ViewUserSelect from "../user/ViewUserSelect";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import utc from "dayjs/plugin/utc";
import { documentAcceptFiles } from "src/utils/fileUtils";
import { createFileObject, FileImpl } from "flexlists-api";
import SwitchBox from "src/components/switch/SwitchBox";
import { colors } from "src/sections/@list/fieldConfig/ChoiceConfig";

dayjs.extend(utc);

type RenderFieldProps = {
  column: ViewField;
  isPrint?: boolean;
  currentMode: string;
  values: any;
  submit: boolean;
  columns: any[];
  translations: TranslationText[];
  viewId: number;
  errors?: { [key: string]: boolean };
  setValues: (values: any[]) => void;
  setErrors?: (errors: { [key: string]: boolean }) => void;
};

const RenderField = ({
  column,
  isPrint = false,
  currentMode,
  values,
  submit,
  columns,
  translations,
  viewId,
  errors,
  setValues,
  setErrors,
}: RenderFieldProps) => {
  const t = (key: string): string => {
    return getTranslation(key, translations);
  };
  const isDesktop = useResponsive("up", "md");
  const [rating, setRating] = useState<number | null>(null);

  const handleRatingChange = (newValue: number | null) => {
    setRating(newValue);
  };

  const setDateValue = (columnId: number, date: Dayjs | null) => {
    try {
      if (!date || typeof date === "string") {
        onSetValues({ ...values, [columnId]: date });

        return;
      }

      const dateString = date.format(utcFormat);
      
      onSetValues({ ...values, [columnId]: dateString });
    } catch (e) { }
  };

  const setTimeValue = (columnId: number, time: Dayjs | null) => {
    onSetValues({
      ...values,
      [columnId]: time ? time.format(utcFormat) : null,
    });
  };

  const setDateTimeValue = (columnId: number, date: Dayjs | Date | null) => {
    try {
      if (!date || typeof date === "string") {
        onSetValues({ ...values, [columnId]: date });

        return;
      }

      onSetValues({ ...values, [columnId]: date.toISOString() });
    } catch (e) { }
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

  const isError = (): boolean => {
    return submit && errors && errors[column.id] ? true : false;
  };

  const onSetValues = (newValues: any) => {
    setValues(newValues);
    if (setErrors) {
      let _errors = Object.assign({}, errors);
      if (errors && errors[column.id]) {
        delete _errors[column.id];
        setErrors(_errors);
      }
    }
  };

  switch (column.uiField) {
    case FieldUiTypeEnum.Text:
      return currentMode !== "view" && !isPrint ? (
        <TextField
          key={column.id}
          style={{ width: "100%" }}
          label={column.name}
          InputLabelProps={{ shrink: true }}
          name={`${column.id}`}
          // size="small"
          type={"text"}
          onChange={(e) => {
            onSetValues({ ...values, [column.id]: e.target.value });
          }}
          value={values && values[column.id] ? values[column.id] : ""}
          rows={4}
          required={column.required}
          error={isError()}
        />
      ) : (
        <div key={column.id}>
          <TextField
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            label={column.name}
            value={values ? values[column.id]?.toString() : ""}
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
                borderWidth: "1px !important",
              },
              "& .Mui-focused.MuiFormLabel-root": {
                background: theme.palette.palette_style.background.default,
                color:
                  theme.palette.mode === "light"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.7)",
              },
            }}
            multiline
          />
        </div>
      );
    case FieldUiTypeEnum.LongText:
      return currentMode !== "view" && !isPrint ? (
        <TextField
          key={column.id}
          label={column.name}
          name={`${column.id}`}
          InputLabelProps={{ shrink: true }}
          size="small"
          type={"text"}
          onChange={(e) => {
            onSetValues({ ...values, [column.id]: e.target.value });
          }}
          value={values && values[column.id] ? values[column.id] : ""}
          minRows={4}
          maxRows={Infinity}
          multiline={true}
          required={column.required}
          error={isError()}
          fullWidth
        />
      ) : (
        <div key={column.id}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            label={column.name}
            value={values && values[column.id] ? values[column.id] : ""}
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
                borderWidth: "1px !important",
              },
              "& .Mui-focused.MuiFormLabel-root": {
                background: theme.palette.palette_style.background.default,
                color:
                  theme.palette.mode === "light"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </div>
      );
    case FieldUiTypeEnum.Integer:
    case FieldUiTypeEnum.Double:
    case FieldUiTypeEnum.Decimal:
    case FieldUiTypeEnum.Float:
    case FieldUiTypeEnum.Percentage:
    case FieldUiTypeEnum.Money:
      return currentMode !== "view" && !isPrint ? (
        <TextField
          key={column.id}
          label={column.name}
          InputLabelProps={{ shrink: true }}
          name={`${column.id}`}
          size="small"
          type={"number"}
          onChange={(e) => {
            onSetValues({ ...values, [column.id]: e.target.value });
          }}
          value={
            values &&
              values[column.id] !== null &&
              values[column.id] !== undefined
              ? values[column.id]
              : ""
          }
          rows={4}
          required={column.required}
          error={isError()}
          fullWidth
        />
      ) : (
        <div key={column.id}>
          <TextField
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            label={column.system ? t(column.name) : column.name}
            value={
              values && values[getDataColumnId(column.id, columns)]
                ? values[getDataColumnId(column.id, columns)]
                : ""
            }
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
                borderWidth: "1px !important",
              },
              "& .Mui-focused.MuiFormLabel-root": {
                background: theme.palette.palette_style.background.default,
                color:
                  theme.palette.mode === "light"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </div>
      );
    case FieldUiTypeEnum.DateTime:
      return currentMode !== "view" && !isPrint ? (
        <LocalizationProvider dateAdapter={AdapterDayjs} key={column.id}>
          <DateTimePicker
            sx={{ width: "100%" }}
            value={
              values && values[column.id] && values[column.id] != null
                ? dayjs(values[column.id])
                : null
            }
            label={column.name}
            onChange={(x) => {
              setDateTimeValue(column.id, x);
            }}
            className={isError() ? "Mui-error" : ""}
            ampm={getAmPm()}
            format={`${getDateFormatString(window.navigator.language)} ${getAmPm() ? "hh" : "HH"
              }:mm:ss${getAmPm() ? " a" : ""}`}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            slotProps={{
              textField: {
                required: column.required,
                InputLabelProps: {
                  shrink: true,
                },
              },
            }}
          />
        </LocalizationProvider>
      ) : (
        <div key={column.id}>
          <TextField
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            label={column.system ? t(column.name) : column.name}
            value={
              values && values[getDataColumnId(column.id, columns)]
                ? `${getLocalDateTimeFromString(
                  values[getDataColumnId(column.id, columns)]
                )} (${getDifferenceWithCurrent(
                  values[getDataColumnId(column.id, columns)]
                )})`
                : ""
            }
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
                borderWidth: "1px !important",
              },
              "& .Mui-focused.MuiFormLabel-root": {
                background: theme.palette.palette_style.background.default,
                color:
                  theme.palette.mode === "light"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </div>
      );
    case FieldUiTypeEnum.Date:
      return currentMode !== "view" && !isPrint ? (
        <LocalizationProvider dateAdapter={AdapterDayjs} key={column.id}>
          <DatePicker
            sx={{ width: "100%" }}
            value={
              values && values[column.id] && values[column.id] != null
                ? dayjs(values[column.id], { utc: true })
                : null
            }
            label={column.name}
            onChange={(x) => {
              setDateValue(column.id, x);
            }}
            className={isError() ? "Mui-error" : ""}
            format={getDateFormatString(window.navigator.language)}
            slotProps={{
              textField: {
                required: column.required,
              },
            }}
          />
        </LocalizationProvider>
      ) : (
        <div key={column.id}>
          <TextField
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
            label={column.name}
            value={
              values && values[getDataColumnId(column.id, columns)]
                ? `${getLocalDateFromString(
                  values[getDataColumnId(column.id, columns)]
                )} (${getDifferenceDateWithCurrent(
                  values[getDataColumnId(column.id, columns)]
                )})`
                : ""
            }
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(158, 158, 158, 0.32) !important",
                borderWidth: "1px !important",
              },
              ".MuiFormLabel-root": {
                background: theme.palette.palette_style.background.default,
                color:
                  theme.palette.mode === "light"
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </div>
      );
    case FieldUiTypeEnum.Time:
      return currentMode !== "view" && !isPrint ? (
        <LocalizationProvider dateAdapter={AdapterDayjs} key={column.id}>
          <TimePicker
            sx={{ width: "100%" }}
            value={
              values && values[column.id]
                ? dayjs(values[column.id], { utc: true })
                : null
            }
            label={column.name}
            onChange={(x) => {
              setTimeValue(column.id, x);
            }}
            className={isError() ? "Mui-error" : ""}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            ampm={getAmPm()}
            slotProps={{
              textField: {
                required: column.required,
              },
            }}
          />
        </LocalizationProvider>
      ) : (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs} key={column.id}>
            <TimePicker
              readOnly={true}
              value={
                values && values[column.id]
                  ? dayjs(values[column.id], { utc: true })
                  : null
              }
              label={column.name}
              onChange={(x) => {
                setTimeValue(column.id, x);
              }}
              className={
                submit && column.required && !values[column.id]
                  ? "Mui-error"
                  : ""
              }
              ampm={getAmPm()}
              sx={{
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(158, 158, 158, 0.32) !important",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(158, 158, 158, 0.32) !important",
                  borderWidth: "1px !important",
                },
                ".MuiFormLabel-root": {
                  background: theme.palette.palette_style.background.default,
                  color:
                    theme.palette.mode === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                },
              }}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              slotProps={{
                textField: {
                  required: column.required,
                },
              }}
            />
          </LocalizationProvider>
        </>
      );
    case FieldUiTypeEnum.Choice:
      if (currentMode !== "view" && !isPrint) {
        return column?.config?.multiple ? (
          <FormControl
            key={column.id}
            required={column.required}
            sx={{ width: "100%", mb: "5px" }}
          >
            <Autocomplete
              classes={{ paper: classes.paper }}
              key={column.id}
              multiple
              id="tags-choice"
              size="small"
              onChange={(event, newValue) => {
                onSetValues({
                  ...values,
                  [column.id]: (newValue as any[])
                    .map((x) => x.label)
                    .join(","),
                });
              }}
              value={
                values
                  ? values[column.id]
                    ? getChoiceValues(
                      column?.config?.values,
                      values[column.id].split(",")
                    )
                    : []
                  : []
              }
              options={column?.config?.values}
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
                  label={column.name}
                  error={isError()}
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
            key={column.id}
            required={column.required}
            sx={{ width: "100%" }}
          >
            <InputLabel id={`${column.id}`} sx={{ top: "-5px" }}>
              {column.name}
            </InputLabel>
            <Select
              // sx={{ width: '100%' }}
              key={column.id}
              label={column.name}
              id={`${column.id}`}
              value={
                values && values[column.id]
                  ? values[column.id]
                  : currentMode === "create"
                    ? column?.config?.values?.[0]?.label
                    : ""
              }
              onChange={(e) => {
                return onSetValues({
                  ...values,
                  [column.id]: e.target.value,
                });
              }}
              size="small"
              error={isError()}
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
              {column?.config?.values &&
                column.config.values.map((choice: any) => (
                  <MenuItem
                    key={choice.id}
                    value={choice.label}
                    sx={{
                      backgroundColor: choice.color?.bg ?? "white",
                      color: choice.color?.fill ?? "black",
                      borderRadius: "20px",
                      border: "2px solid transparent",
                      width: { xs: "100%", sm: "max-content" },
                      minHeight: 24,
                      "&:hover": {
                        backgroundColor: choice.color?.bg ?? "white",
                        border: `2px solid ${theme.palette.palette_style.text.selected}`,
                      },
                      "&.Mui-selected": {
                        backgroundColor: choice.color?.bg ?? "white",
                        border: `2px solid ${theme.palette.palette_style.text.selected}`,
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: choice.color?.bg ?? "white",
                        border: `2px solid ${theme.palette.palette_style.text.selected}`,
                      },
                    }}
                  >
                    {choice.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );
      } else {
        const choice = getChoiceField(values[column.id], column);
        return (
          <div key={column.id}>
            <TextField
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
              label={column.name}
              value={choice?.map((x) => x.label)?.join(", ")}
              sx={{
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(158, 158, 158, 0.32) !important",
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(158, 158, 158, 0.32) !important",
                  borderWidth: "1px !important",
                },
                ".MuiFormLabel-root": {
                  background: theme.palette.palette_style.background.default,
                  color:
                    theme.palette.mode === "light"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(255, 255, 255, 0.7)",
                },
              }}
            />
          </div>
        );
      }
    case FieldUiTypeEnum.Boolean:
      return currentMode !== "view" && !isPrint ? (
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
              {column.name} {column.required ? "*" : ""}
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
                key={column.id}
                control={
                  <SwitchBox
                    checked={
                      values && values[column.id] ? values[column.id] : false
                    }
                    onChange={(e) => {
                      onSetValues({ ...values, [column.id]: e.target.checked });
                    }}
                    checkedColor={column?.config?.values?.length ? column?.config?.values[0].color.bg : colors[8].bg}
                    uncheckedColor={column?.config?.values?.length ? column?.config?.values[1].color.bg : colors[7].bg}
                  />
                }
                label={column.name}
              />
            </Box>
          </Box>
        </div>
      ) : (
        <div key={column.id} className="focusedNeed" tabIndex={8}>
          <Box
            key={column.id}
            className="booleanBox"
            sx={{
              border: "1px solid rgba(158, 158, 158, 0.32)",
              p: 1,
              px: 2,
              position: "relative",
              borderRadius: "6px",
              ".focusedNeed:focus &": {},
              "&:hover": {
                border: "1px solid rgba(158, 158, 158, 0.32)",
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
              {column.system ? t(column.name) : column.name}
            </Typography>
            <Box
              className="booleanWrapper"
              sx={{
                ".focusedNeed:focus &": {
                  // margin: "-1px",
                },
              }}
            >
              <FormGroup>
                <FormControlLabel
                  disabled
                  control={
                    <SwitchBox
                      checked={values[column.id]}
                      checkedColor={column?.config?.values?.length ? column?.config?.values[0].color.bg : colors[8].bg}
                      uncheckedColor={column?.config?.values?.length ? column?.config?.values[1].color.bg : colors[7].bg}
                    />
                  }
                  label={
                    values && values[column.id]?.toString() === "true"
                      ? "Yes"
                      : "No"
                  }
                />
              </FormGroup>
            </Box>
          </Box>
        </div>
      );
    case FieldUiTypeEnum.Markdown:
      return (
        <MarkdownEditor
          key={column.id}
          id={column.id}
          name={`${column.name} ${column.required ? "*" : ""}`}
          value={values && values[column.id] ? values[column.id] : null}
          handleChange={(newValue: string) => {
            onSetValues({ ...values, [column.id]: newValue });
          }}
          preview={currentMode === "view" || isPrint}
          isError={isError()}
        />
      );
    case FieldUiTypeEnum.HTML:
      return (
        <HTMLEditor
          id={column.id}
          key={column.id}
          name={`${column.name} ${column.required ? "*" : ""}`}
          value={values && values[column.id] ? values[column.id] : null}
          handleChange={(newValue: string) => {
            onSetValues({ ...values, [column.id]: newValue });
          }}
          preview={currentMode === "view" || isPrint}
          isError={isError()}
        />
      );
    case FieldUiTypeEnum.Image:
      return currentMode !== "view" && !isPrint ? (
        <Box
          className="focusedNeed imageFieldRender"
          key={column.id}
          sx={{
            border: isError() ? `1px solid ${theme.palette.palette_style.error.main}` : "1px solid rgba(158, 158, 158, 0.32)",
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
              color: isError() ? theme.palette.palette_style.error.main : theme.palette.palette_style.text.renderFieldLabel,
              zIndex: 2,
              px: 0.5,
            }}
          >
            {column.name} {column.required ? "*" : ""}
          </Typography>
          <UploadButton
            viewId={viewId}
            translations={translations}
            fileAcceptTypes={["png", "jpg", "jpeg", "gif"]}
            file={
              values && values[column.id]
                ? values[column.id] instanceof FileImpl
                  ? (values[column.id] as any).data
                  : (imageStringToJSON(values[column.id]) as any)
                : undefined
            }
            onUpload={(file) => {
              onSetValues({
                ...values,
                [column.id]: file
                  ? createFileObject(file.name, file, file.type, file.size)
                  : undefined,
              });
            }}
            type="image"
            fieldId={column.id}
          />
        </Box>
      ) : (
        <div className="focusedNeed" tabIndex={8}>
          <Box
            key={column.id}
            className="markdownBox"
            sx={{
              border: "1px solid rgba(158, 158, 158, 0.32)",
              p: 2,
              position: "relative",
              borderRadius: "6px",
              ".focusedNeed:focus &": {
                // border: "2px solid #1976d2",
              },
              "&:hover": {
                // border: "1px solid rgba(0, 0, 0, 0.87)",
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
                  // color: "#1976d2",
                  // top: "-11px",
                  // left: "9px",
                },
              }}
            >
              {column.name}
            </Typography>
            <Link
              href={
                values &&
                  values[column.id] &&
                  imageStringToJSON(values[column.id])?.fileId
                  ? downloadFileUrl(
                    imageStringToJSON(values[column.id])?.fileId,
                    viewId,
                    column.id
                  )
                  : "#"
              }
            >
              <Box
                className="imageWrapper"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  ".focusedNeed:focus &": {
                    // margin: "-1px",
                  },
                }}
                component="img"
                alt=""
                src={
                  values &&
                    values[column.id] &&
                    imageStringToJSON(values[column.id])?.fileId
                    ? downloadFileUrl(
                      imageStringToJSON(values[column.id])?.fileId,
                      viewId,
                      column.id
                    )
                    : ""
                }
              />

              {/* {values[column.id].fileName} */}
            </Link>
          </Box>
        </div>
      );
    case FieldUiTypeEnum.Video:
      return currentMode !== "view" && !isPrint ? (
        <Box
          className="focusedNeed"
          key={column.id}
          sx={{
            border: isError() ? `1px solid ${theme.palette.palette_style.error.main}` : "1px solid rgba(158, 158, 158, 0.32)",
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
              color: isError() ? theme.palette.palette_style.error.main : theme.palette.palette_style.text.renderFieldLabel,
              zIndex: 2,
              px: 0.5,
            }}
          >
            {column.name} {column.required ? "*" : ""}
          </Typography>
          <UploadButton
            viewId={viewId}
            translations={translations}
            fileAcceptTypes={["mp4", "mov", "wmv", "flv", "avi", "mkv", "webm"]}
            file={
              values && values[column.id]
                ? values[column.id] instanceof FileImpl
                  ? (values[column.id] as any).data
                  : (imageStringToJSON(values[column.id]) as any)
                : undefined
            }
            onUpload={(file) => {
              onSetValues({
                ...values,
                [column.id]: file
                  ? createFileObject(file.name, file, file.type, file.size)
                  : undefined,
              });
            }}
            type="video"
            fieldId={column.id}
          />
        </Box>
      ) : (
        <div className="focusedNeed" tabIndex={8}>
          <Box
            key={column.id}
            className="markdownBox"
            sx={{
              border: "1px solid rgba(158, 158, 158, 0.32)",
              p: 2,
              position: "relative",
              borderRadius: "6px",
              ".focusedNeed:focus &": {
                // border: "2px solid #1976d2",
              },
              "&:hover": {
                // border: "1px solid rgba(0, 0, 0, 0.87)",
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
                  // color: "#1976d2",
                  // top: "-11px",
                  // left: "9px",
                },
              }}
            >
              {column.name}
            </Typography>
            <Box
              className="markdownWrapper"
              sx={{
                ".focusedNeed:focus &": {
                  // margin: "-1px",
                },
              }}
            >
              <ReactPlayer
                url={
                  values &&
                    values[column.id] &&
                    imageStringToJSON(values[column.id])?.fileId
                    ? downloadFileUrl(
                      imageStringToJSON(values[column.id])?.fileId,
                      viewId,
                      column.id
                    )
                    : ""
                }
                width="100%"
                height="auto"
                controls
              />
            </Box>
          </Box>
        </div>
      );
    case FieldUiTypeEnum.Document:
      return currentMode !== "view" && !isPrint ? (
        <Box
          className="focusedNeed"
          key={column.id}
          sx={{
            border: isError() ? `1px solid ${theme.palette.palette_style.error.main}` : "1px solid rgba(158, 158, 158, 0.32)",
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
              color: isError() ? theme.palette.palette_style.error.main : theme.palette.palette_style.text.renderFieldLabel,
              zIndex: 2,
              px: 0.5,
            }}
          >
            {column.name} {column.required ? "*" : ""}
          </Typography>
          <UploadButton
            viewId={viewId}
            translations={translations}
            fileAcceptTypes={documentAcceptFiles}
            file={
              values && values[column.id]
                ? values[column.id] instanceof FileImpl
                  ? (values[column.id] as any).data
                  : (imageStringToJSON(values[column.id]) as any)
                : undefined
            }
            onUpload={(file) => {
              onSetValues({
                ...values,
                [column.id]: file
                  ? createFileObject(file.name, file, file.type, file.size)
                  : undefined,
              });
            }}
            type="doc"
            fieldId={column.id}
          />
        </Box>
      ) : (
        <div className="focusedNeed" tabIndex={8}>
          <Box
            key={column.id}
            className="markdownBox"
            sx={{
              border: "1px solid rgba(158, 158, 158, 0.32)",
              p: 2,
              position: "relative",
              borderRadius: "6px",
              ".focusedNeed:focus &": {
                // border: "2px solid #1976d2",
              },
              "&:hover": {
                // border: "1px solid rgba(0, 0, 0, 0.87)",
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
                  // color: "#1976d2",
                  // top: "-11px",
                  // left: "9px",
                },
              }}
            >
              {column.name}
            </Typography>
            <Box
              className="markdownWrapper"
              sx={{
                ".focusedNeed:focus &": {
                  margin: "-1px",
                },
              }}
            >
              {values && imageStringToJSON(values[column.id]) ? (
                <Link
                  href={downloadFileUrl(
                    imageStringToJSON(values[column.id])?.fileId,
                    viewId,
                    column.id
                  )}
                >
                  {imageStringToJSON(values[column.id])?.fileName}
                </Link>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </div>
      );
    case FieldUiTypeEnum.Color:
      if (currentMode !== "view" && !isPrint) {
        return (
          <Box
            key={column.id}
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
              {column.name} {column.required ? "*" : ""}
            </Typography>
            <ColorPicker
              selectedColor={
                values && values[column.id] ? values[column.id] : "#000000"
              }
              onColorChange={(color) => {
                onSetValues({ ...values, [column.id]: color });
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
                    values && values[column.id] ? values[column.id] : "#000000",
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
                    values && values[column.id] ? values[column.id] : "#000000",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  paddingInline: 8,
                  fontSize: 14,
                }}
              >
                {values && values[column.id] ? values[column.id] : "#000000"}
              </span>
            </Box>
          </Box>
        );
      } else {
        return (
          <div className="focusedNeed" tabIndex={8}>
            <Box
              key={column.id}
              className="markdownBox"
              sx={{
                border: "1px solid rgba(158, 158, 158, 0.32)",
                p: 2,
                position: "relative",
                borderRadius: "6px",
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
                {column.name}
              </Typography>
              <Box
                key={column.id}
                sx={{
                  // textAlign: "center",
                  // bgcolor: values[column.id],
                  color:
                    values && values[column.id] ? values[column.id] : "#000000",
                  // px: 10,
                  // maxWidth: 100,
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor:
                      values && values[column.id]
                        ? values[column.id]
                        : "#000000",
                    // display: "grid",
                    // placeContent: "center",
                    borderRadius: "100px",
                    // cursor: "pointer",
                  }}
                // onClick={handleColorPickerToggle}
                ></div>
                <span
                  style={{
                    color:
                      values && values[column.id]
                        ? values[column.id]
                        : "#000000",
                  }}
                >
                  {values && values[column.id] ? values[column.id] : "#000000"}
                </span>

                {/* {values[column.id]} */}
              </Box>
            </Box>
          </div>
        );
      }
    case FieldUiTypeEnum.Rating:
      if (currentMode !== "view" && !isPrint) {
        return (
          <Box
            key={column.id}
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
              {column.name} {column.required ? "*" : ""}
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
      } else {
        return (
          <>
            <div className="focusedNeed" tabIndex={8}>
              <Box
                key={column.id}
                className="markdownBox"
                sx={{
                  border: "1px solid rgba(158, 158, 158, 0.32)",
                  p: 2,
                  position: "relative",
                  borderRadius: "6px",
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
                  {column.name}
                </Typography>
              </Box>
            </div>

            <div className="focusedNeed" tabIndex={8}>
              <Box
                key={column.id}
                className="markdownBox"
                sx={{
                  border: "1px solid rgba(158, 158, 158, 0.32)",
                  p: 2,
                  position: "relative",
                  borderRadius: "6px",
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
                  }}
                >
                  {column.name}
                </Typography>
                <Box>
                  <DisplayRating rating={rating} />
                </Box>
              </Box>
            </div>
          </>
        );
      }
    case FieldUiTypeEnum.Lookup:
      return (
        <LookupField
          column={column}
          isPrint={isPrint}
          currentMode={currentMode}
          values={values}
          isError={isError()}
          setValues={onSetValues}
        />
      );
    case FieldUiTypeEnum.Sublist:
      return (
        <SublistField
          translations={translations}
          column={column}
          isPrint={isPrint}
          currentMode={currentMode}
          values={values || []}
          isError={isError()}
          setValues={onSetValues}
        />
      );
    case FieldUiTypeEnum.Link:
      return (
        <LinkFieldInput
          isError={isError()}
          mode={currentMode === "view" || isPrint ? "view" : currentMode}
          column={column}
          name={column.name}
          selectedLink={
            values && values[column.id]
              ? linkStringToJSON(values[column.id])
              : { linkValue: "", name: "" }
          }
          onLinkChange={(value: any) => {
            onSetValues({
              ...values,
              [column.id]: `${value.linkValue} (${value.name})`,
            });
          }}
        />
      );
    case FieldUiTypeEnum.User:
      return currentMode !== "view" && !isPrint ? (
        <Box key={column.id} sx={{ width: "100%" }}>
          {values && values[column.id] !== null && (
            <ViewUserSelect
              isModeView={false}
              selectedUserData={values[column.id]}
              setSelectedUserData={(userData: string) => {
                onSetValues({ ...values, [column.id]: userData });
              }}
              name={column.name}
              label={column.system ? t(column.name) : column.name}
              isMultiple={column.config?.multiple}
            />
          )}
        </Box>
      ) : (
        <Box key={column.id} sx={{ width: "100%" }}>
          {values && values[column.id] !== null && (
            <ViewUserSelect
              isModeView={true}
              selectedUserData={values[column.id]}
              setSelectedUserData={(userData: string) => {
                onSetValues({ ...values, [column.id]: userData });
              }}
              label={column.system ? t(column.name) : column.name}
              name={column.name}
              isMultiple={column.config?.multiple}
            />
          )}
        </Box>
      );
    default:
      return <div key={column.id}></div>;
  }
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
});

export default connect(mapStateToProps)(RenderField);
