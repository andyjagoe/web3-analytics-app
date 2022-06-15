import {
  Box,
} from '@mui/material'
import PropTypes from 'prop-types'


const TabPanel = (props) => {
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
    )
}


TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

    
export default TabPanel