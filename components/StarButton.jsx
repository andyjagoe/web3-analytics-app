import {
    Button
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import axios from 'axios'
import useStars from "../hooks/useStars.jsx"
import { useSession } from "next-auth/react"
import { useSWRConfig } from 'swr'
  

const StarButton = ({item}) => {
    const { mutate } = useSWRConfig()
    const { data: session } = useSession()
    const itemCellType = item.sk.split("#")[0] || null
    const type = item.type.toLowerCase()
    const matchString = `STAR#${itemCellType}#${item.pk.substring(5)}#${item.slug}`
    const {myStars} = useStars(itemCellType)

    const starItem = async () => {
        const response = await axios({
            method: 'put',
            url: `/api/users/${item.pk.substring(5)}/${type}/${item.slug}/star`
        })
        if (response.status === 201) {
            await mutate(['/api/stars', session.user.id, itemCellType])
            mutate(`/api/users/${item.pk.substring(5)}/${type}/${item.slug}`) 
            mutate(`/api/${type}/popular`)          
            mutate([`/api/${type}/mine`, session.user.id])
            mutate([`/api/${type}/favorites`, session.user.id]) 
            return response
        }
        
        return null
    }

    const unstarItem = async () => {
        const response = await axios({
            method: 'delete',
            url: `/api/users/${item.pk.substring(5)}/${type}/${item.slug}/star`
        })
        if (response.status === 204) {
            await mutate(['/api/stars', session.user.id, itemCellType])
            mutate(`/api/users/${item.pk.substring(5)}/${type}/${item.slug}`) 
            mutate(`/api/${type}/popular`)
            mutate([`/api/${type}/mine`, session.user.id])    
            mutate([`/api/${type}/favorites`, session.user.id])
            return response
        }

        return null
    }

    return (
    <>
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
    </>
  ) 
}

export default StarButton
