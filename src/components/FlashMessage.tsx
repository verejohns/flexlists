import {
Alert,
AlertColor,
Snackbar
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FlashMessageModel } from "src/models/FlashMessageModel";
import { setFlashMessage } from "src/redux/actions/authAction";
type FlashMessageProps = {
   flashMessage:FlashMessageModel|undefined;
   setFlashMessage: (message: FlashMessageModel|undefined) => void;
};
const FlashMessage = ({flashMessage,setFlashMessage: setFlashMessage}:FlashMessageProps) => {
    const router = useRouter();
    const [flash, setFlash] = useState<FlashMessageModel| undefined>(undefined);
    const flashHandleClose = () => {
        setFlash(undefined)
        setFlashMessage(undefined)
      };
    useEffect(() => {
        function checkMessage() {
          if (flashMessage?.message) {
            setFlash(flashMessage)
          }
        }
        checkMessage()
      }, [flashMessage, router.isReady])
      
    return flash && flash.message ?(
        
        <Snackbar 
             open={flash !== undefined} 
             anchorOrigin={{ vertical:flash?.vertical??'bottom', horizontal:flash?.horizontal??'left' }}
             autoHideDuration={flash?.autoHideDuration??6000} 
             onClose={flashHandleClose}>
          <Alert onClose={flashHandleClose} severity={flash?.type as AlertColor} sx={{ width: '100%' }}>
            {flash?.message}
          </Alert>
        </Snackbar>
    ):
    <></>
}
 
const mapStateToProps = (state: any) => ({
    flashMessage: state.auth.flashMessage,
  });
  
  const mapDispatchToProps = {
    setFlashMessage,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);