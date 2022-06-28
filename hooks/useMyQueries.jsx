import { useSession } from "next-auth/react"
import useSWR from 'swr'
import axios from 'axios'



export default function useMyQueries() {
    const { data: session } = useSession()

    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        () => session ? ['/api/query/mine', session.user.id] : null, fetcher)
    
    return {
      myQueries: data,
      isLoading: !myError && !data,
      isError: myError
    }
}