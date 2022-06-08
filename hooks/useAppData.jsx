import { useSession } from "next-auth/react"
import { ethers } from "ethers"
import useSWR from 'swr'
import Web3Analytics from "../schema/Web3Analytics.json"



export default function useAppData(appAddress) {
    const { data: session } = useSession()
    const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);


    const fetcher = async (...args) => {    
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            provider
        )
                
        return contract.getAppData(appAddress)
        .then(async result => {
            return result;
        })
        .catch(err => {
            console.log(err);
        });

    }  

    const { data: data, error: myError } = useSWR(
        () => session ? ['/api/appData', appAddress] : null, fetcher)
    
    return {
      myAppData: data,
      isLoading: !myError && !data,
      isError: myError
    }
}