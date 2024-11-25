import { Box } from '@mui/material';
import { getDaysInMonth } from 'date-fns';
import TimelineCells from './TimelineCells';

type TimelineRowsProps = {
  rowIndex: number;
  handleClickCell: (level: number, meeting?: any) => void;
};

const TimelineRows = ({
  rowIndex,
  handleClickCell
}: TimelineRowsProps) => {
  const daysInMonth = getDaysInMonth(new Date());

  return (
    <Box sx={{ display: 'flex' }}>
      {Array.from(
        { length: daysInMonth },
        (_, index) => (
          <TimelineCells key={`showCell-${index}`} level={rowIndex + 1} cellIndex={index} handleClickCell={handleClickCell} />
        )
      )}
    </Box>
  );
};

export default TimelineRows;
