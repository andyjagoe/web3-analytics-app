import React, { useState } from "react";
import {AppBar, 
        Typography,
        Toolbar,
        IconButton,
        MenuItem,
        Menu,
        Button,
        } from '@mui/material';
import { AccountCircle } from '@mui/icons-material'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from '../src/Link'
import { useRouter } from 'next/router'
import { blueGrey } from '@mui/material/colors'


export default function MenuAppBar() {
  const { data: session } = useSession()
  const router = useRouter()

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            onClick={() => {router.push('/')}}
          >
            Web3 Analytics
          </Typography>

          <nav>                
            <Link 
              variant="button" 
              color="textPrimary" 
              href="/dashboards"
              sx={{ margin: '20px 10px', color: '#fff', textDecoration: 'none' }}
            >
            Dashboards
            </Link>
            <Link 
              variant="button" 
              color="textPrimary" 
              href="/queries" 
              sx={{ margin: '20px 10px', color: '#fff', textDecoration: 'none' }}
            >
            Queries
            </Link>
            <Link 
              variant="button" 
              color="textPrimary" 
              href="/apps" 
              sx={{ margin: '20px 20px 20px 10px', color: '#fff', textDecoration: 'none' }}
            >
            Apps
            </Link>              
          </nav>

            {!session && (
              <Button
                variant='outlined'
                color='connectButton'
                sx={{ margin: '20px 0px', color: '#FFFFFF' }}
                onClick={() => {signIn()}}
              >
                  Sign In
              </Button>   
            )}

            {session && (
                <div>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ padding: '0' }}
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >   
                    <MenuItem disabled={true}>{session?.user?.email}</MenuItem>
                    <MenuItem onClick={() => { handleClose(); signOut() }}>Sign out</MenuItem>                
                </Menu>
                </div>
            )}            
        </Toolbar>
      </AppBar>

    </div>
  );
}
