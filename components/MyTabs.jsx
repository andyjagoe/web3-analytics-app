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

/*
type MyTabsProps = {
    tabType: string
};
*/

const MyTabs = ({tabType}) => {
    const { data: session, status } = useSession()
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };  
        
    return (
        <>
            <Grid container spacing={2} sx={{ marginTop: theme.spacing(1)}} >
                <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    {status != "loading" && status == "authenticated" && (
                        <Tabs value={tabValue} onChange={handleChange} aria-label="My, favorites, popular or trending tabs">
                            <Tab label="My Apps" {...a11yProps(0)} />
                            <Tab label="Favorites" {...a11yProps(1)} />
                            <Tab label="Popular" {...a11yProps(2)} />
                            <Tab label="Trending" {...a11yProps(3)} />
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
                            Created by you: {tabType}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            Favorites: {tabType}
                        </TabPanel>                
                        <TabPanel value={tabValue} index={2}>
                            Popular: {tabType}
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
                            Trending: {tabType}
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