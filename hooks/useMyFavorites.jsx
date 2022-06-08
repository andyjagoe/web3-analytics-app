import { useSession } from "next-auth/react"
import useSWR from 'swr'
import axios from 'axios'



export default function useMyFavorites() {
    const { data: session } = useSession()

    const fetcher = url => axios.get(url).then(res => {
      const keyName = Object.keys(res.data.Responses)[0]
      const sorted = res.data?.Responses?.[keyName].sort((a, b) => {
        return b.starCount - a.starCount
      })
      return sorted
    })

    const { data: data, error: myError } = useSWR(
        () => session ? ['/api/apps/favorites', session.user.id] : null, fetcher)
    
    return {
      myFavorites: data,
      isLoading: !myError && !data,
      isError: myError
    }
}