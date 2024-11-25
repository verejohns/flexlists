import React from "react";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
// import styles from "./WidgetCheckbox.module.scss";
import { setIdItem, setCheckboxItemIsChecked, removeCheckboxItem } from "src/redux/actions/widgetActions";
import { connect } from "react-redux";
import { Box } from "@mui/material";
import { ICheckboxSettings } from "src/redux/reducers/widgetReducer";

export interface WidgetCheckboxProps {
  item: any;
  checkboxSettings: any;
  setIdItem: (value: string) => void;
  setCheckboxItemIsChecked: (setting: any) => void;
  removeCheckboxItem: (value: string) => void;
}

const WidgetCheckbox = ({
  item,
  checkboxSettings,
  setIdItem,
  setCheckboxItemIsChecked,
  removeCheckboxItem
}: WidgetCheckboxProps) => {
  const itemsId = item.id;
  const {
    items,
    info: { title, isHideField, isRow, color },
  } = checkboxSettings[itemsId] ? checkboxSettings[itemsId] : checkboxSettings[0];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
    itemsId: string
  ) => {
    setIdItem(itemsId);
    setCheckboxItemIsChecked({ id, isChecked: event.target.checked });
  };

  const handleRemoveItem = (id: string, itemsId: string) => {
    setIdItem(itemsId);
    removeCheckboxItem(id);
  };

  return (
    <Box sx={{ p: '0 10px' }}>
      <FormControl>
        <FormLabel id="checkbox-buttons-group-label">{title}</FormLabel>
        <FormGroup row={isRow} sx={{ pb: '10px' }}>
          {items.map(({ id, value, isChecked, label }: ICheckboxSettings) => {
            return (
              <Box 
                key={id}
                sx={{
                  position: 'relative',
                  pr: '20px',
                  "&:hover .overlay": {
                    display: "flex"
                  }
                }}
              >
                <FormControlLabel
                  disabled={isHideField}
                  value={value}
                  control={
                    <Checkbox
                      color={color}
                      onChange={(e) => handleChange(e, id, itemsId)}
                      checked={isChecked}
                    />
                  }
                  label={label}
                />

                <Box
                  sx={{
                    display: 'none',
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
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
        </FormGroup>
      </FormControl>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  checkboxSettings: state.widget.checkbox
});

const mapDispatchToProps = {
  setIdItem,
  setCheckboxItemIsChecked,
  removeCheckboxItem
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetCheckbox);
