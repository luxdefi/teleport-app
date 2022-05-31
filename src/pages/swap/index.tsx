import useActiveWeb3React from "hooks/useActiveWeb3React";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  useFetchUserBalances,
  useGetAvailableTokens,
  useGetCurrentBalances,
  useGetQuote,
  useSwap,
} from "state/swap/hooks";
import { AppState } from "state/store";
import { useAppSelector } from "state/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  Field,
  updateCurrentAmount,
  updateCurrentSelectSide,
  updateCurrentTrade,
  updateError,
} from "state/swap/action";
import SwapHeader from "components/Swap/Header";
import Exchange from "components/Swap/Exchange";
import Lottie from "lottie-react";
import { useWalletModalToggle } from "state/application/hooks";
import { ChainId } from "constants/chainIds";
import Head from "next/head";
import TransactionDetail from "components/Swap/TransactionDetail";
import CustomizedSteppers from "components/Stepper";

interface SwapProps {}

const Swap: React.FC<SwapProps> = ({}) => {
  const { chainId, account } = useActiveWeb3React();
  const { loading } = useSelector((state: any) => state.swap);

  const dispatch = useDispatch();
  const toggleWalletModal = useWalletModalToggle();
  const getAvailableTokens = useGetAvailableTokens();
  const fetchUserBalances = useFetchUserBalances();
  const getCurrentBalances = useGetCurrentBalances();
  const swapTokens = useSwap();
  const getQuote = useGetQuote();
  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false);

  const {
    currentAmount,
    currentTrade,
    currentBalances,
    error,
    currentSelectSide,
    balances,
  } = useAppSelector((state: AppState) => state.swap);

  useEffect(() => {
    if (currentTrade) {
      getCurrentBalances();
    }
  }, [currentTrade, balances]);

  const handleChange = (value, side?) => {
    const newAmount = { ...currentAmount, [side || currentSelectSide]: value };
    if (currentBalances[Field.INPUT] < newAmount.from) {
      dispatch(
        updateError({
          description: "Insufficient Balance",
        })
      );
    } else {
      dispatch(updateError(null));
    }
    console.log("newAmountssssss", newAmount);
    if (side) {
      console.log("side exisststsss currentSelectSide", side);
      updateCurrentSelectSide(side);
    }
    dispatch(updateCurrentAmount(newAmount));
    getQuote(newAmount, side);
  };
  const onSwitchTokens = () => {
    dispatch(
      updateCurrentTrade({
        to: currentTrade.from,
        from: currentTrade.to,
      })
    );
    const newAmount = {
      to: currentAmount.from,
      from: currentAmount.to,
    };
    dispatch(updateCurrentAmount(newAmount));
  };
  // useEffect(() => {
  //   initMoralis();
  // }, [chainId]);
  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full h-full mt-24">
      <div id="swap-page" className="w-full max-w-xl py-4 md:py-8 lg:py-12">
        <Head>
          <title>LUX | BRIDGE</title>
          <meta
            key="description"
            name="description"
            content="LUX BRIDGE Multi-chain swap"
          />
        </Head>

        <div className="p-4 space-y-4 rounded-3xl bg-primary z-1 mb-7">
          {/* Add slippage */}
          <SwapHeader
            input={currentTrade[Field.INPUT]}
            output={currentTrade[Field.OUTPUT]}
          />
          {/* <ConfirmSwapModal
                isOpen={showConfirm}
                trade={trade}
                originalTrade={tradeToConfirm}
                onAcceptChanges={handleAcceptChanges}
                attemptingTxn={attemptingTxn}
                txHash={txHash}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                onConfirm={handleSwap}
                swapErrorMessage={swapErrorMessage}
                onDismiss={handleConfirmDismiss}
                minerBribe={doArcher ? archerETHTip : undefined}
              /> */}
          <div>
            <Exchange
              // priceImpact={priceImpact}
              label={`Swap From:`}
              selectedCurrencyBalance={currentBalances[Field.INPUT]}
              value={currentAmount[Field.INPUT]}
              showMaxButton={true}
              token={currentTrade[Field.INPUT]}
              onUserInput={handleChange}
              onMax={() =>
                handleChange(currentBalances[Field.INPUT], Field.INPUT)
              }
              // fiatValue={fiatValueInput ?? undefined}
              onCurrencySelect={(token) =>
                dispatch(
                  updateCurrentTrade({
                    ...currentTrade,
                    from: { ...token, isNative: token.symbol === "ETH" },
                  })
                )
              }
              otherToken={currentTrade[Field.OUTPUT]}
              showCommonBases={true}
              onKeyDownFunc={() =>
                dispatch(updateCurrentSelectSide(Field.INPUT))
              }
              id="swap-currency-input"
            />
            <div className="grid py-3 relative">
              <hr className="h-px bg-[#323546] opacity-30 block absolute w-full top-[50%] z-[1]" />
              <div className="flex flex-wrap justify-center w-full px-4 z-10">
                <button
                  className="-mt-6 -mb-6 rounded-full"
                  onClick={() => {
                    onSwitchTokens();
                  }}
                >
                  <div className="p-1 rounded-full bg-secondary">
                    <div
                      className="py-1 rounded-full flex flex-col justify-center"
                      onMouseEnter={() => setAnimateSwapArrows(true)}
                      onMouseLeave={() => setAnimateSwapArrows(false)}
                    >
                      <Image
                        src="/icons/swithcer.svg"
                        alt=""
                        width={30}
                        height={30}
                        className="stroke-white"
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <Exchange
                // priceImpact={priceImpact}
                label={`Swap To:`}
                selectedCurrencyBalance={currentBalances[Field.OUTPUT]}
                value={currentAmount[Field.OUTPUT]}
                showMaxButton={true}
                token={currentTrade[Field.OUTPUT]}
                onUserInput={handleChange}
                onMax={() =>
                  handleChange(currentBalances[Field.OUTPUT], Field.OUTPUT)
                }
                // fiatValue={fiatValueInput ?? undefined}
                onCurrencySelect={(token) =>
                  dispatch(
                    updateCurrentTrade({
                      ...currentTrade,
                      to: { ...token, isNative: token.symbol === "ETH" },
                    })
                  )
                }
                otherToken={currentTrade[Field.INPUT]}
                showCommonBases={true}
                onKeyDownFunc={() =>
                  dispatch(updateCurrentSelectSide(Field.OUTPUT))
                }
                id="swap-currency-output"
              />
            </div>
          </div>
          <CustomizedSteppers />
          <div className="mt-1">
            {!account ? (
              <div
                className="w-full px-6 py-4 text-base text-center border rounded-full shadow-sm cursor-pointer focus:ring-2 focus:ring-offset-2 bg-primary-300 text-white border-dark-800 focus:ring-offset-dark-700 focus:ring-dark-800 disabled:bg-opacity-80 disabled:cursor-not-allowed focus:outline-none"
                onClick={toggleWalletModal}
              >
                Connect Wallet
              </div>
            ) : (
              <button
                className="w-full px-6 py-4 text-base text-center border rounded-full shadow-sm focus:ring- focus:ring-offset- bg-primary-300 text-white border-dark-800 focus:ring-offset-dark-700 focus:ring-dark-800 disabled:bg-opacity-80 disabled:cursor-not-allowed focus:outline-none"
                onClick={() => {
                  swapTokens();
                }}
                id="swap-button"
                disabled={
                  error || ![ChainId.MAINNET, ChainId.RINKEBY].includes(chainId)
                }
              >
                {loading ? (
                  <i className="text-white fas fa-circle-notch animate-spin" />
                ) : error ? (
                  error.description
                ) : (
                  "Swap"
                )}
              </button>
            )}
          </div>
          {/* <UnsupportedCurrencyFooter show={swapIsUnsupported} currentTrade={[currentTrade.INPUT, currentTrade.OUTPUT]} /> */}
        </div>
        <TransactionDetail />
      </div>
    </main>
  );
};

export default Swap;
