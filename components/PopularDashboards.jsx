import {
    Grid
} from '@mui/material'  
import usePopularDashboards from "../hooks/usePopularDashboards.jsx"
import ItemCell from "./ItemCell.jsx"


const PopularDashboards = () => {
    const {popularDashboards, isLoading} = usePopularDashboards()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && popularDashboards.Items?.map((item) => 
                (
                        <ItemCell key={`#${item.pk}#${item.slug}`} item={item} />
                ))
            }            
            </Grid>
      </Grid>
    )
}

export default PopularDashboards;  