import { 
    chain
} from 'wagmi'

export function getSupportedChains() {
    const chainNames = JSON.parse(process.env.NEXT_PUBLIC_CHAINS)
    const chains = []
    for (const name of chainNames) {
        if (name === 'hardhat') {
            const hardhat = {
                "id":1337,
                "name":"Hardhat",
                "network":"hardhat",
                "rpcUrls": {
                    "default":"http://localhost:8545"
                }
            }
            chains.push(hardhat)
        } else {
            chains.push(chain[name])
        }
    }
    return chains
}

export function getShortAddress(address) {
    if (address != null) {
      const beginning = address.substring(0,4);
      const addressLength = address.length;
      const end = address.substring(addressLength-4,addressLength)
      return `${beginning}...${end}`;
    }
    return '';
}
  