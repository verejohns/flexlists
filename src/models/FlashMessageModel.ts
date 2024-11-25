import { AlertColor } from "@mui/material";

export type FlashMessageModel = {
    message:string;
    type:AlertColor;
    autoHideDuration?: number;
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right'
}