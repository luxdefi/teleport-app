import { SUPPORTED_NETWORKS } from "config/networks";
import { ChainId } from "constants/chainIds";
import { addresses } from "constants/contract";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "state/hooks";
import { AppState, useAppDispatch } from "state/store";
import { Token, TokenSelect } from "state/types";
import {
  fetchBalances,
  fetchTokens,
  updateCurrentAmount,
  updateCurrentBalances,
  updateCurrentTrade,
  updateError,
  loading,
} from "./action";
import { notify } from "components/alertMessage";

export function useAllTokens(): Token[] {
  return useSelector((state: AppState) => state.swap.tokens);
}
export function useGetAvailableTokens(): () => void {
  const { chainId } = useActiveWeb3React();
  const dispatch = useDispatch();

  return useCallback(async () => {
    try {
      const resultTokens = [];
      dispatch(fetchTokens(resultTokens));

      const from = Object.values(resultTokens).find(
        (val: any) => val.symbol === "ETH"
      );
      dispatch(
        updateCurrentTrade({
          to: {},
          from: { ...from, isNative: from.symbol === "ETH" },
        })
      );
    } catch (error) {
      console.log("error in useGetAvailableTokens", error);
    }
  }, [dispatch, chainId]);
}

export function useFetchUserBalances(): () => void {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useDispatch();
  const getCurrentBalances = useGetCurrentBalances();
  return useCallback(async () => {
    try {

      const newbalances = [

      ];
      console.log("newbalances newbalances", newbalances);
      dispatch(fetchBalances(newbalances));
      getCurrentBalances();
    } catch (error) {
      console.log("error in useFetchUserBalances", error);
    }
  }, [dispatch, chainId, account]);
}

export function useGetCurrentBalances(): () => void {
  const dispatch = useDispatch();

  const { balances, currentTrade } = useAppSelector((state) => state.swap);
  // const getQuote = useGetQuote();

  console.log("useGetCurrentBalances", currentTrade);
  return useCallback(async () => {
    try {
      if (currentTrade) {
        const tokenBalances: { to: number; from: number } = {
          to: 0,
          from: 0,
        };
        console.log(
          "useGetCurrentBalances in tokenBalances",
          tokenBalances,
          currentTrade,
          balances
        );

        Object.keys(currentTrade).forEach((trade) => {
          const tradeBalance = balances.find(
            (balance) => balance.symbol === currentTrade[trade].symbol
          );
          tokenBalances[trade] =
            balances.length > 0 && tradeBalance
              ? "0"
              : "0";
        });
        console.log("tokenBalances", tokenBalances);
        dispatch(updateCurrentBalances(tokenBalances));
        // getQuote(currentAmount)
      }
    } catch (error) {
      console.log("error in useFetchUserBalances", error);
    }
  }, [dispatch, currentTrade, balances]);
}

export function useGetQuote(): (
  currentAmount: TokenSelect,
  side?: "from" | "to"
) => void {
  const dispatch = useDispatch();
  const { currentTrade, currentSelectSide } = useAppSelector(
    (state: AppState) => state.swap
  );
  console.log("currentSelectSide in quite", currentSelectSide);
  return useCallback(
    async (currentAmount, side) => {
      const newSide = side || currentSelectSide;

      try {
        if (!currentTrade.from || !currentTrade.to || !currentAmount[newSide])
          return;
        // const amount = Number(toAmount * 10 ** currentTrade.from.decimals);
        console.log("useGetQuote", currentAmount, newSide, currentTrade);

        dispatch(
          updateCurrentAmount({
            ...currentAmount,
            [newSide === "from" ? "to" : "from"]: (
              0
            ).toFixed(8),
          })
        );

      } catch (error) {
        console.log('error useGetQuote,', error)
        // console.log(
        //   "errror in useGetQuote quote",
        //   JSON.parse(error.message.text)
        // );
        dispatch(updateError(JSON.parse(error.message.text).data));
      }
    },
    [dispatch, currentSelectSide, currentTrade]
  );
}

export function useSwap(): () => void {
  const { account } = useActiveWeb3React();
  const { currentTrade, currentAmount } = useAppSelector(
    (state: AppState) => state.swap
  );
  const dispatch = useAppDispatch();
  return useCallback(async () => {
    // let amount = Number(fromAmount * 10 ** currentTrade.from.decimals);
    dispatch(loading(true));
    const amount = 0

    if (currentTrade.from.symbol !== "ETH") {
      const allowance = true // GET ALLOWANCE VALUE
      console.log(allowance);
      if (!allowance) {
        // APPROVE IF NOT ALLOWANCE
      }
    }
    try {
      //SWAP HERE
      //   alert("Swap Complete");
      notify("Swap Complete", "success");

      dispatch(loading(false));
    } catch (error) {
      console.error("error in try swappp", error);
      //   notify("Something went wrong. Try again later", "error");
      dispatch(loading(false));
      if (!!error.message) {
        if (error.message.text) {
          notify(
            JSON.parse(JSON.parse(error.message.text)?.data)?.message,
            "error"
          );
        } else {
          notify(error.message, "error");
        }
        return;
      } else if (!!error.error) {
        notify(error.error, "error");
        console.log("err_err");

        return;
      } else if (typeof error === "string") {
        notify(error, "error");
        console.log("err_str");

        return;
      }
      notify("Something went wrong. Try again later", "error");
    }
  }, [currentTrade, currentAmount, dispatch]);
}

export function useGetTokenFiatValue(): (address) => Promise<number> {
  const { chainId } = useActiveWeb3React();
  console.log("valll useGetTokenFiatValue here started");

  return useCallback(
    async (address) => {
      try {
        const options: { chain?: any; address: string; exchange?: string } = {
          chain: SUPPORTED_NETWORKS[chainId].chainId,
          address,
        };
        console.log("valll here doing something");
        const price = { usdPrice: 0 }
        console.log("valll here done", price);

        return price.usdPrice;
      } catch (error) {
        console.log("valll here error in useGetTokenFiatValue", error);
      }
    },
    [chainId]
  );
}

export const useTokenBalance = (token) => {
  const { balances } = useAppSelector((state: AppState) => state.swap);
  const tokenBalance = balances.find(
    (balance) => balance.symbol === token.symbol
  );
  return balances.length > 0 && tokenBalance
    ? "0"
    : "0";
};

export const useAllTokenBalances = () => {
  const { balances } = useAppSelector((state: AppState) => state.swap);

  return balances.length > 0 ? balances : [];
};
export const useToken = (address) => {
  const { tokens } = useAppSelector((state: AppState) => state.swap);

  return tokens.length > 0
    ? tokens.find((token) => token.address === address)
    : null;
};
