import {
    Grid
} from '@mui/material'  
import usePopularQueries from "../hooks/usePopularQueries.jsx"
import ItemCell from "./ItemCell.jsx"


const PopularQueries = () => {
    const {popularQueries, isLoading} = usePopularQueries()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && popularQueries.Items?.map((item) => 
                (
                        <ItemCell key={`#${item.pk}#${item.slug}`} item={item} />
                ))
            }            
            </Grid>
      </Grid>
    )
}

export default PopularQueries;  