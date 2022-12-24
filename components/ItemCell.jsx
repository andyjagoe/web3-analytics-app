import {Card,
    CardContent,
    Grid,
    Stack,
    Avatar,
    Link
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import useUser from "../hooks/useUser.jsx"
import useOnChainAppData from "../hooks/useOnChainAppData.jsx"
import StarButton from "./StarButton.jsx"
import { useRouter } from 'next/router'
  

const ItemCell = ({item, from}) => {
    const theme = useTheme()
    const router = useRouter()
    const {myAppData} = useOnChainAppData(item.address)
    const {myUser} = useUser(item.pk.substring(5))
    const formattedType = item.type.toLowerCase()

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
                                    onClick={() => {router.push(
                                        `/users/${item.pk.substring(5)}/${formattedType}/${item.slug}${from? `?from=${from}`:""}`
                                    )}}
                                >
                                    {item.name? item.name:myAppData? myAppData.appName:item.slug}
                                </Link>
                                <div>
                                    Created by&nbsp; 
                                    <Link                         
                                        color="inherit" 
                                        onClick={() => {router.push(
                                            `/users/${item.pk.substring(5)}`
                                        )}}
                                    >
                                        {myUser?.Item?.name? myUser.Item.name:item.pk.substring(5)}
                                    </Link>
                                </div>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={2} sx={{textAlign:"right"}}>
                        <StarButton item={item}/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </>
  ) 
}

export default ItemCell
