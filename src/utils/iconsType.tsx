import IconRadioChecked from "src/theme/icons/IconRadio";
import IconTextarea from "src/theme/icons/IconTextarea";
import IconCheckSquare from "src/theme/icons/IconCheckSquare";
import IconSlider from "src/theme/icons/IconSlider";
import IconSwitch from "src/theme/icons/IconSwitch";
import IconBtn from "src/theme/icons/IconBtn";
import IconInput from "src/theme/icons/IconInput";

export function iconType(icon: string | undefined) {
  switch (icon) {
    case "isWidgetInput":
      return <IconInput />;
    case "isWidgetTextArea":
      return <IconTextarea />;
    case "isWidgetButton":
      return <IconBtn />;
    case "isWidgetRadio":
      return <IconRadioChecked />;
    case "isWidgetCheckbox":
      return <IconCheckSquare />;
    case "isWidgetSlider":
      return <IconSlider />;
    case "isWidgetSwitch":
      return <IconSwitch />;
    default:
      return null;
  }
}
