import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Link from '../../../../src/Link'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useUser from "../../../../hooks/useUser.jsx"
import useOnChainApp from "../../../../hooks/useOnChainApp.jsx"
import copy from 'copy-to-clipboard';
import { useSession } from "next-auth/react"
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import bash from 'react-syntax-highlighter/dist/cjs/languages/hljs/bash'
import agate from 'react-syntax-highlighter/dist/cjs/styles/hljs/agate'
import useApp from "../../../../hooks/useApp.jsx"
import StarButton from "../../../../components/StarButton.jsx"
import styles from '../../../../styles/AppPage.module.css' assert { type: 'css' }


SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('bash', bash)


const AppPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { userId, appSlug } = router.query
  const {myUser} = useUser(userId)
  const {myOnChainApp} = useOnChainApp(userId, appSlug)
  const {myItem} = useApp(userId, appSlug)
  const { data: session } = useSession()

  // Handle instructions dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
    <div>
      <Head>
        <title>Web3 Analytics</title>
        <meta name="description" content="A decentralized analytics platform where users own their data." />
      </Head>

      <Grid container direction="row" sx={{ marginTop: theme.spacing(4), alignItems: 'center'}}>
        <Grid item xs={9}>
          <Grid container>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/">Home</Link>
              <Link color="inherit" href={`/users/${userId}`}>
                {myUser?.Item?.name? myUser.Item.name:userId}
              </Link>
              <Typography color="textPrimary">{myOnChainApp? myOnChainApp.appName:appSlug}</Typography>
                {myOnChainApp? myOnChainApp.appName:appSlug}
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

    <Grid container spacing={2} sx={{ marginTop: theme.spacing(2)}}>
      <Grid item xs={12}>
      <Paper variant='elevation' elevation={1} sx={{padding: theme.spacing(2)}}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <>
            <Typography variant="body2">
              Registered users
            </Typography>              
            <Typography component="h1" variant="h3">
              0
            </Typography>
            </>
          </Grid>
          <Grid item xs={6}>
            <TextField
                  name="appAddress"
                  variant="outlined"
                  fullWidth
                  disabled
                  id="appAddress"
                  label="App Address"
                  value={myOnChainApp?.appAddress? myOnChainApp?.appAddress:''}
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
                        <ArrowForwardIosIcon />
                      </IconButton>
                      :
                      <></>
                    }
                  </InputAdornment>
                }}
            />
        
            {session && userId === session?.user?.id?
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {handleClickOpen()}}
                sx={{ marginTop: theme.spacing(2)}}
              >
                Install Instructions
              </Button>
              :
              <></>
            }
            
          </Grid>
        </Grid>
      </Paper>

      </Grid>
    </Grid>

    <Snackbar
      anchorOrigin= {{ vertical: 'top', horizontal: 'center' }}
      key={snackbarKey}
      autoHideDuration={6000}
      open={openSnackbar}
      onClose={handleSnackbarClose}
      message={snackbarMessage}
    />

    <Dialog 
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-instructions"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-instructions">Install and Use Instructions</DialogTitle>
      <DialogContent>
        <>
        <SyntaxHighlighter language="bash" style={agate}>
          {`npm install analytics\nnpm install analytics-plugin-web3analytics`}
        </SyntaxHighlighter>
        <Typography variant="body1">
          Usage
        </Typography>
        <SyntaxHighlighter language="javascript" style={agate}>
          {`import Analytics from 'analytics'
import web3Analytics from 'analytics-plugin-web3analytics'

/* Initialize analytics & load plugins */
const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    web3Analytics({
      appId: '${myOnChainApp? myOnChainApp.appAddress:'YOUR_WEB3ANALYTICS_APP_ID'}',
      jsonRpcUrl: 'https://eth-rinkeby.alchemyapi.io/v2/your_key_here'
    })
  ]
})`}
        </SyntaxHighlighter>
        <Typography variant="body1">
            See also this&nbsp;      
            <a href="https://github.com/andyjagoe/web3-analytics-demo" className={styles.instructions}
            rel="noreferrer noopener" target="_blank" >example app</a> and front end&nbsp;
            <a href="https://getanalytics.io/" target="_blank" className={styles.instructions}
            rel="noreferrer noopener">instrumentation documentation</a>.
        </Typography>
        </>        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
  </Dialog>

  </div>
  )
}

export default AppPage;