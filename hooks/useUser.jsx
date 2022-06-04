import useSWR from 'swr'
import axios from 'axios'


export default function useUser(userId) {
    const fetcher = url => axios.get(url).then(res => res.data)

    const { data: data, error: myError } = useSWR(
        `/api/users/${userId}`, fetcher)
    
    return {
      myUser: data,
      isLoading: !myError && !data,
      isError: myError
    }
}