import {
    Grid,
    Typography,
} from '@mui/material'  
import useMyFavorites from "../hooks/useMyFavorites.jsx"
import ItemCell from "./ItemCell.jsx"


const MyFavorites = () => {
    const {myFavorites, isLoading, isError} = useMyFavorites()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && !isError && myFavorites.map((item) => 
                (
                    <ItemCell key={`#${item.pk}#${item.slug}`} item={item} />
                ))}

                {!isLoading && isError &&
                    <Typography variant="subtitle1">
                        You haven't starred any apps yet.
                    </Typography>              
                }

            </Grid>
      </Grid>
    )
}

export default MyFavorites;  