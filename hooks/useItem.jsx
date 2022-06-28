import useSWR from 'swr'
import axios from 'axios'


export default function useItem(userId, type, appSlug) {

    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        `/api/users/${userId}/${type}/${appSlug}`, fetcher)
    
    return {
      myItem: data,
      isLoading: !myError && !data,
      isError: myError
    }
}