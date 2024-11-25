// material
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  top: 0,
  bottom: 0,
  zIndex: 9,
  width: '100%',
  margin: 'auto',
  display: 'flex',
  position: 'absolute',
  justifyContent: 'space-between'
}));

const LeftStyle = styled(MIconButton)(({ theme }) => ({
  width: '150px',
  background: 'linear-gradient(90deg,#ffffff,transparent)',
  [theme.breakpoints.up('md')]: {
    width: '300px',
    opacity: 1,
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
    background: 'linear-gradient(90deg,#ffffff,transparent)',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('opacity'),
    '&:hover': {
      opacity: 1,
      background: 'linear-gradient(90deg,#ffffff,transparent)'
    }
  }
}));

const RightStyle = styled(MIconButton)(({ theme }) => ({
  width: '150px',
  background: 'linear-gradient(90deg,transparent,#ffffff)',
  [theme.breakpoints.up('md')]: {
    width: '300px',
    opacity: 1,
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
    background: 'linear-gradient(90deg,transparent,#ffffff)',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('opacity'),
    '&:hover': {
      opacity: 1,
      background: 'linear-gradient(90deg,transparent,#ffffff)'
    }
  }
}));

// ----------------------------------------------------------------------

export default function CarouselControlsArrowsBasic2({ arrowLine, onNext, onPrevious, ...other }: any) {

  return (
    <RootStyle {...other}>
      {/* <LeftStyle size="small" onClick={onPrevious}></LeftStyle>
      <RightStyle size="small" onClick={onNext}></RightStyle> */}
    </RootStyle>
  );
}
