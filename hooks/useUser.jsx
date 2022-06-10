import useSWR from 'swr'
import axios from 'axios'


export default function useUser(userId) {
    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
      () => userId ? `/api/users/${userId}` : null, fetcher)
    
    return {
      myUser: data,
      isLoading: !myError && !data,
      isError: myError
    }
}