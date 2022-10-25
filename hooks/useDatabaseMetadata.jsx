import { useSession } from "next-auth/react"
import useSWR from 'swr'
import axios from 'axios'


export default function useDatabaseMetadata() {
    const { data: session } = useSession()

    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        () => session ? '/api/database' : null, 
        fetcher, 
        {   revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false 
        })
        
    return {
      myDatabaseMetadata: data,
      isLoading: !myError && !data,
      isError: myError
    }
}