
import { Contract } from 'ethers'
import { useCallback, useEffect, useMemo } from 'react'
import { useLuxContract } from './useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { useBlockNumber } from 'state/application/hooks'
import { FunctionFragment, Interface } from '@ethersproject/abi'
import { useDispatch } from 'react-redux'

export function useTokenAllowance(owner?: string, spender?: string): () => void {
  const contract = useLuxContract()
  const dispatch = useDispatch()
  return useCallback(
    async () => {
      try {
        const allowance = await contract?.allowance(
          owner,
          spender,
          {
            gasLimit: 4000000,
          }
        );
        console.log("voterAllowance", Number(allowance));
        //fetch allowance
        return Number(allowance);
      } catch (error) {
        console.log("voterAllowance error ->", error);
      }
    },
    [contract]
  );
}