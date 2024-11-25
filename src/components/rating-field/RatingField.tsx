import React from 'react';
import {Rating} from '@mui/material';
interface RatingFieldProps {
  onRatingChange: (newValue: number | null) => void;
}

interface RatingFieldProps {
  onRatingChange: (newValue: number | null) => void;
}

function RatingField({ onRatingChange }: RatingFieldProps) {
  return (
    <Rating
        name="rating"
        onChange={(event, newValue) => {
        onRatingChange(newValue);
        }}
    />
  );
}

export default RatingField;
