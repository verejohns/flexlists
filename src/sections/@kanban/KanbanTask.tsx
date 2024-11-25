import { Box } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import { styled } from '@mui/material/styles';
import { KanbanConfig } from 'src/models/ViewConfig';
import { ChoiceModel } from "src/models/ChoiceModel";

type KanbanTaskProps = {
  task: any;
  index: number;
  kanbanConfig: KanbanConfig;
  editRow: (id: string) => void;
  borderColor: string;
};

const Container = styled('div')(({ theme }) => ({
  boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: 'white'
}));

const Label = styled('div')(({ theme }) => ({
  fontSize: '12px',
  textTransform: 'uppercase',
  margin: '8px 0 4px 0'
}));

const KanbanTask = ({kanbanConfig, task, index, editRow, borderColor }: KanbanTaskProps) => {

  // const getColorByImportance = (importance: string) => {
  //   return importance === 'Very important' ? '#FFB7B7' : '#FFEBB7';
  // };

  return (
    <Draggable draggableId={`${task.id}`} index={index}>
      {(provided: any) =>
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          sx={{ border: `1px solid ${borderColor || "#000"}`  }}
          onClick={() => { editRow(task.id); }}
        >
          <Box>
            <Label>Task Name</Label>
            <Box>{task[kanbanConfig.titleId]}</Box>
          </Box>
        </Container>
      }
    </Draggable>
  );
};

export default KanbanTask;
