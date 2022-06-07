import {
    Grid
} from '@mui/material'  
import useMyFavorites from "../hooks/useMyFavorites.jsx"
import ItemCell from "./ItemCell.jsx"


const MyFavorites = () => {
    const {myFavorites, isLoading} = useMyFavorites()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && myFavorites?.map((item) => 
                (
                    <ItemCell key={`#${item.pk}#${item.slug}`} item={item} />
                ))
            }            
            </Grid>
      </Grid>
    )
}

export default MyFavorites;  