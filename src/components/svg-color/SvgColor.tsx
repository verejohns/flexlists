import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import { Box } from '@mui/material';
import React from 'react';

// ----------------------------------------------------------------------

// eslint-disable-next-line react/display-name
const SvgColor = React.forwardRef<any, SvgColorProps>(({ src, sx, ...other }, ref) => {
 return (<Box
    component="span"
    className="svg-color"
    ref={ref}
    sx={{
      width: 24,
      height: 24,
      display: 'inline-block',
      bgcolor: 'currentColor',
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
    {...other}
  />);
  });

type SvgColorProps = {
  src: string,
  sx: any,
};

export default SvgColor;
