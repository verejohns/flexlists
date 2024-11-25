export type ListConfig = {};

export type CalendarConfig = {
  titleId: number;
  beginDateTimeId: number;
  endDateTimeId: number;
  colorId: number;
};

export type KanbanConfig = {
  boardColumnId: number;
  titleId: number;
  boardOrder?: string[];
};

export type GalleryConfig = {
  imageId: number;
  titleId: number;
};

export type TimelineConfig = {
  titleId: number;
  colorId: number;
  levelId: number;
  fromId: number;
  toId: number;
};

export type GanttConfig = {
  titleId: number;
  colorId: number;
  progressId: number;
  fromId: number;
  toId: number;
  dependencyId?: number;
};

export type MapConfig = {
  titleId: number;
  latId: number;
  lngId: number;
  colorId: number;
};

export type ChartConfig = {
  type: string;
  xId: number;
  yId: number;
  xLabel: string;
  yLabel: string;
  colorId: number;
  multiLineChoiceId: number;
};
