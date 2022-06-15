import { ethers } from "ethers"
import useSWR from 'swr'
import Web3Analytics from "../schema/Web3Analytics.json"



export default function useAppUserCount(appAddress) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_NODE_URL);

    const fetcher = async (...args) => {    
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            provider
        )
                
        return contract.getUserCount(appAddress)
        .then(async result => {
            return result;
        })
        .catch(err => {
            console.log(err);
        });

    }  

    const { data: data, error: myError } = useSWR(
        '/api/getUserCount', appAddress, fetcher)
    
    return {
      myUserCount: data,
      isLoading: !myError && !data,
      isError: myError
    }
}