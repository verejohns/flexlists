import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import useResponsive from '../../hooks/useResponsive';
import { styled } from '@mui/material/styles';
import { View } from "src/models/SharedModels";

type Props = {
  row: any;
  currentView: View;
};

const DetailBoard = (props: Props) => {
  const { row, currentView } = props;
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');

  const Container = styled('div')(({ theme }) => ({
    position: 'absolute',
    bottom: '48px',
    left: '-85px',
    width: '200px',
    height: '50px',
    fontSize: '14px',
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '12px',
    zIndex: 1,
    boxShadow: '0 0 5px 5px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: 0,
      height: 0,
      border: '12px solid transparent',
      borderTopColor: 'white',
      borderBottom: 0,
      marginLeft: '-12px',
      marginBottom: '-12px'
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: 0,
      height: 0,
      border: '14px solid transparent',
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      borderBottom: 0,
      marginLeft: '-14px',
      marginBottom: '-14px'
    }
  }));

  return (
    <Container className="detail_board">
      <Box sx={{ textTransform: 'capitalize' }}>{row[currentView.config.titleId]}</Box>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  currentView: state.view.currentView
});

export default connect(mapStateToProps)(DetailBoard);
