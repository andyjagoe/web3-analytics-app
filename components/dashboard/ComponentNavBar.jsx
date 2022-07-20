import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useSWRConfig } from 'swr'
import axios from 'axios'


const ComponentNavBar = ({item, userId, slug}) => {
  const { mutate } = useSWRConfig()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null);
  }

  const removeComponent = async () => {
    handleClose()
    try {
      const response = await axios({
        method: 'delete',
        url: `/api/users/${userId}/dashboard/${slug}/components/${item.uid}`
      })
      if (response.status === 204) {
        mutate(`/api/users/${userId}/dashboard/${slug}/components`) 
      }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="absolute" color="dashboardNav">
          <Toolbar variant="dense">
            <div>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu" 
              sx={{ mr: 2 }}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={removeComponent}>Remove</MenuItem>
            </Menu>
            </div>
            <Typography noWrap variant="h6" color="inherit" component="div">
              {item.name}
            </Typography>
          </Toolbar>
        </AppBar>
    </Box>
  )
}

export default ComponentNavBar;  