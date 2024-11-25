import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  ratingItem: {
    background: 'rgba(84, 166, 251, 0.1)',
    width: '28px',
    height: '28px',
    display: 'grid',
    placeContent: 'center',
    borderRadius: '24px',
    fontSize: '18px',
    fontWeight: 500,
    cursor: 'pointer',
    color: '#999',
    transition: 'all 0.2s',
  },
  active: {
    color: '#999',
    background: 'rgba(84, 166, 251, 0.2)',
  },
  hovered: {
    background: 'rgb(84, 166, 251)',
    color: '#fff',
  },
}));

const NumericRating = () => {
  const classes = useStyles();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleRatingClick = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null); // Deselect the rating if clicked again
    } else {
      setSelectedRating(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <Box
            key={rating}
            className={`${classes.ratingItem} ${
              (selectedRating !== null && rating <= selectedRating) ||
              (hoveredRating !== null && rating <= hoveredRating)
                ? classes.active
                : ''
            } ${
              (hoveredRating !== null && rating > hoveredRating) ||
              (selectedRating !== null && rating > selectedRating)
                ? ''
                : classes.hovered
            }`}
            onClick={() => handleRatingClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
          >
            {rating}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default NumericRating;
