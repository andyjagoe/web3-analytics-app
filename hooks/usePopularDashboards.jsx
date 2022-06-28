import useSWR from 'swr'
import axios from 'axios'


export default function usePopularDashboards() {
    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR('/api/dashboard/popular', fetcher)
    
    return {
      popularDashboards: data,
      isLoading: !myError && !data,
      isError: myError
    }
}