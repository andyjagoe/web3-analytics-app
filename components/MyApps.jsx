import {
    Grid
} from '@mui/material'  
import useMyApps from "../hooks/useMyApps.jsx"
import ItemCell from "./ItemCell.jsx"


const MyApps = () => {
    const {myApps, isLoading} = useMyApps()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && myApps.Items?.map((item) => 
                (
                        <ItemCell key={item.slug} item={item} />
                ))
            }            
            </Grid>
      </Grid>
    )
}

export default MyApps;  