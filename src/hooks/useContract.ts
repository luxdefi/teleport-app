import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { getContract } from "../functions/contract";
import { useMemo } from "react";
import { useActiveWeb3React } from "./useActiveWeb3React";
import { isAddress } from "functions/validate";
import { abis, addresses } from "constants/contract";
import { ChainId } from "constants/chainIds";

// returns null on errors
export function useContract(
  nameOrAddress: string | undefined,
  ABI: any = undefined,
  withSignerIfPossible = true,
  useDefault = false
): Contract | null {
  const { library, account, chainId } = useActiveWeb3React();
  let chainIdStr = chainId ? chainId.toString() : "4";

  let address: string | undefined = nameOrAddress;
  // const randomWallet = ethers.Wallet.createRandom();
  // const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f0c1756bf77c4d8eb525375aa106ebcc') // needs to be added in .env.local || .env, it's dynamic accordin to network and chain
  // const defaultSigner = provider.getSigner(randomWallet.address);

  if (!isAddress(nameOrAddress) || nameOrAddress === AddressZero) {
    address =
      chainId === (ChainId.MAINNET || ChainId.RINKEBY)
        ? addresses[chainIdStr][nameOrAddress.toString()] || ""
        : "";
    ABI =
      ABI || abis[chainIdStr]
        ? abis[chainIdStr][nameOrAddress.toString()]
        : null;
  }
  return useMemo(() => {
    if (!address || !ABI || !library) return null;
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

export function useLuxContract(): Contract | null {
  return useContract("LUX");
}