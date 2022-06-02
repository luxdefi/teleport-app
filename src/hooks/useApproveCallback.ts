
import { useCallback, useMemo } from 'react'
import { useHasPendingApproval, useTransactionAdder } from '../state/transactions/hooks'

import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from '../functions/trade'
import { useTokenAllowance } from './useTokenAllowance'
import { useWeb3React } from '@web3-react/core'
import { useLuxContract } from './useContract'
import { addresses } from 'constants/contract'
import { ChainId } from 'constants/chainIds'
import useActiveWeb3React from './useActiveWeb3React'
import { useDispatch, useSelector } from 'react-redux'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: number,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account, chainId } = useActiveWeb3React()
  const { loading, voterAllowance } = useSelector((state: any) => state.voting);

  const dispatch = useDispatch()
  console.log('amountToApprove', amountToApprove, spender)
  const contract = useLuxContract()

  const chainAddresses =
    (addresses[chainId] as any) || (addresses[ChainId.MAINNET] as any);
  // const currentAllowance = useTokenAllowance(account ?? undefined, spender)
  contract?.allowance(
    account,
    spender,
    {
      gasLimit: 4000000,
    }
  ).then((val) => {
    //get allowance
  }).catch(err => console.log('err', err));

  const pendingApproval = useHasPendingApproval(account, spender)
  // console.log('currentAllowance', currentAllowance)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    console.log('state 1')

    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    // if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    console.log('state 2', amountToApprove, spender, voterAllowance)

    if (voterAllowance == null) return ApprovalState.UNKNOWN
    console.log('state 3', voterAllowance)

    // amountToApprove will be defined if currentAllowance is
    const state = voterAllowance < amountToApprove
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED

    return state
  }, [amountToApprove, voterAllowance, pendingApproval, spender])


  const tokenContract = useLuxContract()
  const addTransaction = useTransactionAdder()
  console.log('tokenContract', tokenContract)
  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily', approvalState)
      return
    }
    // if (!token) {
    //   console.error('no token')
    //   return
    // }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    // const estimatedGas = await tokenContract.approve(spender, MaxUint256).catch(() => {
    //   // general fallback for tokens who restrict approval amounts
    //   useExact = true
    //   return tokenContract.approve(spender, amountToApprove.toString())
    // })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.toString() : MaxUint256, {
        gasLimit: 4000000,
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove,
          approval: { tokenAddress: '', spender: spender },
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}
