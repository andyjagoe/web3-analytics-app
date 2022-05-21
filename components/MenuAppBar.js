import React, { useContext, useState } from "react";
import {AppBar, 
        Typography,
        Toolbar,
        IconButton,
        MenuItem,
        Menu,
        Snackbar,
        Button,
        } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';


export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle copying and snackbar messages
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(false);
  const handleSnackbarClick = (message, key) => {
    setSnackbarMessage(message);
    setSnackbarKey(key);
    setOpenSnackbar(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  

  return (
    <div sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/*
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          */}
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1 }}
            onClick={() => {console.log('home')}}
          >
            web3analytics
          </Typography>
          <Button
              variant='outlined'
              sx={{ margin: '20px 30px', color: '#FFFFFF' }}
              onClick={() => {console.log('connect')}}
          >
              Connect Wallet
          </Button>   

        </Toolbar>
      </AppBar>

      <Snackbar
        anchorOrigin= {{ vertical: 'top', horizontal: 'center' }}
        key={snackbarKey}
        autoHideDuration={6000}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

    </div>
  );
}
