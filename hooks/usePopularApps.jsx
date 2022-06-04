import useSWR from 'swr'
import axios from 'axios'


export default function usePopularApps() {
    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR('/api/apps/popular', fetcher)
    
    return {
      popularApps: data,
      isLoading: !myError && !data,
      isError: myError
    }
}