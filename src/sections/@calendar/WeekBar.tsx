import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useResponsive from '../../hooks/useResponsive';

type Props = {
  weeks: string[];
};

const WeekBar = (props: Props) => {
  const { weeks } = props;
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: theme.palette.palette_style.text.selected, color: 'white', paddingRight: 'inherit' }}>
      {weeks.map((week) => (
        <Box key={week} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '56px', border: '1px solid rgba(0, 0, 0, 0.1)' }}>{isDesktop ? week : week.charAt(0)}</Box>
      ))}
    </Box>
  );
};

export default WeekBar;
