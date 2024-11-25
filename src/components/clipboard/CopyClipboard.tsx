import { Snackbar } from '@mui/material';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useState } from 'react';

type CopyClipboardProps = {
  open?: boolean;
  data: string;
  setOpen?: (open: boolean) => void;
};

const CopyClipboard = (props: CopyClipboardProps) => {
  const { open, data, setOpen } = props;
  const [copyOpen, setCopyOpen] = useState(false);

  useEffect(() => {
    if (typeof open !== 'undefined') setCopyOpen(open);
  }, [open]);

  const handleCopyClose = () => {
    setCopyOpen(false);
    if (setOpen) setOpen(false);
  }

  return (
    <>
      {!setOpen && <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={copyOpen}
        onClose={handleCopyClose}
        message="Copied to clipboard"
        autoHideDuration={1000}
        sx={{ marginTop: {xs: 1, md: 'inherit'}, overflow: 'hidden', borderRadius: { xs: '6px', md: 'inherit' } }}
      />}
      {copyOpen ?
        <DoneIcon
          sx={{ cursor: "pointer" }}
        /> :
        <ContentCopyIcon
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setCopyOpen(true);
            if (setOpen) setOpen(true);
            navigator.clipboard.writeText(data);
          }}
        />}
    </>
  );
};

export default CopyClipboard;
