import {
    Grid,
    Typography,
} from '@mui/material'  
import useMyFavoriteDashboards from "../hooks/useMyFavoriteDashboards.jsx"
import ItemCell from "./ItemCell.jsx"


const MyFavoriteDashboards = () => {
    const {myFavoriteDashboards, isLoading, isError} = useMyFavoriteDashboards()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && !isError && myFavoriteDashboards?.length > 0 
                && myFavoriteDashboards.map((item) => 
                (
                    <ItemCell 
                        key={`#${item.pk}#${item.slug}`} 
                        item={item} 
                        from="favorites"
                    />
                ))}
                
                {!isLoading && !isError && myFavoriteDashboards?.length === 0 &&
                    <Typography variant="subtitle1">
                        You haven&apos;t starred any dashboards yet.
                    </Typography>              
                }

            </Grid>
      </Grid>
    )
}

export default MyFavoriteDashboards;  