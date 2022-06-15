import { useState } from 'react'
import {
  Box,
  Tab,
  Tabs,
  Grid
} from '@mui/material'
import TabPanel from "./TabPanel.jsx"
import InstructionsNPM from "./InstructionsNPM.jsx"
import InstructionsCDN from "./InstructionsCDN.jsx"


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const InstructionsTabs = ({userId, appSlug}) => {
    const [tabValue, setTabValue] = useState(0)

    const handleChange = (event, newValue) => {
          setTabValue(newValue)
    }
        
    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleChange} aria-label="Instructions tabs">
                            <Tab label="NPM" {...a11yProps(0)} />
                            <Tab label="CDN" {...a11yProps(1)} />
                        </Tabs>
                </Box>
                    <>
                        <TabPanel value={tabValue} index={0}>
                            <InstructionsNPM userId={userId} appSlug={appSlug}/>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <InstructionsCDN userId={userId} appSlug={appSlug}/>
                        </TabPanel>
                    </>
                </Grid>
            </Grid>
        </>
    )
}
    
export default InstructionsTabs