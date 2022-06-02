import NavLink from "components/NavLink";
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

  return (
    <div className="flex items-center justify-between mb-4 space-x-3">
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
          <div className="relative flex items-center w-full h-full text-sm font-bold text-gray-500 rounded cursor-pointer">
            {/* {numberWithCommas(luxBalance.toFixed(2))} lux */}
            <Image src="/icons/filter.svg" alt="" width={20} height={20} />
          </div>
          <div className="relative flex items-center w-full h-full rounded hover:bg-dark-800">
            {/* <Settings placeholderSlippage={allowedSlippage} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeHeader;
