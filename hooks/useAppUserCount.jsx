import { ethers } from "ethers"
import useSWR from 'swr'
import Web3Analytics from "../schema/Web3Analytics.json"
import useOnChainApp from "./useOnChainApp.jsx"


export default function useAppUserCount(userId, appSlug) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_NODE_URL);
    const {myOnChainApp} = useOnChainApp(userId, appSlug)

    const toInteger = (num) => {
        try {
            return parseInt(ethers.utils.formatEther(num))
        } catch (error) {
            console.log(error)
        }
        return 0
    }

    const fetcher = async (...args) => {    
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            provider
        )
                
        return contract.getUserCount(myOnChainApp.appAddress)
        .then(async result => {
            return toInteger(result)
        })
        .catch(err => {
            console.log(err)
        })

    }  
    
    const { data: data, error: myError } = useSWR(
        () => myOnChainApp ? ['/api/getUserCount', myOnChainApp?.appAddress] : null, fetcher)
        
    return {
      myUserCount: data,
      isLoading: !myError && !data,
      isError: myError
    }
}