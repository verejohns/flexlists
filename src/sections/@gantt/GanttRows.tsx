import { Box } from '@mui/material';
import { getDaysInMonth } from 'date-fns';
import GanttCells from './GanttCells';

type GanttRowsProps = {
  rowIndex: number;
  ganttDays: Date[];
  handleClickCell: (level: number, meeting?: any) => void;
};

const GanttRows = ({
  rowIndex,
  ganttDays,
  handleClickCell
}: GanttRowsProps) => {
  const daysInMonth = getDaysInMonth(new Date());

  return (
    <Box sx={{ display: 'flex' }}>
      {Array.from(
        { length: daysInMonth },
        (_, index) => (
          <GanttCells key={`showCell-${index}`} level={rowIndex + 1} cellIndex={index} ganttDays={ganttDays} handleClickCell={handleClickCell} />
        )
      )}
    </Box>
  );
};

export default GanttRows;
