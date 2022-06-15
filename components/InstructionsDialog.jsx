import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import InstructionsTabs from "./InstructionsTabs.jsx"


const InstructionsDialog = (props, ref) => {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };


    useImperativeHandle(ref, () => ({
      handleOpenClick() {
        handleClickOpen()
      }
    }), [])
    
    return (
      <Dialog 
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-instructions"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-instructions">Install and Use Instructions</DialogTitle>
        <DialogContent>
          <InstructionsTabs userId={props.userId} appSlug={props.appSlug} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
    </Dialog>
    )
}

export default forwardRef(InstructionsDialog);  