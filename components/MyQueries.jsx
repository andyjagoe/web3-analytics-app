import {
    Grid,
    Typography
} from '@mui/material'
import Link from '../src/Link'
import useMyQueries from "../hooks/useMyQueries.jsx"
import ItemCell from "./ItemCell.jsx"


const MyQueries = () => {
    const {myQueries, isLoading, isError} = useMyQueries()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && myQueries.Items?.map((item) => 
                (
                    <ItemCell 
                        key={`#${item.pk}#${item.slug}`} 
                        item={item} 
                        from="mine"
                    />
                ))}            

                {!isLoading && myQueries.Items?.length === 0 &&
                    <Typography variant="subtitle1">
                        You haven&apos;t created any queries.&nbsp; 
                        <Link color="inherit" href="/queries/new">Create one now</Link>
                    </Typography>              
                }
                
            </Grid>
      </Grid>
    )
}

export default MyQueries;  