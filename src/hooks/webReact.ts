import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers'

export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider => {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }