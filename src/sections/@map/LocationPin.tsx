import { useState } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import useResponsive from '../../hooks/useResponsive';
import DetailBoard from './DetailBoard';
import { View } from "src/models/SharedModels";

type Props = {
  lat: number;
  lng: number;
  row?: any;
  currentView: View;
  setLocation: (row: any, pos: any) => void;
};

const LocationPin = (props: Props) => {
  const { lat, lng, row, currentView, setLocation } = props;
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const [visibleDetail, setVisibleDetail] = useState(false);

  const handleClick = () => {
    setLocation(row, { lat, lng });
  };

  return (
    <Box sx={{ position: 'relative', marginTop: '-30px', marginLeft: '-15px' }}>
      <Box
        component="span"
        className="svg-color detail_board"
        sx={{
            width: 30,
            height: 30,
            display: 'inline-block',
            bgcolor: (row && row[currentView.config.colorId]) || theme.palette.palette_style.background.mapPin,
            mask: `url(/assets/icons/map/pin.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/map/pin.svg) no-repeat center / contain`,
            cursor: 'pointer'
        }}
        onClick={handleClick}
        onMouseOver={() => { setVisibleDetail(true); }}
        onMouseLeave={() => { setVisibleDetail(false); }}
      />
      {visibleDetail && row && <DetailBoard row={row} />}
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView
});

export default connect(mapStateToProps)(LocationPin);
