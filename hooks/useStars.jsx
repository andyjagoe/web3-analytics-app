import { useSession } from "next-auth/react"
import useSWR from 'swr'
import axios from 'axios'



export default function useStars(type) {
    const { data: session } = useSession()

    const fetcher = url => axios.get(url, { params: { type: type } }).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        () => session ? ['/api/stars', session.user.id, type] : null, fetcher, {
            revalidateIfStale: false,
          })
    
    return {
      myStars: data,
      isLoading: !myError && !data,
      isError: myError
    }
}