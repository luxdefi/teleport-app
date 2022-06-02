import { createReducer } from "@reduxjs/toolkit";
import { ChainId } from "constants/chainIds";
import { Balance, MoralisError, Token, TokenSelect } from "state/types";
import Web3 from "web3";
import {
  loading,
  fetchTokens,
  updateCurrentTrade,
  updateError,
  updateCurrentSelectSide,
  updateCurrentAmount,
  fetchBalances,
  updateCurrentBalances,
  updateActiveChain,
} from "./action";

interface SwapState {
  loading: boolean;
  tokens: { [chainId in ChainId]?: Token[] };
  currentTrade: null | {
    to: Token | {} | null;
    from: Token | {} | null;
  };
  error: MoralisError | null;
  currentSelectSide: "from" | "to";
  currentAmount: TokenSelect;
  balances: Balance[];
  currentBalances: TokenSelect;
  activeChain: ChainId;
}
const initialState: SwapState = {
  loading: false,
  tokens: {},
  currentTrade: {
    // to: {
    //   decimals: 18,
    //   symbol: "LUX",
    //   address: "0x3f5919205A01fa0c44E8F4C4Ba897629b26B076a",
    //   logoURI: "/lux_logo.svg",
    //   name: "LUX",
    //   isNative: false,
    // },
    // from: {
    //   decimals: 18,
    //   symbol: "ETH",
    //   address: "",
    //   logoURI: "/images/networks/mainnet-network.jpg",
    //   name: "Ethereum",
    //   isNative: true,
    // },
    to: null,
    from: null,
  },
  error: null,
  currentSelectSide: "from",
  currentAmount: {
    to: 0,
    from: 0.1,
  },
  balances: [],
  currentBalances: {
    to: 0,
    from: 0,
  },
  activeChain: ChainId.MAINNET,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(loading, (state, action) => {
      state.loading = action.payload;
    })
    .addCase(fetchTokens, (state, action) => {
      state.tokens = action.payload;
    })
    .addCase(updateCurrentTrade, (state, action) => {
      state.currentTrade = action.payload;
    })
    .addCase(updateError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(updateCurrentSelectSide, (state, action) => {
      state.currentSelectSide = action.payload;
    })
    .addCase(updateCurrentAmount, (state, action) => {
      state.currentAmount = action.payload;
    })
    .addCase(fetchBalances, (state, action) => {
      state.balances = action.payload;
    })
    .addCase(updateCurrentBalances, (state, action) => {
      state.currentBalances = action.payload;
    })
    .addCase(updateActiveChain, (state, action) => {
      state.activeChain = action.payload;
    })
);
