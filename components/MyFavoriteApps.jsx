import {
    Grid,
    Typography,
} from '@mui/material'  
import useMyFavoriteApps from "../hooks/useMyFavoriteApps.jsx"
import ItemCell from "./ItemCell.jsx"


const MyFavoriteApps = () => {
    const {myFavoriteApps, isLoading, isError} = useMyFavoriteApps()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && !isError && myFavoriteApps?.length > 0 && myFavoriteApps.map((item) => 
                (
                    <ItemCell
                        key={`#${item.pk}#${item.slug}`} 
                        item={item} 
                        from="favorites"
                    />
                ))}

                {!isLoading && !isError && myFavoriteApps?.length === 0 &&
                    <Typography variant="subtitle1">
                        You haven&apos;t starred any apps yet.
                    </Typography>              
                }

            </Grid>
      </Grid>
    )
}

export default MyFavoriteApps;  