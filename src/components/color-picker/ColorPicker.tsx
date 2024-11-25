import React, { useState } from "react";
import { CirclePicker, ColorResult } from "react-color";
import { Box, Popover, Button } from "@mui/material";
import { fieldColors } from "src/constants/fieldColors";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  const handleColorChange = (color: ColorResult) => {
    onColorChange(color.hex);
  };
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
      }}
    >
      <Button variant="text" onClick={handleClick}>
        Choose color
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <CirclePicker
            colors={fieldColors}
            color={selectedColor}
            onChange={handleColorChange}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default ColorPicker;
