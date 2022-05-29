import React, { ReactNode, useCallback, useEffect, useState } from "react";
import selectCoinAnimation from "../../assets/animations/select-coin.json";

// import CurrencySearchModal from '../modals/SearchModal/CurrencySearchModal'
// import DoubleCurrencyLogo from './DoubleLogo'
import { FiatValue } from "./FiatValue";
import Lottie from "lottie-react";
import { DebounceInput } from "react-debounce-input";

import { Token } from "state/types";
import Logo from "components/Logo";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useGetTokenFiatValue } from "state/swap/hooks";
import CurrencySearchModal from "modals/SearchModal/CurrencySearchModal";

interface ExchangePanelProps {
  value?: string;
  onUserInput?: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Token) => void;
  token?: Token | null;
  otherToken?: Token | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  hideInput?: boolean;
  id: string;
  showCommonBases?: boolean;
  locked?: boolean;
  customBalanceText?: string;
  selectedCurrencyBalance: string;
  fiatValue?: number | null;
  onKeyDownFunc: () => void;
}

export default function ExchangePanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = "Input",
  onCurrencySelect,
  token,
  disableCurrencySelect = false,
  id,
  hideBalance = false,
  hideInput = false,
  locked = false,
  customBalanceText,
  selectedCurrencyBalance,
  fiatValue,
  otherToken,
  onKeyDownFunc,
}: ExchangePanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);
  const [fiat, setFiat] = useState(0);
  // const fiatValue =
  const getTokenFiatValue = useGetTokenFiatValue();
  useEffect(() => {
    initFetch();
  }, [token]);
  const initFetch = async () => {
    const val = await getTokenFiatValue(
      token.isNative
        ? "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        : token.address
    );
    console.log("valll getTokenFiatValue here", val);
    setFiat(val);
  };
  return (
    <div
      id={id}
      className={`${hideInput ? "p-4" : "p-5"} rounded bg-space-dark`}
    >
      <div className="flex flex-col justify-between space-y-3">
        <div className={"w-full"}>
          <button
            type="button"
            className={`${
              !!token ? "text-primary" : "text-high-emphesis"
            } open-currency-select-button h-full outline-none select-none cursor-pointer border-none text-xl font-medium items-center`}
            onClick={() => {
              if (onCurrencySelect) {
                console.log("opening modal", modalOpen);
                setModalOpen(true);
              }
            }}
          >
            <div className="flex items-center gap-1.5 rounded-full bg-space-grey p-2 pr-3.5">
              {token ? (
                <div className="flex items-center">
                  <Logo
                    src={token?.logoURI}
                    width={"24px"}
                    height={"24px"}
                    alt={token?.symbol}
                    className="rounded"
                  />
                </div>
              ) : (
                <div
                  className="rounded bg-dark-700"
                  style={{ maxWidth: 54, maxHeight: 54 }}
                >
                  <div style={{ width: 54, height: 54 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )}
              <div className="text-lg font-semibold token-symbol-container md:text-xl">
                {token && token.symbol ? (
                  token.symbol
                ) : (
                  <div className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap ">
                    Select a token
                  </div>
                )}
              </div>
              {!disableCurrencySelect && token && (
                <ChevronDownIcon
                  width={16}
                  height={16}
                  className="stroke-current"
                />
              )}
            </div>
            {/* <div className="flex">
              {token ? (
                <div className="flex items-center">
                  <Logo
                    src={token?.logoURI}
                    width={"24px"}
                    height={"24px"}
                    alt={token?.symbol}
                    className="rounded"
                  />
                </div>
              ) : (
                <div
                  className="rounded bg-dark-700"
                  style={{ maxWidth: 54, maxHeight: 54 }}
                >
                  <div style={{ width: 54, height: 54 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col items-start justify-center mx-3.5">
                {label && (
                  <div className="text-xs font-medium text-secondary whitespace-nowrap">
                    {label}
                  </div>
                )}
                <div className="flex items-center">
                  <div className="text-lg font-bold token-symbol-container md:text-2xl">
                    {token && token.symbol ? (
                      token.symbol
                    ) : (
                      <div className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap ">
                        Select a token
                      </div>
                    )}
                  </div>

                  {!disableCurrencySelect && token && (
                    <ChevronDownIcon
                      width={16}
                      height={16}
                      className="ml-2 stroke-current"
                    />
                  )}
                </div>
              </div>
            </div> */}
          </button>
        </div>
        {!hideInput && (
          <div className="flex items-center w-full p-3 space-x-3 rounded bg-transaparent text-space-light-gray focus:bg-dark-700">
            <>
              {showMaxButton && selectedCurrencyBalance && (
                <button
                  onClick={onMax}
                  className="p-1 mr-1 text-xs font-medium bg-transparent border rounded hover:bg-vote-button hover:text-white border-low-emphesis text-secondary whitespace-nowrap"
                >
                  Max
                </button>
              )}
              <DebounceInput
                style={{
                  WebkitAppearance: "none",
                  margin: 0,
                  MozAppearance: "textfield",
                }}
                pattern="^[0-9]*[.,]?[0-9]*$"
                title="Token Amount"
                placeholder="0.0"
                className="relative flex-auto w-0 p-0 overflow-hidden text-2xl font-bold bg-transparent border-none outline-none appearance-none overflow-ellipsis placeholder-low-emphesis focus:placeholder-primary"
                inputMode="decimal"
                onKeyDown={() => onKeyDownFunc()}
                onChange={(e) => onUserInput(e.target.value)}
                value={value}
                type="number"
                minLength={1}
                debounceTimeout={2000}
              />
              {!hideBalance && token && selectedCurrencyBalance ? (
                <div className="flex flex-col">
                  <div
                    onClick={onMax}
                    className="text-xs font-medium text-right cursor-pointer text-low-emphesis"
                  >
                    {`Balance:`}{" "}
                    {parseFloat(selectedCurrencyBalance).toFixed(2)}{" "}
                    {token.symbol}
                  </div>
                  <FiatValue fiatValue={fiat * parseFloat(value)} />
                </div>
              ) : null}
            </>
          </div>
        )}
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={token}
          otherSelectedCurrency={otherToken}
          showCommonBases={true}
        />
      )}
    </div>
  );
}
