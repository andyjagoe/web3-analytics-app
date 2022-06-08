import {Card,
    CardContent,
    Grid,
    Stack,
    Avatar,
    Button
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import {useTheme} from '@mui/material/styles'
import axios from 'axios'
import Link from '../src/Link'
import useUser from "../hooks/useUser.jsx"
import useStars from "../hooks/useStars.jsx"
import { useSession, signIn } from "next-auth/react"
import { useSWRConfig } from 'swr'
  

const ItemCell = ({item}) => {
    const theme = useTheme()
    const { mutate } = useSWRConfig()
    const { data: session } = useSession()
    const {myUser} = useUser(item.pk.substring(5))
    const itemCellType = item.sk.split("#")[0] || null
    const matchString = `STAR#${itemCellType}#${item.pk.substring(5)}#${item.slug}`
    const {myStars} = useStars(itemCellType)

    const starItem = async () => {
        const response = await axios({
            method: 'put',
            url: `/api/users/${item.pk.substring(5)}/${item.slug}/star`
        })
        if (response.status === 201) {
            mutate(['/api/stars', session.user.id, itemCellType])
            mutate('/api/apps/popular')          
            mutate(['/api/apps/mine', session.user.id])
            mutate(['/api/apps/favorites', session.user.id])   
            return response
        }
        
        return null
    }

    const unstarItem = async () => {
        const response = await axios({
            method: 'delete',
            url: `/api/users/${item.pk.substring(5)}/${item.slug}/star`
        })
        if (response.status === 204) {
            mutate(['/api/stars', session.user.id, itemCellType])
            mutate('/api/apps/popular')
            mutate(['/api/apps/mine', session.user.id])    
            mutate(['/api/apps/favorites', session.user.id])   
            return response
        }

        return null
    }

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
                        {myStars?.Items?.some(item => item.sk === 
                                    matchString)?
                        <Button 
                            startIcon={<StarIcon />}
                            disabled={session? false:true}
                            onClick={()=> {unstarItem()}}
                        >
                            {item.starCount}
                        </Button>
                        :
                        <Button 
                            startIcon={<StarBorderOutlinedIcon />}
                            disabled={session? false:true}
                            onClick={()=> {starItem()}}
                        >
                            {item.starCount}
                        </Button>
                    }       
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </>
  ) 
}

export default ItemCell
