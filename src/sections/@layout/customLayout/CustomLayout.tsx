import React, { useCallback, useMemo, useState, useEffect, memo } from "react";
// import "./style.css";
import { WidthProvider, Layout, Responsive, Layouts } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import { INewWidget, IWidget, LAYOUTS } from "src/constants/widget";
import Widget from "src/components/widget/Widget";
import {
  getFromItemsLS,
  getLayoutFromLS,
  removeItemLS,
  setItemsLS,
  setLayoutToLS,
} from "src/utils/ls";
import WidgetButtons from "src/components/widget/widgetButtons/WidgetButtons";
import { setLayoutConfig } from "src/redux/actions/applicationActions";
import { setIdItem, setIsWidget, updateRadioSettings, updateCheckboxSettings, setIsAddOption } from "src/redux/actions/widgetActions";
import { connect } from "react-redux";

const ResponsiveGridLayout = WidthProvider(Responsive);

type CustomLayoutProps = {
  className?: string;
  cols?: { [x: string]: number };
  rowHeight?: number;
  innerRef: React.RefObject<any>;
  widgetItemsPage: string;
  widgetLayoutsPage: string;
  setLayoutConfig: (value: any) => void;
  setIdItem: (value: string) => void;
  setIsWidget: (value: any) => void;
  updateRadioSettings: () => void;
  updateCheckboxSettings: () => void;
  setIsAddOption: (value: boolean) => void;
};

const CustomLayout = ({
  cols = { lg: 12, md: 8, sm: 4, xs: 2, xxs: 1 },
  rowHeight = 70,
  innerRef,
  widgetItemsPage,
  widgetLayoutsPage,
  setLayoutConfig,
  setIdItem,
  setIsWidget,
  updateRadioSettings,
  updateCheckboxSettings,
  setIsAddOption
}: CustomLayoutProps) => {
  const [itemsWidget, setItemsWidget] = useState<IWidget[]>([]);
  const originalLayouts = getLayoutFromLS(LAYOUTS, widgetLayoutsPage);
  const [breakpointLayout, setBreakpointLayout] = useState<string>("lg");
  const [layouts, setLayouts] = useState<Layouts>(originalLayouts);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [selectedID, setSelectedID] = React.useState<string>("");
  const [isOverlap, setIsOverlap] = React.useState(false);

  useEffect(() => {
    const currentItem = layout.find((item) => item.i == selectedID);

    if (currentItem !== undefined) {
      setLayoutConfig(currentItem);
    }
  }, [layout, selectedID]);

  useEffect(() => {
    setItemsWidget(getFromItemsLS(widgetItemsPage));
  }, []);

  useEffect(() => {
    if (itemsWidget && !itemsWidget.length) return;

    setItemsLS(widgetItemsPage, itemsWidget);
  }, [itemsWidget]);

  useEffect(() => {
    const timeoutLayouts = setTimeout(() => {
      setLayouts({ ...originalLayouts });
    }, 200);
    
    return () => clearTimeout(timeoutLayouts);
  }, []);

  const handleOnClick = (id: string, item: IWidget) => {
    const isWidget = Object.keys(item.isWidget)[0];

    setSelectedID(id);
    setIdItem(id);    
    setIsWidget({ [isWidget]: true });
  };

  const generateLayout = () => {
    return (
      itemsWidget &&
      itemsWidget.map((item: any) => {
        return {
          ...item.config,
          i: item.id,
        };
      })
    );
  }

  const handleRemoveItem = useCallback((id: string) => {
    setItemsWidget((current: IWidget[]) => {
      const removeItem = current.filter((item) => {
        return item.id !== id;
      });

      if (current.length < 2) {
        removeItemLS(widgetItemsPage);
        removeItemLS(widgetLayoutsPage);
        return removeItem;
      }

      return removeItem;
    });
  }, []);

  const widgetUpdate = (type: {}, id: string) => {
    const widget: {
      [s: string]: () => void;
    } = {
      isWidgetRadio: () => {
        setIdItem(id);
        updateRadioSettings();
      },
      isWidgetCheckbox: () => {
        setIdItem(id);
        updateCheckboxSettings();
      },
      default: () => {
        return undefined;
      },
    };

    return (widget[Object.keys(type)[0]] || widget["default"])();
  };

  const handleAddItem = (obj: INewWidget, item: Layout) => {
    const idItem = uuidv4();
    const { config } = obj;
    setLayouts((current: Layouts) => {
      const prevObj = { ...current };
      const arr = [
        {
          h: config.h,
          i: idItem,
          w: config.w,
          x: item.x,
          y: item.y,
          minH: config.minH,
        },
        ...prevObj[breakpointLayout],
      ];
      const newLayouts = { [breakpointLayout]: [...arr] };
      return {
        ...current,
        ...newLayouts,
      };
    });
    setItemsWidget((current: IWidget[]) => [
      {
        ...obj,
        id: idItem,
        config: {
          x: item.x,
          y: item.y,
          h: config.h,
          w: config.w,
          minH: config.minH,
        },
      },
      ...current,
    ]);
    const { isWidget } = obj;
    widgetUpdate(isWidget, idItem);
  };

  const handleItemSizeChange = useCallback(
    (size: number, id: string) => {
      if (!size) return null;
      const isLayouts = layouts[breakpointLayout].some(({ i }) => {
        return i === id;
      });
      const newHeightBox = size + rowHeight / 2;
      const newHeight = newHeightBox / rowHeight;
      if (isLayouts) {
        setLayouts((current: Layouts) => {
          const currentArr = current[breakpointLayout];
          const currentItems = currentArr.map((item: Layout) => {
            if (item.i === id)
              return {
                ...item,
                h: newHeight,
              };
            return item;
          });
          return {
            ...current,
            [breakpointLayout]: currentItems,
          };
        });
      }
      setIsAddOption(false);
    },
    [layouts]
  );

  const generateDOM = useMemo(() => {
    return (
      itemsWidget &&
      itemsWidget.map((item: IWidget) => {
        const activeItem = selectedID === item.id;
        return (
          <div
            onClick={() => handleOnClick(item.id, item)}
            className={`grid-item ${activeItem && "grid-item-active"} `}
            key={item.id}
          >
            <Widget
              handleItemSizeChange={handleItemSizeChange}
              // handleRemoveItem={handleRemoveItem}
              item={item}
              activeItem={activeItem}
            >
              {activeItem && (
                <WidgetButtons
                  item={item}
                  handleRemoveItem={handleRemoveItem}
                />
              )}
            </Widget>
          </div>
        );
      })
    );
  }, [itemsWidget, selectedID, isOverlap]);

  const onDrop = (
    layout: Layout[],
    item: Layout,
    e: DragEvent,
    handleAddItem: (obj: INewWidget, item: Layout) => void
  ) => {
    if (e.dataTransfer) {
      const data = e.dataTransfer.getData("itemWidget");
      const objWidget = JSON.parse(data);
      handleAddItem(objWidget, item);
    }
    setIsOverlap(false);
  };

  const onDropDragOver = () => {
    setIsOverlap(true);
    return { w: 6, h: 1 };
  };

  const handleOnLayoutChange = (layout: Layout[], layouts: Layouts) => {
    setLayoutToLS(LAYOUTS, layouts, widgetLayoutsPage);
    requestAnimationFrame(() => {
      setLayouts({ ...layouts });
    });
    setLayout(layout);
  };

  return (
    <ResponsiveGridLayout
      ref={innerRef}
      cols={cols}
      layouts={layouts}
      breakpoints={{ lg: 1100, md: 996, sm: 768, xs: 480, xxs: 0 }}
      onLayoutChange={handleOnLayoutChange}
      margin={[0, 0]}
      useCSSTransforms={true}
      rowHeight={rowHeight}
      onDrop={(layout: Layout[], item: Layout, e: DragEvent) =>
        onDrop(layout, item, e, handleAddItem)
      }
      isDroppable={true}
      onDropDragOver={onDropDragOver}
      onBreakpointChange={(newBreakpoint: string) =>
        setBreakpointLayout(newBreakpoint)
      }
      compactType={"vertical"}
      allowOverlap={isOverlap}
    >
      {generateDOM}
    </ResponsiveGridLayout>
  );
};

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = {
  setLayoutConfig,
  setIdItem,
  setIsWidget,
  updateRadioSettings,
  updateCheckboxSettings,
  setIsAddOption
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomLayout);
