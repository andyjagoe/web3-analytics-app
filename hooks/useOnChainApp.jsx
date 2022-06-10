import { useSession } from "next-auth/react"
import { ethers } from "ethers"
import useSWR from 'swr'
import Web3Analytics from "../schema/Web3Analytics.json"
import axios from 'axios'



export default function useOnChainApp(userId, appSlug) {
    const { data: session } = useSession()
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_NODE_URL);

    const fetcher = async (url) => {
        const res = await axios.get(url)
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            provider
        )
        
        return contract.getAppData(res.data.Item.address)
        .then(async result => {
            return result;
        })
        .catch(err => {
            console.log(err);
        });
    }

    const { data: data, error: myError } = useSWR(
        () => session ? [`/api/users/${userId}/${appSlug}`, 'appData'] : null, fetcher)
    
    return {
      myOnChainApp: data,
      isLoading: !myError && !data,
      isError: myError
    }
}