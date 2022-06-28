import { useSession } from "next-auth/react"
import useSWR from 'swr'
import axios from 'axios'



export default function useMyFavoriteQueries() {
    const { data: session } = useSession()

    const fetcher = url => axios.get(url).then(res => {
      if (res.data.Responses.length === 0) return []    

      const keyName = Object.keys(res.data.Responses)[0]
      const sorted = res.data?.Responses?.[keyName].sort((a, b) => {
        return b.starCount - a.starCount
      })
      return sorted
    })

    const { data: data, error: myError } = useSWR(
        () => session ? ['/api/query/favorites', session.user.id] : null, fetcher)
    
    return {
      myFavoriteQueries: data,
      isLoading: !myError && !data,
      isError: myError
    }
}