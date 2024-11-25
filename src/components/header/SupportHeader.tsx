import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Avatar from "src/components/avatar/Avatar";
import { useTheme } from "@mui/material/styles";

type SupportHeaderProps = {
  onlineStatus: boolean;
  label: string;
  handleClose?: () => void;
};

const SupportHeader = (props: SupportHeaderProps) => {
  const { onlineStatus, label, handleClose } = props;
  const theme = useTheme();

  const SUPPORT_ONLINE_COLOR = 'green';
  const SUPPORT_OFFLINE_COLOR = 'red';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.palette_style.background.selected,
        pl: 2,
        py: 1
      }}
    >
      <Box
        sx={{
          display: 'flex',
          color: theme.palette.palette_style.text.selected
        }}
      >
        <Avatar
          label='S'
          avatarUrl=''
          color={onlineStatus ? SUPPORT_ONLINE_COLOR : SUPPORT_OFFLINE_COLOR}
          size={36}
          toolTipLabel=''
          visibleStatus={true}
        />
        <Box
          sx={{
            mt: 1,
            ml: 1,
            fontSize: 15
          }}
        >
          {label}
        </Box>
      </Box>
      {handleClose && <Box
        component="span"
        className="svg-color add_choice"
        sx={{
          width: 20,
          height: 20,
          display: "inline-block",
          bgcolor: theme.palette.palette_style.text.primary,
          mask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
          WebkitMask: `url(/assets/icons/table/Close.svg) no-repeat center / contain`,
          cursor: "pointer",
          position: 'absolute',
          right: '12px',
          top: '16px'
        }}
        onClick={handleClose}
      />}
    </Box>
  );
};

export default SupportHeader;
