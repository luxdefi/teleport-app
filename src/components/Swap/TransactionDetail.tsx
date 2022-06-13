import { shortenAddress, shortenString } from "functions/format";
import { getGasPrice } from "functions/trade";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import Image from "next/image";
import React, { useState } from "react";

const TransactionDetail = ({ evmToAddress, amount, token }) => {
  const [show, setShow] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const { library } = useActiveWeb3React();
  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  const handleCopyClick = (copyText) => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={`w-full rounded-3xl ${show && "bg-primary"} text-white`}>
      <div
        className={`flex items-center justify-center cursor-pointer ${
          show && "border-b border-grey-50 py-5"
        } `}
        onClick={() => setShow(!show)}
      >
        <Image
          src="/icons/caret.svg"
          alt=""
          width={9.33}
          height={5}
          style={{
            transform: show ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
        <p className="ml-3 text-center text-primary-300">Transaction Details</p>
      </div>
      {show && (
        <>
          <div className="flex flex-col p-5 border-b cursor-pointer border-grey-50">
            {/* <div className="flex items-center justify-between mb-3.5">
              <p>Network fee</p>
              <p>{getGasPrice(library)} ETH ≈ $0.161</p>
            </div> */}
            <div className="flex items-center justify-between">
              <p>Protocol fee</p>
              <p>
                1% ≈ {amount * 0.001} {token.symbol}
              </p>
            </div>
          </div>
          <div className="flex flex-col p-5 border-b cursor-pointer border-grey-50">
            <div className="flex items-center justify-between mb-3.5">
              <p>Price impact in source network</p>
              <p>0.16%</p>
            </div>
            <div className="flex items-center justify-between mb-3.5">
              <p>Price impact in target network</p>
              <p>0.32%</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Current slippage</p>
              <p>0.01%</p>
            </div>
          </div>
          <div className="flex flex-col p-5 cursor-pointer">
            <div className="flex items-center justify-between">
              <p>You will receive Lux tokens at this address</p>
              <div className="relative flex items-center cursor-pointer">
                {isCopied && (
                  <h1 className="absolute text-sm font-medium text-green -top-7">
                    Copied!
                  </h1>
                )}
                <p className="mr-8">
                  {evmToAddress && shortenAddress(evmToAddress || "")}
                </p>
                <button
                  onClick={() => handleCopyClick(evmToAddress)}
                  className="flex items-center justify-center outline-none"
                >
                  <Image src="/icons/copy.svg" alt="" width={16} height={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionDetail;
