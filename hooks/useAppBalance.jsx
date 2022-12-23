import { ethers } from "ethers"
import useSWR from 'swr'
import Web3Analytics from "../schema/Web3Analytics.json"
import useOnChainApp from "./useOnChainApp.jsx"


export default function useAppBalance(userId, appSlug) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_NODE_URL);
    const {myOnChainApp} = useOnChainApp(userId, appSlug)

    const fetcher = async (...args) => { 
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            provider
        )
                         
        return contract.getBalance(myOnChainApp.appAddress)
        .then(async result => {
            return ethers.utils.formatUnits(result, 18)
        })
        .catch(err => {
            console.log(err)
        })

    }  
    
    const { data: data, error: myError } = useSWR(
        () => myOnChainApp ? ['/api/getBalance', myOnChainApp?.appAddress] : null, fetcher)
        
    return {
      myBalance: data,
      isLoading: !myError && !data,
      isError: myError
    }
}