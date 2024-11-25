import { forwardRef } from 'react';
// material
import { IconButton } from '@mui/material';
//
import { ButtonAnimate } from '../animate';
type MIconButtonProps = {
    other:any,
    children:any
    ref: any
}
// ----------------------------------------------------------------------
export default function MIconButton({ other, children,ref }: MIconButtonProps) {
    return (
        <ButtonAnimate>
        <IconButton ref={ref} {...other}>
          {children}
        </IconButton>
      </ButtonAnimate>
    )
}
