import {
    Grid,
    Typography,
} from '@mui/material'  
import useMyFavoriteQueries from "../hooks/useMyFavoriteQueries.jsx"
import ItemCell from "./ItemCell.jsx"


const MyFavoriteQueries = () => {
    const {myFavoriteQueries, isLoading, isError} = useMyFavoriteQueries()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && !isError && myFavoriteQueries?.length > 0 && myFavoriteQueries.map((item) => 
                (
                    <ItemCell 
                        key={`#${item.pk}#${item.slug}`} 
                        item={item} 
                        from="favorites"
                    />
                ))}
                
                {!isLoading && !isError && myFavoriteQueries?.length === 0 &&
                    <Typography variant="subtitle1">
                        You haven&apos;t starred any queries yet.
                    </Typography>              
                }

            </Grid>
      </Grid>
    )
}

export default MyFavoriteQueries;  