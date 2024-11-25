import React from "react";
import Radio from "@mui/material/Radio";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
// import styles from "./WidgetRadio.module.scss";
import { setIdItem, setRadioItemIsChecked, removeRadioItem } from "src/redux/actions/widgetActions";
import { connect } from "react-redux";
import { Box } from "@mui/material";
import { IRadioSettings } from "src/redux/reducers/widgetReducer";

type TextareaSettingsProps = {
  item: any;
  radioSettings: any;
  setIdItem: (value: string) => void;
  setRadioItemIsChecked: (setting: any) => void;
  removeRadioItem: (value: string) => void;
};

const WidgetRadio = ({
  item,
  radioSettings,
  setIdItem,
  setRadioItemIsChecked,
  removeRadioItem
}: TextareaSettingsProps) => {
  const itemsId = item.id;
  const { items, info: { title, isHideField, isRow, color } } = radioSettings[itemsId] ? radioSettings[itemsId] : radioSettings[0];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
    value: string,
    itemsId: string
  ) => {
    setIdItem(itemsId);
    setRadioItemIsChecked({
      id,
      isChecked: value === event.target.value,
    });
  };

  const handleRemoveItem = (id: string, itemsId: string) => {
    setIdItem(itemsId);
    removeRadioItem(id);
  };

  return (
    <Box sx={{ padding: '0 10px' }}>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">{title}</FormLabel>
        <RadioGroup
          row={isRow}
          sx={{ pb: '10px' }}
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          {items.map(({ id, value, label, isChecked }: IRadioSettings) => {
            return (
              <Box
                sx={{
                  position: 'relative',
                  pr: '20px',
                  "&:hover .overlay": {
                    display: "flex"
                  }
                }}
                key={id}
              >
                <FormControlLabel
                  disabled={isHideField}
                  value={value}
                  control={
                    <Radio
                      color={color}
                      checked={isChecked}
                      onChange={(e) => handleChange(e, id, value, itemsId)}
                    />
                  }
                  label={label}
                />

                <Box sx={{
                  display: 'none',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onBlur={() => handleRemoveItem(id, itemsId)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  radioSettings: state.widget.radio
});

const mapDispatchToProps = {
  setIdItem,
  setRadioItemIsChecked,
  removeRadioItem
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetRadio);
