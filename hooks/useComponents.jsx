import useSWR from 'swr'
import axios from 'axios'


export default function useComponents(userId, type, slug) {
    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        `/api/users/${userId}/${type}/${slug}/components`, fetcher)
    
    return {
      myComponents: data,
      isLoading: !myError && !data,
      isError: myError
    }
}