import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Web3Connect from "../Web3Connect";
import styled from "styled-components";
import { Person } from "@mui/icons-material";
import { shortenAddress } from "functions/format";
import type { Connector } from "@web3-react/types";
import { getName } from "state/application/HooksProvider";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import dynamic from "next/dynamic";
import DropdownIcon from "Icons/DropdownIcon";
import AccountDropdown from "components/AccountDetails/DropDown";
import WalletSidebar from "modals/WalletSidebar";
import { metaMask } from "connectors/metaMask";
import { walletConnect } from "connectors/walletConnect";
import { coinbaseWallet } from "connectors/coinbaseWallet";
import { useGetNftSupply, useGetUserNfts } from "state/nfts/hooks";
import MintModal from "modals/MintModal";
const WalletModal = dynamic(() => import("modals/WalletModal"), { ssr: false });

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + "px" : "32px")};
    width: ${({ size }) => (size ? size + "px" : "32px")};
  }
`;

const SOCK = (
  <span
    role="img"
    aria-label="has socks emoji"
    style={{ marginTop: -4, marginBottom: -4 }}
  >
    🧦
  </span>
);

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: Connector }) {
  const name = getName(connector);
  if (name === "MetaMask") {
    // return <Image src="/chef.svg" alt="Injected (MetaMask etc...)" width={20} height={20} />
    return (
      <IconWrapper size={16}>
        <Person style={{ color: "white" }} />
      </IconWrapper>
    );
  } else if (connector.constructor.name === "WalletConnect") {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/wallet-connect.svg"
          alt={"Wallet Connect"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else if (name === "Coinbase Wallet") {
    return (
      <IconWrapper size={16}>
        <Image
          src="/images/wallets/coinbase.svg"
          alt={"Coinbase Wallet"}
          width="16px"
          height="16px"
        />
      </IconWrapper>
    );
  } else {
    return null;
  }
}

function Web3StatusInner({ title, className }) {
  const { account, connector } = useActiveWeb3React();
  // const toggleWalletModal = useWalletModalToggle();
  const [openAccount, setOpenAccount] = useState<boolean>(false);
  const accountToggler = () => setOpenAccount(!openAccount);

  if (account) {
    return (
      <div
        id="web3-status-connected"
        className="flex items-center px-3 py-2 text-2xl rounded-lg cursor-pointer greentext"
        onClick={accountToggler}
      >
        <div className="mr-2 text-sm font-normal text-white font-object_sans">
          {shortenAddress(account)}
        </div>

        {connector && <StatusIcon connector={connector} />}
        <div
          className={`transform transition-transform delay-75 ease-in-out ${
            openAccount ? "-rotate-180" : "rotate-0"
          }`}
        >
          <DropdownIcon />
        </div>
        {openAccount && <AccountDropdown />}
      </div>
    );
  } else {
    return (
      <Web3Connect
        title={title}
        // className={className}
        // style={{
        //   paddingTop: "6px",
        //   paddingBottom: "6px",
        //   border: "1px solid #14F195",
        //   color: "#14F195",
        //   borderRadius: '24px',
        //   fontWeight: 'bold'
        // }}
      />
    );
  }
}

export default function Web3Status({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const getUserNfts = useGetUserNfts();
  const { account, chainId } = useActiveWeb3React();
  // const [getPrice, getMaxSupply, getPerMint, getTotalSupply] =
  //   useGetNftDetails();
  const getNftSupply = useGetNftSupply();
  useEffect(() => {
    // connectEagerly();
  }, []);

  useEffect(() => {
    if (account) {
      getUserNfts(account);
      // getPrice();
      // getMaxSupply();
      // getPerMint();
      // getTotalSupply();
      getNftSupply();
    }
  }, [account, chainId]);

  const connectEagerly = async () => {
    console.log("start connecting eagerly on mount");
    try {
      await void metaMask.connectEagerly();
      await void walletConnect.connectEagerly();
      await void coinbaseWallet.connectEagerly();
      console.log("done  connecting eagerly on mount sucessfully");
    } catch (error) {
      console.log("error in eagerconnect", error);
      console.log("start connecting eagerly on mount with errors");
    }
  };
  return (
    <>
      <Web3StatusInner title={title} className={className} />
      <WalletModal ENSName={undefined} />
      <WalletSidebar />
      <MintModal />
    </>
  );
}
