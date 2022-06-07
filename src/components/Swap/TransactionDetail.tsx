import Image from "next/image";
import React, { useState } from "react";

const TransactionDetail = () => {
  const [show, setShow] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

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
    <div className={`w-full rounded-3xl ${show && "bg-red"} text-white`}>
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
        <p className="text-center text-primary-300 ml-3">Transaction Details</p>
      </div>
      {show && (
        <>
          <div className="flex flex-col p-5 cursor-pointer  border-b border-grey-50">
            <div className="flex items-center justify-between mb-3.5">
              <p>Network fee</p>
              <p>0.000084 ETH ≈ $0.161</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Protocol fee</p>
              <p>0.3% ≈ 123.67 USDC</p>
            </div>
          </div>
          <div className="flex flex-col p-5 cursor-pointer  border-b border-grey-50">
            <div className="flex items-center justify-between mb-3.5">
              <p>Price impact in source network</p>
              <p>0.16%</p>
            </div>
            <div className="flex items-center justify-between mb-3.5">
              <p>Price impact in target network</p>
              <p className="text-red">40.32%</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Current slippage</p>
              <p>4%</p>
            </div>
          </div>
          <div className="flex flex-col p-5 cursor-pointer">
            <div className="flex items-center justify-between">
              <p>You will receive Polygon tokens at this address</p>
              <div className="flex items-center cursor-pointer relative">
                {isCopied && (
                  <h1 className="text-sm text-green font-medium absolute -top-7">
                    Copied!
                  </h1>
                )}
                <p className="mr-8">0x997...e41a4</p>
                <button
                  onClick={() => handleCopyClick("0x997...e41a4")}
                  className="outline-none flex justify-center items-center"
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
