import React, { useEffect, useState } from "react";

import ExternalLink from "../ExternalLink";
import Image from "next/image";
import Link from "next/link";
import More from "./More";
import NavLink from "../NavLink";
import { Popover } from "@headlessui/react";
import Web3Network from "../Web3Network";
import Web3Status from "../Web3Status";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { NATIVE } from "constants/chainIds";
import useBalances from "hooks/useBalance";
import { useGetLuxBalance } from "state/Lux/hooks";
import { formatBalance } from "functions/format";
import { SUPPORTED_NETWORKS } from "config/networks";
// import { ChainId } from '../../config/networks'

// import { ExternalLink, NavLink } from "./Link";
// import { ReactComponent as Burger } from "../assets/images/burger.svg";

function AppBar(): JSX.Element {
  const { account, chainId, library, accounts } = useActiveWeb3React();

  const balances = useBalances(library, accounts);
  const getBalance = useGetLuxBalance();
  useEffect(() => {
    if (account) {
      getBalance(account);
    }
  }, [account, chainId]);

  return (
    //     // <header className="flex flex-row justify-between w-screen flex-nowrap">
    <header className="absolute flex-shrink-0 w-full">
      <Popover as="nav" className="z-10 w-full bg-transparent header-border-b">
        {({ open }) => (
          <>
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* <Image src="/logo.png" alt="Sushi" width="32px" height="32px" /> */}

                  <NavLink href="/swap">
                    <div className="flex items-center pl-2 cursor-pointer logo">
                      <Image
                        src="/lux_logo.svg"
                        className="w-10"
                        alt="Logo"
                        width={32}
                        height={32}
                      />
                    </div>
                  </NavLink>
                  <div className="hidden sm:block sm:ml-4">
                    <div className="flex space-x-2">
                      <NavLink href={"/swap"}>
                        <a
                          id={`swap-nav-link`}
                          className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                        >
                          Swap
                        </a>
                      </NavLink>
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-0 left-0 z-10 flex flex-row items-center justify-center w-full p-4 lg:w-auto bg-dark-1000 lg:relative lg:p-0 lg:bg-transparent">
                  <div className="flex items-center justify-between w-full space-x-2 sm:justify-end">
                    {/* {chainId && [ChainId.MAINNET].includes(chainId) && library && library.provider.isMetaMask && (
                      <>
                        <QuestionHelper text={i18n._(t`Add xSUSHI to your MetaMask wallet`)}>
                          <div
                            className="hidden p-0.5 rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800"
                            onClick={() => {
                              if (library && library.provider.isMetaMask && library.provider.request) {
                                const params: any = {
                                  type: 'ERC20',
                                  options: {
                                    address: '0x8798249c2e607446efb7ad49ec89dd1865ff4272',
                                    symbol: 'XSUSHI',
                                    decimals: 18,
                                    image:
                                      'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272/logo.png',
                                  },
                                }
                                library.provider
                                  .request({
                                    method: 'wallet_watchAsset',
                                    params,
                                  })
                                  .then((success) => {
                                    if (success) {
                                      console.log('Successfully added XSUSHI to MetaMask')
                                    } else {
                                      throw new Error('Something went wrong.')
                                    }
                                  })
                                  .catch(console.error)
                              }
                            }}
                          >
                            <Image
                              src="/images/tokens/xsushi-square.jpg"
                              alt="xSUSHI"
                              width="38px"
                              height="38px"
                              objectFit="contain"
                              className="rounded-md"
                            />
                          </div>
                        </QuestionHelper>
                      </>
                    )}

                    {chainId && chainId in SUSHI_ADDRESS && library && library.provider.isMetaMask && (
                      <>
                        <QuestionHelper text={i18n._(t`Add SUSHI to your MetaMask wallet`)}>
                          <div
                            className="hidden rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800 p-0.5"
                            onClick={() => {
                              const params: any = {
                                type: 'ERC20',
                                options: {
                                  address: SUSHI_ADDRESS[chainId],
                                  symbol: 'SUSHI',
                                  decimals: 18,
                                  image:
                                    'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
                                },
                              }
                              if (library && library.provider.isMetaMask && library.provider.request) {
                                library.provider
                                  .request({
                                    method: 'wallet_watchAsset',
                                    params,
                                  })
                                  .then((success) => {
                                    if (success) {
                                      console.log('Successfully added SUSHI to MetaMask')
                                    } else {
                                      throw new Error('Something went wrong.')
                                    }
                                  })
                                  .catch(console.error)
                              }
                            }}
                          >
                            <Image
                              src="/images/tokens/sushi-square.jpg"
                              alt="SUSHI"
                              width="38px"
                              height="38px"
                              objectFit="contain"
                              className="rounded-md"
                            />
                          </div>
                        </QuestionHelper>
                      </>
                    )} */}

                    {library && library.provider.isMetaMask && (
                      <div className="hidden sm:inline-block">
                        <Web3Network />
                      </div>
                    )}

                    <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                      {account && chainId && (
                        <>
                          <div className="px-3 py-2 text-white text-bold">
                            {balances?.[0]
                              ? ` ${formatBalance(balances[0], 18, 3)}`
                              : null}{" "}
                            {/* {NATIVE[chainId]?.symbol || "ETH"} */}
                            {SUPPORTED_NETWORKS[chainId]?.nativeCurrency
                              ?.symbol || "ETH"}
                          </div>
                        </>
                      )}
                      <Web3Status title="Connect Wallet" />
                    </div>
                    {/* <div className="hidden md:block">
                      <LanguageSwitch />
                    </div> */}
                    {/* <More /> */}
                  </div>
                </div>
                <div className="flex -mr-2 sm:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-high-emphesis focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      // <X title="Close" className="block w-6 h-6" aria-hidden="true" />
                      <svg
                        className="block w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                      // <Burger title="Burger" className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
              </div>
            </div>

            <Popover.Panel className="sm:hidden">
              <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                <Link href="/swap">
                  <a
                    id={`swap`}
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    SWAP
                  </a>
                </Link>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </header>
  );
}

export default AppBar;
