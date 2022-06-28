import { useState, useRef } from 'react'
import {
  Breadcrumbs,
  Typography,
  Grid,
  Snackbar,
} from '@mui/material'
import Link from '../../../../../src/Link'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useUser from "../../../../../hooks/useUser.jsx"
import copy from 'copy-to-clipboard';
import useItem from "../../../../../hooks/useItem.jsx"
import StarButton from "../../../../../components/StarButton.jsx"



const DashboardPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { userId, slug } = router.query
  const {myUser} = useUser(userId)
  const {myItem} = useItem(userId, 'dashboard', slug)
  const instructionsRef = useRef();

  // Handle instructions dialog
  const handleOpenClick = () => {
    if (instructionsRef.current) {
      (instructionsRef.current as any).handleOpenClick()
    }
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
              <Typography color="textPrimary">{myItem? myItem?.Item?.name:''}</Typography>
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

  </div>
  )
}

export default DashboardPage;