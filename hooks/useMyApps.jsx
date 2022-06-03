import { useSession } from "next-auth/react"
import useSWR from 'swr'
import axios from 'axios'



export default function useMyApps() {
    const { data: session } = useSession()

    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        () => session ? ['/api/apps/mine'] : null, fetcher)
    
    return {
      myApps: data,
      isLoading: !myError && !data,
      isError: myError
    }
}