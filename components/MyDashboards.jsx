import {
    Grid,
    Typography
} from '@mui/material'
import Link from '../src/Link'
import useMyDashboards from "../hooks/useMyDashboards.jsx"
import ItemCell from "./ItemCell.jsx"


const MyDashboards = () => {
    const {myDashboards, isLoading, isError} = useMyDashboards()
    
    return (
        <Grid container spacing={0} direction="column">          
            <Grid item xs={12}>

                {!isLoading && myDashboards.Items?.map((item) => 
                (
                    <ItemCell 
                        key={`#${item.pk}#${item.slug}`} 
                        item={item} 
                        from="mine"
                    />
                ))}            

                {!isLoading && myDashboards.Items?.length === 0 &&
                    <Typography variant="subtitle1">
                        You haven&apos;t created any dashboards.&nbsp; 
                        <Link color="inherit" href="/dashboards/new">Create one now</Link>
                    </Typography>              
                }
                
            </Grid>
      </Grid>
    )
}

export default MyDashboards;  