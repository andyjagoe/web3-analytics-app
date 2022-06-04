import { useState } from 'react';
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
import MyApps from "./MyApps.jsx"
import PopularApps from "./PopularApps.jsx"


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
                router.push(`/${pathArray[1]}/favorites`)
                break;
            case 2:
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
                            <Tab label="Favorites" {...a11yProps(1)} />
                            <Tab label="Created by Me" {...a11yProps(2)} />
                        </Tabs>
                    )}
                    {status != "loading" && status != "authenticated" && (
                        <Tabs value={tabValue} onChange={handleChange} aria-label="Popular or trending tabs">
                            <Tab label="Popular" {...a11yProps(0)} />
                        </Tabs>
                    )}
                </Box>
                {status != "loading" && status == "authenticated" && (
                    <>
                        <TabPanel value={tabValue} index={0}>
                            {(() => { 
                                switch(tabType) {
                                case 'APPS':
                                    return <PopularApps />                                            
                                default:
                                    return <>Popular: {tabType}</>
                                }
                            })()}
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            Favorites: {tabType}
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>                            
                            {(() => { 
                                switch(tabType) {
                                case 'APPS':
                                    return <MyApps />                                            
                                default:
                                    return <>Created by you: {tabType}</>
                                }
                            })()}                
                        </TabPanel>                
                    </>
                )}
                {status != "loading" && status != "authenticated" && (
                    <>
                        <TabPanel value={tabValue} index={0}>
                            {(() => { 
                                switch(tabType) {
                                case 'APPS':
                                    return <PopularApps />                                            
                                default:
                                    return <>Popular: {tabType}</>
                                }
                            })()}
                        </TabPanel>
                    </>
                )}
                </Grid>
            </Grid>
        </>
    )
}
    
export default MyTabs;  