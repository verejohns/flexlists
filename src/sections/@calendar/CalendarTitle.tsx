import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format, addYears, addDays } from 'date-fns';

type Props = {
  mode: string;
  current: Date;
  currentDate: Date;
  handleFirstPageer: (flag: number) => void;
  handleSecondPageer: (flag: number) => void;
};

const CalendarTitle = (props: Props) => {
  const { handleFirstPageer, handleSecondPageer, current, mode, currentDate } = props;
  const theme = useTheme();

  const headerTitle = (mode: string, current: Date) => {
    if (mode === 'day') return format(currentDate, 'dd MMMM yyyy');
    else if (mode === 'week') return `${format(current, 'dd MMMM yyyy')} - ${format(addDays(current, 6), 'dd MMMM yyyy')}`;
    else return format(current, 'MMMM yyyy');
  };

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '56px', px: 2, backgroundColor: theme.palette.palette_style.background.paper }}
    >
      <Box sx={{ paddingTop: 1, minWidth: '40px' }}>
        <Box
          component="span"
          className="svg-color"
          sx={{
            width: {xs: 20, md: 24},
            height: {xs: 20, md: 24},
            display: 'inline-block',
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/angle_double_left.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/angle_double_left.svg) no-repeat center / contain`,
            cursor: 'pointer'
          }}
          onClick={() => { handleSecondPageer(-1) }}
        />
        <Box
          component="span"
          className="svg-color"
          sx={{
            width: {xs: 20, md: 24},
            height: {xs: 20, md: 24},
            display: 'inline-block',
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/angle_left.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/angle_left.svg) no-repeat center / contain`,
            cursor: 'pointer'
          }}
          onClick={() => { handleFirstPageer(-1) }}
        />
      </Box>
      <Box>
        {headerTitle(mode, current)}
        {mode === 'list' && <span> - {format(addYears(current, 1), 'MMMM yyyy')}</span>}
      </Box>
      <Box sx={{ paddingTop: 1, minWidth: '40px' }}>
        <Box
          component="span"
          className="svg-color"
          sx={{
            width: {xs: 20, md: 24},
            height: {xs: 20, md: 24},
            display: 'inline-block',
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/angle_right.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/angle_right.svg) no-repeat center / contain`,
            cursor: 'pointer'
          }}
          onClick={() => handleFirstPageer(1)}
        />
        <Box
          component="span"
          className="svg-color"
          sx={{
            width: {xs: 20, md: 24},
            height: {xs: 20, md: 24},
            display: 'inline-block',
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/angle_double_right.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/angle_double_right.svg) no-repeat center / contain`,
            cursor: 'pointer'
          }}
          onClick={() => handleSecondPageer(1)}
        />
      </Box>
    </Box>
  );
};

export default CalendarTitle;
