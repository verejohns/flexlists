import React from 'react';
import {Rating} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const StyledRating = styled(Rating)(({ theme }) => ({
    paddingBlock: 4,
    '& .MuiRating-iconFilled': {
      color: theme.palette.palette_style.text.selected
    },
  }));
  export default function CheckboxRating() {
    return (
    <>
        <StyledRating
            name="customized-color"
            defaultValue={1}
            getLabelText={(value: number) => `${value} Checkbox${value !== 1 ? 's' : ''}`}
            icon={<CheckBoxIcon fontSize="inherit" />}
            emptyIcon={<CheckBoxOutlineBlankIcon fontSize="inherit" />}
        />
    </>
        
    );
  }
