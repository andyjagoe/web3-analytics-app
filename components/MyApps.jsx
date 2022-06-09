import {
    Grid,
    Typography
} from '@mui/material'
import Link from '../src/Link'
import useMyApps from "../hooks/useMyApps.jsx"
import ItemCell from "./ItemCell.jsx"


const MyApps = () => {
    const {myApps, isLoading, isError} = useMyApps()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && myApps.Items?.map((item) => 
                (
                    <ItemCell key={`#${item.pk}#${item.slug}`} item={item} />
                ))}            

                {!isLoading && myApps.Items?.length === 0 &&
                    <Typography variant="subtitle1">
                        You haven&apos;t created any apps.&nbsp; 
                        <Link color="inherit" href="/apps/new">Create one now</Link>
                    </Typography>              
                }
                
            </Grid>
      </Grid>
    )
}

export default MyApps;  