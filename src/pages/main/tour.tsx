import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useState } from 'react';
import MainLayout from 'src/layouts/view/MainLayout';
import TourView from 'src/sections/@tour/TourView';

export default function TourPage() {
  const theme = useTheme();

  return (
    <MainLayout translations={[]}>
      <Box
        sx={{
          backgroundColor: theme.palette.palette_style.background.default,
          width: '100%',
          height: {xs: 'calc(100% - 8px)', lg: '100%'},
          overflow: 'hidden'
        }}
      >
        <TourView />
      </Box>
    </MainLayout>
  );
}
