import { useState, useEffect } from 'react';
import {
  DialogContent,
  Drawer,
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { connect } from 'react-redux';
import ChatForm from './ChatForm';
import { ChatType } from 'src/enums/ChatType';
import { TranslationText } from "src/models/SharedModels";

type ChatFormPanelProps = {
  chatType: ChatType;
  id: number;
  open: boolean;
  translations: TranslationText[];
  onClose: () => void;
}

const ChatFormPanel = ({ chatType, id, open, translations, onClose }: ChatFormPanelProps) => {
  const theme = useTheme();
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', lg: '500px' },
          border: 'none',
          // height: `${windowHeight}px`,
          height: "100vh",
          backgroundColor: theme.palette.palette_style.background.default,
        },
      }}
    >
      {/* <Box sx={{ display: 'flex', width: '100%', px: {xs: 1, md: 3}, marginTop: 4, paddingBottom: 2, borderBottom: `1px solid ${theme.palette.palette_style.border.default}` }}>
        <Box
          component="span"
          className="svg-color"
          sx={{
            width: 22,
            height: 22,
            display: 'inline-block',
            bgcolor: theme.palette.palette_style.text.primary,
            mask: `url(/assets/icons/arrow_back.svg) no-repeat center / contain`,
            WebkitMask: `url(/assets/icons/arrow_back.svg) no-repeat center / contain`,
            cursor: 'pointer',
            marginRight: {xs: 1.5, md: 4}
          }}
          onClick={() => {  }}
        />
      </Box>  */}
      <DialogContent sx={{ p: 0 }}>
        <ChatForm handleClose={onClose} chatType={chatType} id={id} translations={translations} />
      </DialogContent>
    </Drawer>
  );
};

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatFormPanel);