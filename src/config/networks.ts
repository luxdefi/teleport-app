import { ChainId } from "constants/chainIds"
import { isEnvironment } from "functions/environment"


const Mainnet = '/images/networks/mainnet-network.jpg'
const Rinkeby = '/images/networks/rinkeby-network.jpg'
export const NETWORK_ICON = {
  [ChainId.MAINNET]: Mainnet,
  [ChainId.RINKEBY]: Rinkeby,
}

export const NETWORK_LABEL: { [chainId: number]: string } = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
}

export const DEFAULT_METAMASK_CHAIN_ID = [ChainId.MAINNET, ChainId.RINKEBY]

export const AVAILABLE_NETWORKS: number[] = [
  ChainId.MAINNET,
]

if (!isEnvironment('prod')) {
  AVAILABLE_NETWORKS.push(ChainId.RINKEBY)

}

export const SUPPORTED_NETWORKS: {
  [chainId: number]: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3'],
    blockExplorerUrls: ['https://etherscan.com'],
  },
  [ChainId.RINKEBY]: {
    chainId: '0x4',
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3'],
    blockExplorerUrls: ['https://rinkeby.etherscan.com'],
  },
}
