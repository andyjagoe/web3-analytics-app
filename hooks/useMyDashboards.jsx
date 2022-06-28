import { useSession } from "next-auth/react"
import useSWR from 'swr'
import axios from 'axios'



export default function useMyDashboards() {
    const { data: session } = useSession()

    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        () => session ? ['/api/dashboard/mine', session.user.id] : null, fetcher)
    
    return {
      myDashboards: data,
      isLoading: !myError && !data,
      isError: myError
    }
}