import React, { useEffect } from "react";
import { IWidget } from "src/constants/widget";
// import styles from "./Widget.module.scss";
import WidgetInputField from "src/components/widgetsForm/widgetInputField/WidgetInputField";
import WidgetTextAreaField from "src/components/widgetsForm/widgetTextAreaField/WidgetTextAreaField";
import WidgetRadio from "src/components/widgetsForm/widgetRadio/WidgetRadio";
import WidgetCheckbox from "src/components/widgetsForm/widgetCheckbox/WidgetCheckbox";
import WidgetSlider from "src/components/widgetsForm/widgetSlider/WidgetSlider";
import WidgetSwitch from "src/components/widgetsForm/widgetSwitch/WidgetSwitch";
import WidgetBtn from "src/components/widgetsForm/widgetButton/WidgetButton";
import useElementSize from "src/hooks/useElementSize";
import { connect } from "react-redux";
import { Box } from "@mui/material";

export interface IWidgetItem {
  item: IWidget;
  activeItem?: boolean;
  children?: any;
  isAddOption: boolean;
  idItem: string;
  handleItemSizeChange?: (size: number, id: string) => void;
}

const Widget = ({
  activeItem,
  children,
  item,
  item: {
    isWidget: {
      isWidgetInput,
      isWidgetTextArea,
      isWidgetRadio,
      isWidgetCheckbox,
      isWidgetSlider,
      isWidgetSwitch,
      isWidgetButton,
    },
    id,
  },
  isAddOption,
  idItem,
  handleItemSizeChange
}: IWidgetItem) => {
  const [squareRef, { height }] = useElementSize();

  useEffect(() => {
    isAddOption && handleItemSizeChange && handleItemSizeChange(height, idItem);
  }, [isAddOption, idItem]);

  const currentRefItem = id === idItem ? squareRef : null;

  return (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        background: '#fff',
        cursor: 'move',
        backgroundColor: 'map_get($color-secondary, 200)'
      }}
    >
      <Box
        sx={{
          padding: '8px 4px',
          height: '100%',
          boxSizing: 'border-box'
        }}
        ref={currentRefItem}
      >
        {children}
        {isWidgetInput && <WidgetInputField item={item} />}
        {isWidgetTextArea && <WidgetTextAreaField item={item} />}
        {isWidgetRadio && <WidgetRadio item={item} />}
        {isWidgetCheckbox && <WidgetCheckbox item={item} />}
        {isWidgetSlider && <WidgetSlider item={item} />}
        {isWidgetSwitch && <WidgetSwitch item={item} />}
        {isWidgetButton && <WidgetBtn item={item} />}
      </Box>
    </Box>
  );
};

const mapStateToProps = (state: any) => ({
  isAddOption: state.widget.isAddOption,
  idItem: state.widget.idItem
});

export default connect(mapStateToProps)(Widget);
