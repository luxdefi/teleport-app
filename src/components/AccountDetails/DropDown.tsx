import { formatBalance, shortenAddress } from "functions/format";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useBalances from "hooks/useBalance";
import CopyIcon from "Icons/Copy";
import LinkIcon from "Icons/Link";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import {
  useWalletModalToggle,
  useWalletSidebarToggle,
} from "state/application/hooks";
import { getName } from "state/application/HooksProvider";
import { useAppSelector } from "state/hooks";

const AccountDropdown = () => {
  const { library, accounts, account, connector } = useActiveWeb3React();
  const balances = useBalances(library, accounts);
  const { userNfts }: any = useAppSelector((state) => state.nfts);

  const [isCopied, setIsCopied] = useState(false);

  const toggleWalletSidebar = useWalletSidebarToggle();

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = (copyText) => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-11/12 sm:min-w-[420px] sm:w-auto bg-dark2 rounded-xl absolute top-3/4 translate-y-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-7 z-999 p-4 sm:p-6 space-y-7">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white font-work_sans">
          Account
        </h1>
        {/* <button
          className="w-28 h-9 border border-solid border-white border-opacity-40 rounded-[4px]"
          style={{ color: "#479DF8" }}
          onClick={() => {
            toggleWalletSidebar();
          }}
        >
          <h1 className="text-sm font-normal text-white font-work_sans">
            Change
          </h1>
        </button> */}
        <button
          onClick={() => {
            connector.deactivate();
            toggleWalletSidebar();
          }}
          className="w-28 h-9 border border-solid border-white border-opacity-40 rounded-[4px]"
        >
          <h1 className="text-sm font-normal text-white font-work_sans">
            Disconnect
          </h1>
        </button>
      </div>
      <div className="flex items-center gap-x-3">
        <div className="w-16 h-16 rounded-full bg-redish"></div>
        <div>
          <div className="flex items-center gap-x-2">
            <h1
              className="text-lg font-normal text-white font-work_sans"
              style={{
                background: isCopied && "#1A1919",
              }}
            >
              {shortenAddress(account)}
            </h1>
            <button
              onClick={() => handleCopyClick(account)}
              className="outline-none"
            >
              <CopyIcon />
            </button>
          </div>
          <h1 className="text-base font-normal text-white font-work_sans text-opacity-70">
            {getName(connector)}
          </h1>
        </div>
      </div>
      <div className="flex gap-x-6">
        <div>
          <h1 className="text-sm font-normal text-white font-work_sans">
            Total Balance
          </h1>
          <h1 className="text-2xl font-medium text-white font-work_sans">
            {balances?.[0] ? ` ${formatBalance(balances[0], 18, 3)}` : null} ETH
          </h1>
        </div>
        <div>
          <Link href="/nft">
            <button className="flex items-center outline-none gap-x-2">
              <h1 className="text-sm font-normal text-white font-work_sans">
                Owned NFTs
              </h1>
              <LinkIcon />
            </button>
          </Link>
          <h1 className="text-2xl font-medium text-white font-work_sans">
            {userNfts.length}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AccountDropdown;
