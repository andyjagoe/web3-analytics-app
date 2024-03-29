import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Stack,
  Typography,
  Link,
  Avatar,
  Alert,
  Grid,
  Collapse
} from '@mui/material'
import { ethers } from "ethers"
import {useTheme} from '@mui/material/styles'
import Web3Analytics from "../schema/Web3Analytics.json"
import LoadingButton from '@mui/lab/LoadingButton'
import {
  useAccount,
  useDisconnect,
  useBalance,
  useSigner,
  useNetwork
} from 'wagmi'
import { BigNumberInput } from 'big-number-input'
import useOnChainApp from "../hooks/useOnChainApp.jsx"
import { AccountBalance } from '@mui/icons-material';


const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY


const AddFundsDialog = (props, ref) => {
    const theme = useTheme()
    const [funds, setFunds] = useState("0")
    const {
        activeChain,
        chains,
        isLoading,
        pendingChainId,
        switchNetwork,
    } = useNetwork()
    const { disconnect } = useDisconnect({
      onSettled(data, error) {
        handleClose()
        props.handleConnectWalletOpenClick()
      },
    })
    const { data: signer } = useSigner()
    const { data: account } = useAccount()
    const {data: balance} = useBalance(
      {
        addressOrName: account?.address,
        watch: true,
      }
    )    
    const [disable, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)  
    const [addUpdateError, setAddUpdateError] = useState(false)
    const [addUpdateErrorMessage, setAddUpdateErrorMessage] = useState("")  
    const [open, setOpen] = useState(false)
    const {myOnChainApp} = useOnChainApp(props.userId, props.appSlug)


    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
      setDisabled(formValidation())
    }, [funds, balance])


    const formValidation = () => {   
      if (Number(funds) === 0
          || checkBalance()
          ) {
        return true
      } else {
        return false
      }
    }

    const checkBalance = () => {
      if (!balance) return true
      const fundBn = ethers.BigNumber.from(funds)
      if (fundBn.lte(balance.value)) return false
      return true
    }


    useImperativeHandle(ref, () => ({
      handleOpenClick() {
        handleClickOpen()
      }
    }), [])
    

    const addFunds = async () => {
      if (!signer 
          || !account?.address 
          || Number(funds) === 0
          || !process.env.NEXT_PUBLIC_WEB3ANALYTICS
          ) return

      console.log(process.env.NEXT_PUBLIC_WEB3ANALYTICS)

      setAddUpdateError(false)
      setAddUpdateErrorMessage("")  
      setDisabled(true)
      setLoading(true)
    
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_WEB3ANALYTICS,
        Web3Analytics,
        signer
      )

      try {
        const tx = await contract.topUpBalance(
          myOnChainApp? myOnChainApp.appAddress:null,
          {value: funds}
        )
        await tx.wait()
        handleClose()
        setFunds("0")

      } catch (error) {
          console.log(error)
          setAddUpdateError(true)
          setAddUpdateErrorMessage(
            error.message
          )    
      }    

      setDisabled(false)
      setLoading(false)
}


    const formatAddress = (myAddress) => {
      return myAddress.substr(0, 4) + "..." + myAddress.substr(-4)
    }

    const formatBalance = (myBalance) => {
      const formatted = Number(myBalance.formatted).toFixed(4)
      return formatted
    }


    return (
      <Dialog 
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-add-funds"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="form-dialog-add-funds">Add Funds</DialogTitle>
        <DialogContent>
          {chains.find(({ id }) => id === activeChain?.id) && (
            <>
            <BigNumberInput 
                decimals={18} 
                name="funds"
                id="funds"
                onChange={setFunds}
                value={funds} 
                disabled={disable}
                renderInput={
                    props => 
                    <TextField
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: 
                            <InputAdornment position="start">                        
                                <Stack alignItems="flex-start" justifyContent="flex-start" spacing={0}>                                
                                  {(() => { 
                                    switch(CURRENCY) {
                                      case 'MATIC':
                                        return <>
                                              <Avatar                                  
                                                src="/static/images/coins/polygon-matic-logo-256.png"
                                                sx={{ width: 24, height: 24 }}
                                                />                             
                                              </>
                                      default:
                                        return <>
                                                <Avatar                                  
                                                src="/static/images/coins/ethereum-eth-logo-256.png"
                                                sx={{ width: 24, height: 24 }}
                                                />
                                              </>                           
                                    }
                                  })()}                                     
                                </Stack>
                            </InputAdornment>,
                        }}
                        inputProps={{
                            style: { textAlign: 'right' },
                        }}
                        {...props}
                    />
            }/>
            <Typography variant="caption">              
                <>{account?.address? 
                    <>
                    Wallet: <strong>{formatAddress(account?.address)}</strong> 
                    </>
                    : ''
                  }
                  &nbsp; 
                  {balance? 
                    <>
                    Balance: <strong>{formatBalance(balance)}&nbsp;{CURRENCY}</strong>
                    </>
                    : ''
                  }   
                </>
            </Typography>
            &nbsp;
            <Link variant="caption" 
                onClick={() => { disconnect() }}
                underline="none"
                >
              (Disconnect)
            </Link> 

            <Grid 
              container 
              spacing={1}
              sx={{ 
                marginTop: theme.spacing(1),
              }}
            >
              <Grid 
                item 
                xs={12}
                sx={{ 
                  display: addUpdateError? "block" : "none" 
                }}
              >
                <Collapse in={addUpdateError}>  
                  <Alert severity="error">{addUpdateErrorMessage}</Alert>
                </Collapse>
              </Grid>
            </Grid>
            </>
          )}

          {!chains.find(({ id }) => id === activeChain?.id) && (
              <>
                  <Typography variant="overline" display="block" gutterBottom>
                      Your wallet is set to an unsupported network.
                  </Typography>
                  {chains.map((x) => (
                      <Button
                          disabled={!switchNetwork || x.id === activeChain?.id}
                          fullWidth
                          variant="outlined"
                          key={x.id}
                          onClick={() => switchNetwork?.(x.id)}
                      >
                      Switch to {x.name}
                      {isLoading && pendingChainId === x.id && ' (switching)'}
                      </Button>
                  ))}
                  <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => disconnect()}
                      sx={{marginTop: theme.spacing(2)}}
                  >
                      Disconnect
                  </Button>
              </>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
            <LoadingButton 
              disabled={disable}
              loading={loading}          
              onClick={() => addFunds() } 
              color="primary"
              >
              Add Funds
          </LoadingButton>          
        </DialogActions>
    </Dialog>
    )
}

export default forwardRef(AddFundsDialog);  