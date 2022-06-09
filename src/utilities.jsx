import { 
    chain
} from 'wagmi'

export function getSupportedChains() {
    const chainNames = JSON.parse(process.env.NEXT_PUBLIC_CHAINS)
    const chains = []
    for (const name of chainNames) {
        chains.push(chain[name])
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
  