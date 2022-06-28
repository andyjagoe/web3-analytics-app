import useSWR from 'swr'
import axios from 'axios'


export default function usePopularQueries() {
    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR('/api/query/popular', fetcher)
    
    return {
      popularQueries: data,
      isLoading: !myError && !data,
      isError: myError
    }
}