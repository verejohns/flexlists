import React, { memo } from "react";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import { Ecolor } from "src/enums/WidgetEnum";

interface IRadioColorSetting {
  name: string;
  title: string;
  checked: string;
  radioItem: { color: string; name: string }[];
  updateSetting: (payload: string) => void;
}
const RadioColorSetting = ({
  checked,
  updateSetting,
  title,
  name,
  radioItem,
}: IRadioColorSetting) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target.value as Ecolor
    updateSetting(target);
  };

  const controlProps = (item: string) => ({
    checked: checked === item,
    onChange: handleChange,
    value: item,
    name: name,
    inputProps: { "aria-label": item },
  });

  return (
    <div>
      <Typography variant="body1" component="h3">
        {title}
      </Typography>
      {radioItem.map((item, id: number) => {
        return (
          <Radio
            key={id}
            {...controlProps(item.name)}
            sx={{
              color: item.color,
              "&.Mui-checked": {
                color: item.color,
              },
            }}
          />
        );
      })}
    </div>
  );
};

export default memo(RadioColorSetting);
