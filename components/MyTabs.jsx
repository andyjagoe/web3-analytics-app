import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Grid
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import PropTypes from 'prop-types';
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
            <Box sx={{ p: 2,
                        padding: 0
                     }}>
                {children}
            </Box>
        )}
      </div>
    );
}


TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const MyTabs = ({tabType, tabSelected}) => {
    const { status } = useSession()
    const theme = useTheme()
    const router = useRouter()
    const [tabValue, setTabValue] = useState(tabSelected);


    const handleChange = (event, newValue) => {
        const pathArray = router.asPath.split("/")
        switch(newValue) {
            case 0:
                router.push(`/${pathArray[1]}/popular`)
                break;
            case 1:
                router.push(`/${pathArray[1]}/trending`)
                break;
            case 2:
                router.push(`/${pathArray[1]}/favorites`)
                break;
            case 3:
                router.push(`/${pathArray[1]}/mine`)
                break;
            default:
                router.push(`/${pathArray[1]}/popular`)
                break;
          }
          setTabValue(newValue);
    };  
        
    return (
        <>
            <Grid container spacing={2} sx={{ marginTop: theme.spacing(4)}} >
                <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    {status != "loading" && status == "authenticated" && (
                        <Tabs value={tabValue} onChange={handleChange} aria-label="My, favorites, popular or trending tabs">
                            <Tab label="Popular" {...a11yProps(0)} />
                            <Tab label="Trending" {...a11yProps(1)} />
                            <Tab label="Favorites" {...a11yProps(2)} />
                            <Tab label="Mine" {...a11yProps(3)} />
                        </Tabs>
                    )}
                    {status != "loading" && status != "authenticated" && (
                        <Tabs value={tabValue} onChange={handleChange} aria-label="Popular or trending tabs">
                            <Tab label="Popular" {...a11yProps(0)} />
                            <Tab label="Trending" {...a11yProps(1)} />
                        </Tabs>
                    )}
                </Box>
                {status != "loading" && status == "authenticated" && (
                    <>
                        <TabPanel value={tabValue} index={0}>
                            Popular: {tabType}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            Trending: {tabType}
                        </TabPanel>                
                        <TabPanel value={tabValue} index={2}>
                            Favorites: {tabType}
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
                            Created by you: {tabType}
                        </TabPanel>                
                    </>
                )}
                {status != "loading" && status != "authenticated" && (
                    <>
                        <TabPanel value={tabValue} index={0}>
                            Popular: {tabType}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            Trending: {tabType}
                        </TabPanel>                
                    </>
                )}
                </Grid>
            </Grid>
        </>
    )
}
    
export default MyTabs;  