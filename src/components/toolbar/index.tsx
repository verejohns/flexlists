import { useState } from "react";
import {
    Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

type ToolBarItemProps = {
    toolbar: any
};
  
export default function ToolBarItem({ toolbar }:ToolBarItemProps) {
    const { title, icon, active, leftIcon, color } = toolbar;
    const theme = useTheme();
    const [isOver, setIsOver] = useState(false);
  
    return (
      <Box
        className="toolbar_item"
        sx={{
          display: 'flex',
          cursor: active? 'pointer' : 'no-drop',
          marginRight: {xs: 3, md: 4},
          opacity: active ? 1 : 0.2,
          marginLeft: !leftIcon ? -2 : 0
        }}
        onMouseOver={() => { setIsOver(true); }}
        onMouseLeave={() => { setIsOver(false); }}
      >
        {leftIcon && <Box
          component="span"
          className="svg-color"
          sx={{
            width: 18,
            height: 18,
            display: 'inline-block',
            bgcolor: isOver ? theme.palette.palette_style.text.selected : color ? color : theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/${icon}.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/${icon}.svg) no-repeat center / contain`,
            marginRight: 1,
            marginTop: 0.2
          }}
        />}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              fontSize: '16px',
              color: isOver ? theme.palette.palette_style.text.selected : color ? color : theme.palette.palette_style.text.primary
            }}
          >
            {title}
          </Box>
        </Box>
        {!leftIcon && <Box
          component="span"
          className="svg-color"
          sx={{
            width: 18,
            height: 18,
            display: 'inline-block',
            bgcolor: isOver ? theme.palette.palette_style.text.selected : color ? color : theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/toolbar/${icon}.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/${icon}.svg) no-repeat center / contain`,
            marginLeft: 1,
            marginTop: 0.2
          }}
        />}
      </Box>
    );
}