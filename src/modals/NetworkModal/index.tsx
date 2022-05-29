import {
  NETWORK_ICON,
  NETWORK_LABEL,
  SUPPORTED_NETWORKS,
} from "config/networks";
import { Dialog, Transition } from "@headlessui/react";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import { ChainId } from "constants/chainIds";
// @ts-ignore TYPE NEEDS FIXING
import Image from "next/image";
import React, { FC, Fragment } from "react";
import Modal from "components/Modal";
import {
  useConnectModalToggle,
  useModalOpen,
  useNetworkModalToggle,
} from "state/application/hooks";
import { ApplicationModal } from "state/application/actions";
import ModalHeader from "components/Modal/Header";

const NetworkModal = () => {
  const { chainId, library, account } = useActiveWeb3React();
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK);
  const toggleNetworkModal = useNetworkModalToggle();
  if (!chainId) return null;

  return (
    <>
      <Modal
        noPadding
        isOpen={networkModalOpen}
        onDismiss={() => toggleNetworkModal()}
      >
        <div className="flex flex-col gap-4">
          <ModalHeader
            title="Switch Networks"
            titleClassName="text-white text-2xl font-semibold"
            className="px-6 py-5 bg-space-grey"
            onClose={toggleNetworkModal}
          />
          <div className="grid grid-flow-row-dense grid-cols-1 gap-4 px-6 pb-6 overflow-y-auto md:grid-cols-2">
            {[ChainId.MAINNET, ChainId.RINKEBY].map(
              (key: ChainId, i: number) => {
                if (chainId === key) {
                  return (
                    <div
                      key={i}
                      className="bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-2 rounded border border-navy-blue cursor-not-allowed bg-opacity-20"
                    >
                      <Image
                        // @ts-ignore TYPE NEEDS FIXING
                        src={NETWORK_ICON[key]}
                        alt="Switch Network"
                        className="rounded-md"
                        width="24px"
                        height="24px"
                      />
                      <p className="text-high-emphesis">{NETWORK_LABEL[key]}</p>
                    </div>
                  );
                }
                return (
                  <button
                    key={i}
                    onClick={async () => {
                      console.debug(
                        `Switching to chain ${key}`,
                        SUPPORTED_NETWORKS[key]
                      );
                      toggleNetworkModal();
                      const params = SUPPORTED_NETWORKS[key];
                      try {
                        await library?.send("wallet_switchEthereumChain", [
                          { chainId: `0x${key.toString(16)}` },
                          account,
                        ]);
                      } catch (switchError) {
                        // This error code indicates that the chain has not been added to MetaMask.
                        // @ts-ignore TYPE NEEDS FIXING
                        if (switchError.code === 4902) {
                          try {
                            await library?.send("wallet_addEthereumChain", [
                              params,
                              account,
                            ]);
                          } catch (addError) {
                            // handle "add" error
                            console.error(`Add chain error ${addError}`);
                          }
                        }
                        console.error(`Switch chain error ${switchError}`);
                        // handle other "switch" errors
                      }
                    }}
                    className="bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 w-full px-4 py-2 rounded border border-gray hover:border-navy-blue"
                  >
                    {/*@ts-ignore TYPE NEEDS FIXING*/}
                    <Image
                      src={NETWORK_ICON[key]}
                      alt="Switch Network"
                      className="rounded-md"
                      width="24px"
                      height="24px"
                    />
                    <p className="text-high-emphesis">{NETWORK_LABEL[key]}</p>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NetworkModal;
