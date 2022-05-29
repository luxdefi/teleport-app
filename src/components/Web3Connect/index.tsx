import React from "react";
import {
  useWalletModalToggle,
  useWalletSidebarToggle,
} from "../../state/application/hooks";

export default function Web3Connect({ className = "", title, ...rest }: any) {
  const toggleWalletModal = useWalletModalToggle();
  // const toggleWalletSidebar = useWalletSidebarToggle();

  return (
    <button
      id="connect-wallet"
      onClick={toggleWalletModal}
      variant="outlined"
      className={
        "relative items-center justify-center  px-6 outline-none lg:flex gap-x-3" +
        "text-sm font-normal text-white font-object_sans"
      }
      {...rest}
    >
      {title}
    </button>
  );
}
