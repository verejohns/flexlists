import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { getDataColumnId } from 'src/utils/flexlistHelper';
import { View } from 'src/models/SharedModels';
import { useTheme } from '@mui/material/styles';

type GanttCellsProps = {
  cellIndex: number;
  level: number;
  ganttDays: Date[];
  rows: any;
  currentView: View;
  columns: any;
  handleClickCell: (level: number, meeting?: any) => void;
};

const GanttCells = ({
  cellIndex,
  level,
  ganttDays,
  rows,
  currentView,
  columns,
  handleClickCell
}: GanttCellsProps) => {
  const theme = useTheme();
  
  const getMeeting = (day: Date, level: number) => {
    let meeting = null;

    for (let i = 0; i < rows.length; i++) {
      const from = new Date(rows[i][getDataColumnId(currentView.config.fromId, columns)]);
      const to = new Date(rows[i][getDataColumnId(currentView.config.toId, columns)]);
      const fromDifference = Math.abs(day.getTime() - from.getTime()) / 1000 / 60 / 60;
      const toDifference = (day.getTime() - to.getTime()) / 1000 / 60 / 60;

      if ((day >= from || fromDifference < 24) && (day <= to || (day.getSeconds() === 59 && toDifference < 24)) &&
        rows[i][getDataColumnId(currentView.config.levelId, columns)] === level) {
        meeting = rows[i];
        break;
      }
    }

    return meeting;
  };

  const meeting = getMeeting(ganttDays[cellIndex], level);

  if (meeting) {
    const from = new Date(meeting[getDataColumnId(currentView.config.fromId, columns)]);
    const to = new Date(meeting[getDataColumnId(currentView.config.toId, columns)]);
    const fromDifference = Math.abs(ganttDays[cellIndex].getTime() - from.getTime()) / 1000 / 60 / 60;
    const toDifference = Math.abs(ganttDays[cellIndex].getTime() - to.getTime()) / 1000 / 60 / 60;
    const isFirstItem = (from === ganttDays[cellIndex] || (from > ganttDays[cellIndex] && fromDifference < 24));
    const isLastItem = (to === ganttDays[cellIndex] || toDifference < 24);

    return (
      <Box
        key={`showCell-${cellIndex}`}
        sx={{
          width: `${100 / ganttDays.length}%`,
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
            backgroundColor: meeting[getDataColumnId(currentView.config.colorId, columns)],
            width: '100%',
            height: '100%',
            zIndex: isFirstItem || cellIndex === 0 ? 1 : 'inherit',
            paddingLeft: isFirstItem || cellIndex === 0 ? 1 : 'inherit',
            whiteSpace: 'nowrap',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            borderTopLeftRadius: isFirstItem ? '5px' : 'inherit',
            borderBottomLeftRadius: isFirstItem ? '5px' : 'inherit',
            borderTopRightRadius: isLastItem ? '5px' : 'inherit',
            borderBottomRightRadius: isLastItem ? '5px' : 'inherit'
          }}
        >
          {(isFirstItem || cellIndex === 0) && meeting[getDataColumnId(currentView.config.titleId, columns)]}
        </Box>
      </Box>
    )
  } else {
    return (
      <Box
        key={`showCell-${cellIndex}`}
        sx={{
          width: `${100 / ganttDays.length}%`,
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

export default connect(mapStateToProps)(GanttCells);
