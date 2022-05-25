import * as React from 'react'
import {
  CircularProgress,
} from '@mui/material'
import {useTheme} from '@mui/material/styles'

const LoadingPage = () => {
    const theme = useTheme();
    return (
    <div className='loading'>
        <CircularProgress sx={{ marginTop: theme.spacing(8)}} />
    </div>
  )
}

export default LoadingPage;  