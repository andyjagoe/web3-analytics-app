import {Card,
    CardContent,
    Grid,
    Avatar,
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import Link from '../src/Link'
import useUser from "../hooks/useUser.jsx"
  

const ItemCell = ({item}) => {
    const theme = useTheme()
    const {myUser} = useUser(item.pk.substring(5))

    return (
    <>
        <Card variant="outlined">
            <CardContent                         
                sx={{
                    '&:last-child': {
                        paddingBottom: theme.spacing(2)
                    }
                }}
            >
                <Grid 
                    container 
                    spacing={0} 
                    sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            justify:"center"
                        }}>          
                    <Grid item xs={1}>
                        <Avatar
                            alt={item.pk.substring(5)}
                            src={myUser?.Item?.image}
                        >
                            {item.pk.substring(5)}
                        </Avatar>
                    </Grid>
                    <Grid item xs={10}>
                        <Link                                                     
                            color="inherit" 
                            href={`/users/${item.pk.substring(5)}/${item.slug}`}
                        >
                            {item.slug}
                        </Link>
                        <div>
                        Created by&nbsp; 
                        <Link                         
                            color="inherit" 
                            href={`/users/${item.pk.substring(5)}`}
                        >
                            {myUser?.Item?.name? myUser.Item.name:item.pk.substring(5)}
                        </Link>
                        </div>
                    </Grid>
                    <Grid item xs={1}>
                        {item.starCount}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </>
  ) 
}

export default ItemCell
