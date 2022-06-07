import { 
    chain
} from 'wagmi'

export function getSupportedChains() {
    if (process.env.NEXT_PUBLIC_CHAINS === "PRODUCTION") {
        return [chain.polygon]
    }
    return [chain.rinkeby, chain.hardhat]
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
  