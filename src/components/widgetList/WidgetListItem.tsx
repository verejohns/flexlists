import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import { INewWidget } from "src/constants/widget";
import { iconType } from "src/utils/iconsType";
import { onDragStart } from "src/utils/dragAndDrop";

interface IWidgetTemplate {
  widgetTemplate: INewWidget;
}

const WidgetListItem = ({ widgetTemplate }: IWidgetTemplate) => {
  const isWidget = Object.keys(widgetTemplate.isWidget)[0];
  return (
    <IconButton
      style={{ cursor: "grab" }}
      draggable={true}
      onDragStart={(e) => onDragStart(e, widgetTemplate)}
      unselectable="on"
    >
      {iconType(isWidget)}
    </IconButton>
  );
};

export default memo(WidgetListItem);
