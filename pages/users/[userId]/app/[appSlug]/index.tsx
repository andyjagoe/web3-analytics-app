import { useState, useRef, useEffect } from 'react'
import {
  Breadcrumbs,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Button,
  Container,
  Link,
  Stack,
  Tab,
  Tabs,
  CircularProgress,
  Avatar,
} from '@mui/material'
import {
  useAccount,
  useSigner,
} from 'wagmi'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useUser from "../../../../../hooks/useUser.jsx"
import useOnChainApp from "../../../../../hooks/useOnChainApp.jsx"
import useAppBalance from "../../../../../hooks/useAppBalance.jsx"
import copy from 'copy-to-clipboard';
import { useSession } from "next-auth/react"
import useItem from "../../../../../hooks/useItem.jsx"
import useAppUserCount from "../../../../../hooks/useAppUserCount.jsx"
import StarButton from "../../../../../components/StarButton.jsx"
import InstructionsDialog from "../../../../../components/InstructionsDialog.jsx"
import AddFundsDialog from "../../../../../components/AddFundsDialog.jsx"
import ConnectWalletDialog from "../../../../../components/ConnectWalletDialog.jsx"
import TabPanel from "../../../../../components/TabPanel.jsx"


function a11yProps(index:number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY


const AppPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { userId, appSlug } = router.query
  const {myUser} = useUser(userId)
  const {myOnChainApp} = useOnChainApp(userId, appSlug)
  const {myBalance, isLoading:balanceIsLoading} = useAppBalance(userId, appSlug)
  const {myItem} = useItem(userId, 'app', appSlug)
  const {myUserCount, isLoading:userCountIsLoading} = useAppUserCount(userId, appSlug)
  const { data: session } = useSession()
  const { data: signer } = useSigner()
  const { data: account } = useAccount()
  const instructionsRef = useRef()
  const addFundsRef = useRef()
  const connectWalletRef = useRef()
  const [tabValue, setTabValue] = useState(0)
  const [fromNav, setFromNav] = useState("")


  useEffect(() => {
    const { from } = router.query
    if (from && from !== fromNav) {
      setFromNav(from as string)
    }
  }, [router.query])


  // Handle instructions dialog
  const handleOpenClick = () => {
    if (instructionsRef.current) {
      (instructionsRef.current as any).handleOpenClick()
    }
  };

  // Handle add funds dialog
  const handleAddFundsOpenClick = () => {
    if (addFundsRef.current) {
      (addFundsRef.current as any).handleOpenClick()
    }
  };

  // Handle connect wallet dialog
  const handleConnectWalletOpenClick = () => {
    if (connectWalletRef.current) {
      (connectWalletRef.current as any).handleOpenClick()
    }
  };

  const handleAddFundsClick = () => {
    if (account) {
      handleAddFundsOpenClick()
    } else {
      handleConnectWalletOpenClick()
    }
  }

  const handleChange = (event:any, newValue:number) => {
    setTabValue(newValue);
  }  

  // Handle copying and snackbar messages
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarKey, setSnackbarKey] = useState('');
  const handleSnackbarClick = (text:string, message:string, key:string) => {
    copy(text)
    setSnackbarMessage(message);
    setSnackbarKey(key);
    setOpenSnackbar(true);
  };
  const handleSnackbarClose = (event:any, reason:string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  
  return (
    <Container>
      <Head>
        <title>Web3 Analytics</title>
        <meta name="description" content="A decentralized analytics platform where users own their data." />
      </Head>

      <Grid container direction="row" sx={{ marginTop: theme.spacing(4), alignItems: 'center'}}>
        <Grid item xs={9}>
          <Grid container>
            <Breadcrumbs aria-label="breadcrumb">
              <Link 
                color="inherit" 
                onClick={() => {router.push('/')}}
              >Home
              </Link>

              {(() => { 
                  switch(fromNav) {
                  case 'popular':
                      return <Link 
                                color="inherit" 
                                onClick={() => {router.push('/apps/popular')}}
                              >
                              Popular Apps
                            </Link>
                  case 'favorites':
                      return <Link 
                                color="inherit" 
                                onClick={() => {router.push('/apps/favorites')}}
                              >
                              Favorite Apps
                            </Link>
                  case 'mine':
                      return <Link 
                                color="inherit" 
                                onClick={() => {router.push('/apps/mine')}}
                              >
                              My Apps
                            </Link>
                  default:
                      return <Link 
                                color="inherit" 
                                onClick={() => {router.push(`/users/${userId}`)}}
                              >
                              {myUser?.Item?.name? myUser.Item.name:userId}
                            </Link>                           
                  }
              })()}                                     
              
              <Typography color="textPrimary">{myOnChainApp? myOnChainApp.appName:appSlug}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container direction="row-reverse">
            {myItem && myItem.Item && 
            <StarButton item={myItem.Item} />}            
          </Grid>
        </Grid>
      </Grid>


      <Container maxWidth="xs">

      <Tabs 
        value={tabValue} 
        onChange={handleChange} 
        aria-label="Account tabs"
        sx={{marginTop: theme.spacing(4)}}
      >
          <Tab label="Account" {...a11yProps(0)} />
          <Tab label="Details" {...a11yProps(1)} />
          {session && userId === session?.user?.id?
            <Tab label="How to Install" {...a11yProps(2)} />
            :null
          }
      </Tabs>

      <>
        <TabPanel value={tabValue} index={0}>
        <Paper 
          variant='elevation' 
          elevation={1} 
          sx={{padding: theme.spacing(2), marginTop: theme.spacing(0)}}
        >
          <>
            <Typography variant="body2">
              Credits
            </Typography> 

            <Stack direction="row" sx={{ alignItems: 'center'}}>
              <Typography component="h1" variant="h3">
                {(() => { 
                  switch(CURRENCY) {
                    case 'MATIC':
                      return <>
                            <Avatar                                  
                              src="/static/images/coins/polygon-matic-logo-256.png"
                              />                             
                            </>
                    default:
                      return <>
                              <Avatar                                  
                              src="/static/images/coins/ethereum-eth-logo-256.png"
                              />
                            </>                           
                  }
                })()}     
              </Typography>                         
              <Typography component="h1" variant="h3" sx={{ paddingLeft: theme.spacing(1)}}>              
                {balanceIsLoading && <CircularProgress />}
                {!balanceIsLoading && myBalance && Number(myBalance).toFixed(5)}              
                {!balanceIsLoading && !myBalance && Number("0").toFixed(0)}                
              </Typography>                
            </Stack>                                                    

            <Link variant="caption" 
                underline="none"
                alignItems="center"
                href={`https://goerli.etherscan.io/address/0x1a387db642a76bee516f1e16f542ed64ee81772c#events`}
                target="_blank"  
                >
                  <Stack direction="row" alignItems="center">
                    <Typography variant="caption">
                      Charges&nbsp;
                    </Typography>
                    <OpenInNewIcon fontSize="inherit" />
                  </Stack>              
            </Link>
          </>               
        </Paper>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {handleAddFundsClick()}}
          sx={{marginTop: theme.spacing(2)}}
        >
          Add Funds
        </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
        <Paper 
          variant='elevation' 
          elevation={1} 
          sx={{padding: theme.spacing(2), marginTop: theme.spacing(0)}}>
              <>
              <Typography variant="body2">
                Users
              </Typography>              
              <Typography component="h1" variant="h3">                
                {userCountIsLoading && <CircularProgress />}
                {!userCountIsLoading && myUserCount} 
                {!userCountIsLoading && !myUserCount && '0'}           
              </Typography>
              </>
        </Paper>

        <TextField
                name="appAddress"
                variant="outlined"
                fullWidth
                disabled
                id="appAddress"
                label="App Address"
                value={myOnChainApp?.appAddress? myOnChainApp?.appAddress:''}
                sx={{ marginTop: theme.spacing(3)}}
                InputProps={{endAdornment:
                  <InputAdornment position="end">
                    {myOnChainApp?.appAddress?
                      <IconButton
                        onClick={() => { 
                          handleSnackbarClick(
                          myOnChainApp?.appAddress,
                          'App address copied',
                          'app_address'); 
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                      :
                      <></>
                    }
                </InputAdornment>
                }}
            />
          <TextField
              name="appUrl"
              variant="outlined"
              fullWidth
              disabled
              id="appUrl"
              label="App URL"
              value={myOnChainApp?.appUrl? myOnChainApp?.appUrl:'No app url'}
              sx={{ marginTop: theme.spacing(2)}}
              InputProps={{endAdornment:
                <InputAdornment position="end">
                  {myOnChainApp?.appUrl?
                    <IconButton
                      onClick={() => { window.open(myOnChainApp?.appUrl, '_blank'); }}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                    :
                    <></>
                  }
                </InputAdornment>
              }}
          />          
        </TabPanel>

        {session && userId === session?.user?.id?
          <TabPanel value={tabValue} index={2}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => {handleOpenClick()}}
              sx={{ marginTop: theme.spacing(2)}}
            >
              Install Instructions
            </Button>
          </TabPanel>
          :null
        }

      </>
    </Container>

    <ConnectWalletDialog 
      userId={userId} 
      appSlug={appSlug} 
      ref={connectWalletRef} 
      handleAddFundsOpenClick={handleAddFundsOpenClick}
    />
    <AddFundsDialog 
      userId={userId} 
      appSlug={appSlug} 
      ref={addFundsRef} 
      handleConnectWalletOpenClick={handleConnectWalletOpenClick}
    />
    <InstructionsDialog userId={userId} appSlug={appSlug} ref={instructionsRef} />

    <Snackbar
      anchorOrigin= {{ vertical: 'top', horizontal: 'center' }}
      key={snackbarKey}
      autoHideDuration={6000}
      open={openSnackbar}
      onClose={handleSnackbarClose}
      message={snackbarMessage}
    />

  </Container>
  )
}

export default AppPage;