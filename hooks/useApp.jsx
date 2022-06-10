import useSWR from 'swr'
import axios from 'axios'


export default function useApp(userId, appSlug) {

    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        `/api/users/${userId}/${appSlug}`, fetcher)
    
    return {
      myItem: data,
      isLoading: !myError && !data,
      isError: myError
    }
}