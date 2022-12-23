import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'
import {
    useConnect,
    useAccount,
} from 'wagmi'
import {useTheme} from '@mui/material/styles'


const ConnectWalletDialog = (props, ref) => {
    const theme = useTheme()
    const { 
        connect, 
        connectors, 
        error: connectError, 
        isConnecting, 
        pendingConnector 
    } = useConnect({
        onSettled(data, error) {
            if (!error){
                handleClose()
                props.handleAddFundsOpenClick()    
            }
        },
    })
    const { data: account } = useAccount()
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
        aria-labelledby="form-dialog-conect-wallet"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="form-dialog-connect-wallet">Connect Wallet</DialogTitle>
        <DialogContent>       
            {connectors.map((connector) => (
                <Button
                    disabled={!connector.ready}
                    fullWidth
                    variant="outlined"
                    key={connector.id}
                    onClick={() => connect(connector)}
                >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isConnecting &&
                    connector.id === pendingConnector?.id &&
                    ' (connecting)'}
                </Button>
            ))}

            {connectError && 
            <Alert severity="error" sx={{marginTop: theme.spacing(4)}}>
                {connectError.message}
            </Alert>
            }                 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
    </Dialog>
    )
}

export default forwardRef(ConnectWalletDialog);  