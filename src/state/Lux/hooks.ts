import { Contract } from "ethers";
import { useLuxContract } from "hooks/useContract";
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { getLuxBalance } from "./action";

export function useGetLuxBalance(): (
    account: string) => void {
    const dispatch = useDispatch();
    const luxToken: Contract | null = useLuxContract();
    return useCallback(async (account) => {
        try {
            const decimals = await luxToken.decimals()
            const rawBalance = await luxToken.balanceOf(account)
            const divisor = parseFloat(Math.pow(10, decimals).toString())
            const balance = rawBalance / divisor
            console.log('balance', balance)
            dispatch(getLuxBalance(balance))
        } catch (e) {
            console.error('ISSUE LOADING LUX BALANCE \n', e)
        }

    }, [luxToken, dispatch]);
};