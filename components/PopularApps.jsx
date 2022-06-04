import {
    Grid
} from '@mui/material'  
import usePopularApps from "../hooks/usePopularApps.jsx"
import ItemCell from "./ItemCell.jsx"


const PopularApps = () => {
    const {popularApps, isLoading} = usePopularApps()
    
    return (
        <Grid container spacing={0} direction="column">          
                <Grid item xs={12}>

                {!isLoading && popularApps.Items?.map((item) => 
                (
                        <ItemCell key={item.slug} item={item} />
                ))
            }            
            </Grid>
      </Grid>
    )
}

export default PopularApps;  