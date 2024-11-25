import { Box } from '@mui/material';
import { getDaysInMonth } from 'date-fns';
import { connect } from 'react-redux';
import { getDataColumnId } from 'src/utils/flexlistHelper';
import { View } from 'src/models/SharedModels';
import { useTheme } from '@mui/material/styles';

type TimelineCellsProps = {
  cellIndex: number;
  level: number;
  rows: any;
  currentView: View;
  columns: any;
  handleClickCell: (level: number, meeting?: any) => void;
};

const TimelineCells = ({
  cellIndex,
  level,
  rows,
  currentView,
  columns,
  handleClickCell
}: TimelineCellsProps) => {
  const theme = useTheme();
  const daysInMonth = getDaysInMonth(new Date());
  
  const getMeeting = (date: number, level: number) => {
    let meeting = null;

    for (let i = 0; i < rows.length; i++) {
      const thisMonth = (new Date()).getMonth();
      const fromMonth = new Date(rows[i][getDataColumnId(currentView.config.fromId, columns)]).getMonth();
      const toMonth = new Date(rows[i][getDataColumnId(currentView.config.toId, columns)]).getMonth();
      const from = new Date(rows[i][getDataColumnId(currentView.config.fromId, columns)]).getDate();
      const to = new Date(rows[i][getDataColumnId(currentView.config.toId, columns)]).getDate();

      if ((date >= from || (date < from && fromMonth < thisMonth)) && (date <= to || (date > to && toMonth > thisMonth)) &&
        rows[i][getDataColumnId(currentView.config.levelId, columns)] === level) {
        meeting = rows[i];
        break;
      }
    }

    return meeting;
  };

  const meeting = getMeeting(cellIndex + 1, level);

  if (meeting) {
    const thisMonth = (new Date()).getMonth();
    const fromMonth = new Date(meeting[getDataColumnId(currentView.config.fromId, columns)]).getMonth();
    const toMonth = new Date(meeting[getDataColumnId(currentView.config.toId, columns)]).getMonth();
    const from = new Date(meeting[getDataColumnId(currentView.config.fromId, columns)]).getDate();
    const to = new Date(meeting[getDataColumnId(currentView.config.toId, columns)]).getDate();

    return (
      <Box
        key={`showCell-${cellIndex}`}
        sx={{
          width: `${100 / daysInMonth}%`,
          height: '64px',
          textAlign: 'center',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 0.5
        }}
        onClick={() => {
          handleClickCell(level, meeting);
        }}
      >
        <Box
          sx={{
            backgroundColor: meeting[getDataColumnId(currentView.config.colorId, columns)] ?
              meeting[getDataColumnId(currentView.config.colorId, columns)] :
              theme.palette.palette_style.background.calendarItem,
            width: '100%',
            height: '100%',
            zIndex: from === cellIndex + 1 && fromMonth === thisMonth ? 1 : 'inherit',
            paddingLeft: from === cellIndex + 1 || cellIndex === 0 ? 1 : 'inherit',
            whiteSpace: 'nowrap',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            borderTopLeftRadius: from === cellIndex + 1 && fromMonth === thisMonth ? '5px' : 'inherit',
            borderBottomLeftRadius: from === cellIndex + 1 && fromMonth === thisMonth ? '5px' : 'inherit',
            borderTopRightRadius: to === cellIndex + 1 && toMonth === thisMonth ? '5px' : 'inherit',
            borderBottomRightRadius: to === cellIndex + 1 && toMonth === thisMonth ? '5px' : 'inherit'
          }}
        >
          {
            ((from === cellIndex + 1 && (toMonth === thisMonth || fromMonth === thisMonth)) || cellIndex === 0) &&
              meeting[getDataColumnId(currentView.config.titleId, columns)]
          }
        </Box>
      </Box>
    )
  } else {
    return (
      <Box
        key={`showCell-${cellIndex}`}
        sx={{
          width: `${100 / daysInMonth}%`,
          height: '64px',
          textAlign: 'center',
          fontSize: '14px',
          borderRight: `1px solid ${theme.palette.palette_style.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => {
          handleClickCell(level);
        }}
      />
    )
  }
};

const mapStateToProps = (state: any) => ({
  columns: state.view.columns,
  rows: state.view.rows,
  currentView:state.view.currentView
});

export default connect(mapStateToProps)(TimelineCells);
