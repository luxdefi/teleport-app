import NavLink from "components/NavLink";
import MuiSwitch from "components/Switch";
import { formatBalance, numberWithCommas } from "functions/format";
import Image from "next/image";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGasPrice } from "state/network/hooks";
import { AppState } from "state/store";
import { Token } from "state/types";

const getQuery = (input: any, output: any) => {
  if (!input && !output) return null;

  if (input && !output) {
    return { inputCurrency: input.address || "ETH" };
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address };
  } else {
    return null;
  }
};

interface ExchangeHeaderProps {
  input?: Token;
  output?: Token;
  allowedSlippage?: any;
  crossChain?: boolean;
  bothSelected?: boolean;
  fromChain?: string;
  toChain?: string;
}

const ExchangeHeader: FC<ExchangeHeaderProps> = ({
  input,
  output,
  allowedSlippage,
  crossChain,
  bothSelected,
  fromChain,
  toChain,
}) => {
  const gasPrice = useGasPrice();
  const luxBalance = useSelector<AppState, AppState["lux"]["luxBalance"]>(
    (state) => state.lux.luxBalance
  );

  const [isSlipToleranceModal, setIsSlipToleranceModal] =
    useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

  const toggleSlippageModal = () => setIsSlipToleranceModal((prev) => !prev);

  const autoRefreshHandler = () => setAutoRefresh((prev) => !prev);

  return (
    <div className="flex items-center justify-between mb-4 space-x-3 relative">
      <div
        className="grid grid-cols-1 rounded  bg-transparent h-[46px]"
        style={{ height: 46 }}
      >
        {!bothSelected ? (
          <Link
            //   activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-b from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600"
            href={{
              pathname: "/swap",
              // state: getQuery(input, output),
            }}
            passHref
          >
            <a className="flex items-center justify-center font-medium text-center rounded-md text-white text-lg  hover:text-high-emphesis">
              Cross-Chain Swaps for 15,000+ Assets
            </a>
          </Link>
        ) : bothSelected && crossChain ? (
          <>
            <div className="flex items-center">
              <div>
                <p className="text-lg text-white">Cross-Chain</p>
                <p className="text-sm text-white opacity-40">
                  {fromChain} to {toChain}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <div>
                <p className="text-lg text-white">Instant Trade</p>
                <p className="text-sm text-white opacity-40">
                  {fromChain} to {toChain}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center">
        <div className="grid grid-flow-col gap-1">
          <div
            onClick={toggleSlippageModal}
            className="relative flex items-center w-full h-full text-sm font-bold text-gray-500 rounded cursor-pointer"
          >
            {/* {numberWithCommas(luxBalance.toFixed(2))} lux */}
            <Image src="/icons/filter.svg" alt="" width={20} height={20} />
          </div>
          <div className="relative flex items-center w-full h-full rounded hover:bg-dark-800">
            {/* <Settings placeholderSlippage={allowedSlippage} /> */}
          </div>
        </div>
      </div>

      <SlippageModal
        autoRefresh={autoRefresh}
        autoRefreshHandler={autoRefreshHandler}
        isSlipToleranceModal={isSlipToleranceModal}
      />
    </div>
  );
};

export default ExchangeHeader;

const SlippageModal = ({
  autoRefresh,
  autoRefreshHandler,
  isSlipToleranceModal,
}) => {
  return (
    <div
      className={`absolute right-0 top-12 z-50 px-4 py-3 bg-[#161827] rounded-xl transition-transform ${
        !isSlipToleranceModal
          ? "scale-0 opacity-0 pointer-events-none"
          : "scale-100 opacity-100 pointer-events-auto"
      }`}
    >
      <div className="flex gap-x-2">
        <h1 className="text-base text-white">Slippage Tolerance</h1>
        <button className="outline-none flex items-center">
          <Image src="/icons/info.svg" alt="" width={20} height={20} />
        </button>
      </div>
      <div className="py-3 flex gap-x-3">
        <button
          onClick={autoRefreshHandler}
          className={`outline-none w-20 h-10 flex justify-center items-center border-solid border-white rounded-[100px] ${
            autoRefresh ? "bg-accent border-0" : "bg-transparent border"
          }`}
        >
          <h1 className="text-sm text-white">Auto</h1>
        </button>
        <input
          type="text"
          placeholder="4%"
          className="border border-solid border-white rounded-[100px] bg-transparent h-10 flex-1 pr-4 text-white text-right"
        />
      </div>
      <div className="flex items-center gap-x-2 my-3">
        <h1 className="text-sm text-white">Transaction dealines</h1>
        <button className="outline-none flex items-center">
          <Image src="/icons/info.svg" alt="" width={20} height={20} />
        </button>
      </div>
      <div className="flex gap-x-3 items-center w-1/2 my-3">
        <input
          type="text"
          placeholder="20"
          className="border border-solid border-white rounded-[100px] bg-transparent h-10 flex-1 pr-4 text-white text-right"
        />
        <h1 className="text-sm text-white">minutes</h1>
      </div>
      <div className="pt-2 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <h1 className="text-sm text-white">Disable multihops</h1>
          <button className="outline-none flex items-center">
            <Image src="/icons/info.svg" alt="" width={20} height={20} />
          </button>
        </div>
        <MuiSwitch inputProps={{ "aria-label": "table switch" }} />
      </div>
      <div className="pt-2 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <h1 className="text-sm text-white">Use Rubic Optimization</h1>
          <button className="outline-none flex items-center">
            <Image src="/icons/info.svg" alt="" width={20} height={20} />
          </button>
        </div>
        <MuiSwitch inputProps={{ "aria-label": "table switch" }} />
      </div>
      <div className="pt-2 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <h1 className="text-sm text-white">Auto-refresh</h1>
          <button className="outline-none flex items-center">
            <Image src="/icons/info.svg" alt="" width={20} height={20} />
          </button>
        </div>
        <MuiSwitch inputProps={{ "aria-label": "table switch" }} />
      </div>
    </div>
  );
};
