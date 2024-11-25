import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useResponsive from '../../hooks/useResponsive';

type CalendarViewProps = {
  mode: string;
  setMode: (mode: string) => void;
};

export default function CalendarView({ mode, setMode }: CalendarViewProps) {
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');

  return (
    <Box sx={{ width: {xs: '100%', md: '186px'}, textTransform: 'uppercase', paddingLeft: {xs: 0.5, md: 1}, paddingRight: {xs: 0.5, md: 0.5}, py: {xs: 1.5, md: 4.5} }}>
      <Box sx={{ paddingBottom: {md: 2}, borderBottom: {md: '1px solid rgba(0, 0, 0, 0.1)'}, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', textAlign: {md: 'center'} }}>Calendar Views</Box>
      <Box sx={{ display: {xs: 'flex', md: 'block'}, justifyContent: {xs: 'space-between', md: 'inherit'}, height: 'calc(100% - 20px)', overflow: 'auto', textAlign: 'center', py: 1.5, px: {md: 1} }}>
        <Box sx={{ borderRadius: 1, my: {md: 3.5}, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', p: 1, cursor: 'pointer', backgroundColor: mode === "day" ? theme.palette.palette_style.background.selected : '', width: {xs: '100px', md: 'auto'}, height: {xs: '120px', md: 'auto'} }} onClick={() => { setMode('day'); }}>
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: '100%',
              height: '15px',
              display: 'inline-block',
              backgroundImage: `url(/assets/icons/calendar/rectangle.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: '100%',
              height: {xs: '60px', md: '88px'},
              display: 'inline-block',
              backgroundImage: `url(/assets/icons/calendar/days.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <Box sx={{ fontSize: '12px' }}>Day</Box>
        </Box>
        {isDesktop && <Box sx={{ width: '100%', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}></Box>}
        <Box sx={{ borderRadius: 1, my: {md: 3.5}, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', p: 1, cursor: 'pointer', backgroundColor: mode === "week" ? theme.palette.palette_style.background.selected : '', width: {xs: '100px', md: 'auto'}, height: {xs: '120px', md: 'auto'} }} onClick={() => { setMode('week'); }}>
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: '100%',
              height: '15px',
              display: 'inline-block',
              backgroundImage: `url(/assets/icons/calendar/rectangle.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: '100%',
              height: {xs: '60px', md: '88px'},
              display: 'inline-block',
              backgroundImage: `url(/assets/icons/calendar/week.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <Box sx={{ fontSize: '12px' }}>Week</Box>
        </Box>
        {isDesktop && <Box sx={{ width: '100%', borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}></Box>}
        <Box sx={{ borderRadius: 1, my: {md: 3.5}, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', p: 1, cursor: 'pointer', backgroundColor: mode === "month" ? theme.palette.palette_style.background.selected : '', width: {xs: '100px', md: 'auto'}, height: {xs: '120px', md: 'auto'} }} onClick={() => { setMode('month'); }}>
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: '100%',
              height: '15px',
              display: 'inline-block',
              backgroundImage: `url(/assets/icons/calendar/rectangle.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <Box
            component="span"
            className="svg-color"
            sx={{
              width: '100%',
              height: {xs: '60px', md: '88px'},
              display: 'inline-block',
              backgroundImage: `url(/assets/icons/calendar/month.svg)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <Box sx={{ fontSize: '12px' }}>Month</Box>
        </Box>
      </Box>
    </Box>
  );
}
