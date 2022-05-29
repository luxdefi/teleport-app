import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { getContract } from "../functions/contract";
import { useMemo } from "react";
import ABI from "../constants/ABI_MAINNET.json";
import ABI_TESTNET from "../constants/ABI_TESTNET.json";

import { ethers } from "ethers";
import { useActiveWeb3React } from "./useActiveWeb3React";
import {
  NFT_TESTNET_CONTRACTADDRESS,
  NFT_MAINNET_CONTRACTADDRESS
} from "../constants";
export const nftContractAddress = process.env.NEXT_PUBLIC_CONTRACTADDRESS
// const ABI = process.env.NEXT_PUBLIC_ENVIRONMENT == 'production' ? ABI_MAINNET : ABI_TESTNET

console.log('nftContractAddress', nftContractAddress, process.env.NEXT_PUBLIC_ENVIRONMENT)
export function useNftContract(useDefault?): Contract | null {
  return useContract(nftContractAddress, ABI, true, useDefault);
}

// returns null on errors
export function useContract(
  nameOrAddress: string | undefined,
  ABI: any = undefined,
  withSignerIfPossible = true,
  useDefault = false
): Contract | null {
  const { library, account, chainId } = useActiveWeb3React();

  let address: string | undefined = nameOrAddress;
  // const randomWallet = ethers.Wallet.createRandom();
  // const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f0c1756bf77c4d8eb525375aa106ebcc') // needs to be added in .env.local || .env, it's dynamic accordin to network and chain
  // const defaultSigner = provider.getSigner(randomWallet.address);
  return useMemo(() => {
    if (!address || !ABI || !(library)) return null;
    try {
      const contract = getContract(
        address.toString(),
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
      return contract;
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [nameOrAddress, address, ABI, library, withSignerIfPossible, account]);
}
