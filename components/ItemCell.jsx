import {Card,
    CardContent,
    Grid,
    Stack,
    Avatar,
    Button
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
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
                    spacing={2} 
                    sx={{
                            justifyContent: "center",
                            alignItems: "center",
                            justify:"center"
                        }}>          
                    <Grid item xs={10}>
                        <Stack direction="row" sx={{
                            alignItems: "center",
                        }}
                        >                         
                            <Avatar
                                alt={item.pk.substring(5)}
                                src={myUser?.Item?.image}
                            >
                                {item.pk.substring(5)}
                            </Avatar>
                            <Stack sx={{
                                    paddingLeft: theme.spacing(2)
                                }}
                            >
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
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={2} sx={{textAlign:"right"}}>
                        <Button startIcon={<StarIcon />}>
                            {item.starCount}
                        </Button>                        
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </>
  ) 
}

export default ItemCell
