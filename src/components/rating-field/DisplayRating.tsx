import React from 'react';
import { Rating } from '@mui/material';
interface DisplayRatingProps {
  rating: number | null;
}

function DisplayRating({ rating }: DisplayRatingProps) {
  return (
    <div>
      <Rating
          name="display-rating"
          value={rating !== null ? rating : 0}
          precision={0.5}
          readOnly
        />
    </div>
  );
}

export default DisplayRating;
