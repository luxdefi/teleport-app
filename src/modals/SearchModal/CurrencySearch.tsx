import React, {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { filterTokens, useSortedTokensByQuery } from "functions/filtering";
import AutoSizer from "react-virtualized-auto-sizer";

import CurrencyList from "./CurrencyList";
import { FixedSizeList } from "react-window";
import ImportRow from "./ImportRow";
import { isAddress } from "functions/validate";
import useDebounce from "hooks/useDebounce";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useTokenComparator } from "./sorting";
import ModalHeader from "components/Modal/Header";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useRouter } from "next/router";
import { Token } from "state/types";
import { useAllTokens, useToken } from "state/swap/hooks";
import { ChainId } from "constants/chainIds";
import useToggle from "hooks/useToggle";
interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Token | null;
  onCurrencySelect: (currency: Token) => void;
  otherSelectedCurrency?: Token | null;
  showCommonBases?: boolean;
  showManageView: () => void;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  currencyList?: string[];
  includeNativeCurrency?: boolean;
  allowManageTokenList?: boolean;
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
  currencyList,
  includeNativeCurrency = true,
  allowManageTokenList = true,
}: CurrencySearchProps) {
  const { chainId } = useActiveWeb3React();

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);

  const [invertSearchOrder] = useState<boolean>(false);

  let allTokens = useAllTokens();
  const history = useRouter();

  // if (currencyList) {
  //   allTokens = Object.keys(allTokens).reduce((obj, key) => {
  //     if (currencyList.includes(key)) obj[key] = allTokens[key]
  //     return obj
  //   }, {})
  // }

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery);
  const tokenComparator = useTokenComparator(invertSearchOrder);
  const searchToken = useToken(debouncedQuery);

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);
  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator);
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(
    sortedTokens,
    debouncedQuery
  );
  // const ether = useMemo(() => chainId && ExtendedEther.onChain(chainId), [chainId])

  const ether = useMemo(() => chainId, [chainId]);

  const filteredSortedTokensWithETH: Token[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim();
    if (s === "" || s === "e" || s === "et" || s === "eth") {
      return ether ? [...filteredSortedTokens] : filteredSortedTokens;
    }
    return [
      ...filteredSortedTokens,

      // {
      //   _checksummedAddress: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
      //   _tags: null,
      //   isNative: false,
      //   isToken: true,
      //   tokenInfo: {
      //     address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
      //     chainId: 97,
      //     decimals: 18,
      //     logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/BUSD-BD1/logo.png',
      //     name: 'ETHEREUM',
      //     symbol: 'ETH',
      //   },
      // },
    ];
  }, [debouncedQuery, ether, filteredSortedTokens]);

  const handleCurrencySelect = useCallback(
    (currency: Token) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery("");
  }, [isOpen]);

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === "eth" && ether) {
          handleCurrencySelect(
            allTokens.find((token) => token.symbol === "eth")
          );
        } else if (filteredSortedTokensWithETH.length > 0) {
          if (
            filteredSortedTokensWithETH[0].symbol?.toLowerCase() ===
              debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokensWithETH.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokensWithETH[0]);
          }
        }
      }
    },
    [debouncedQuery, ether, filteredSortedTokensWithETH, handleCurrencySelect]
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  return (
    <div className="flex flex-col max-h-[inherit]">
      <ModalHeader
        title="Select a token"
        titleClassName="text-white text-2xl font-semibold"
        className="px-6 py-5 bg-space-grey h-full"
        onClose={onDismiss}
      />
      <div className="flex flex-col px-6 pb-8 min-w-[82vw] md:min-w-[400px]">
        {!currencyList && (
          <div className="mt-0 mb-3 sm:mt-3 sm:mb-8">
            <input
              type="text"
              id="token-search-input"
              placeholder="Search name or paste address"
              autoComplete="off"
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
              className="w-full bg-transparent border border-dark-700 focus:outline-none rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-6 py-3.5"
            />
          </div>
        )}

        {searchToken ? (
          <div style={{ padding: "20px 0", height: "100%" }}>
            <ImportRow
              token={searchToken}
              showImportView={showImportView}
              setImportToken={setImportToken}
            />
          </div>
        ) : filteredSortedTokens?.length > 0 ? (
          <div className="h-screen">
            <AutoSizer disableWidth>
              {({ height }) => (
                <CurrencyList
                  height={height}
                  currencies={
                    includeNativeCurrency
                      ? filteredSortedTokensWithETH
                      : filteredSortedTokens
                  }
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  fixedListRef={fixedList}
                  showImportView={showImportView}
                  setImportToken={setImportToken}
                />
              )}
            </AutoSizer>
          </div>
        ) : (
          <div style={{ padding: "20px", height: "100%" }}>
            <div className="mb-8 text-center">No results found</div>
          </div>
        )}
        {allowManageTokenList && (
          <div className="mt-3">
            <button
              id="list-token-manage-button"
              onClick={showManageView}
              color="gray"
            >
              Manage Token Lists
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
