import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Popover, Menu } from "@headlessui/react";
import Web3Status from "../Web3Status";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import useBalances from "hooks/useBalance";

// components
import More from "./More";
import Banner from "components/CopyBanner";

// functions
import { formatBalance } from "functions/format";
import { metaMask } from "connectors/metaMask";
import { addresses } from "constants/contract";
import { ChainId } from "constants/chainIds";
import Web3Network from "components/Web3Network";
import { useGetLuxBalance } from "state/Lux/hooks";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

function AppBar(props: { banner?: boolean }): JSX.Element {
  const { library, accounts, account, connector, chainId } =
    useActiveWeb3React();
  const balances = useBalances(library, accounts);
  const getBalance = useGetLuxBalance();
  const chainAddresses =
    (addresses[chainId] as any) || (addresses[ChainId.MAINNET] as any);

  useEffect(() => {
    if (account) {
      getBalance(account);
    }
  }, [account, chainId]);
  return (
    <>
      <header className="fixed z-10 flex-shrink-0 w-full bg-black">
        {/* <Banner /> */}
        <Popover
          as="nav"
          className="z-10 w-full bg-transparent header-border-b"
        >
          {({ open }) => (
            <>
              <div className="px-4 py-4 mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                  <Link href="">
                    <div className=" h-full pl-2 cursor-pointer logo w-full lg:w-[120px] flex">
                      <Image
                        src="/images/logo2.svg"
                        width={130}
                        height={50}
                        alt="space coin logo"
                      />
                    </div>
                  </Link>
                  <div className="flex items-center justify-center w-3/4">
                    <div className="hidden sm:block sm:ml-4">
                      <div className="flex space-x-2">
                        {/* <Buy /> */}
                        <Link href="/swap" passHref>
                          <a
                            id={`swap-nav-link`}
                            className="p-2 text-baseline text-primary hover:text-green focus:text-high-emphesis md:p-3 whitespace-nowrap"
                            style={{ letterSpacing: "2px" }}
                          >
                            Swap
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="  text-xs flex flex-row-reverse items-center rounded hover:bg-dark-800 p-0.5 whitespace-nowrap  font-bold cursor-pointer select-none pointer-events-auto">
                    {account &&
                      chainId &&
                      [ChainId.MAINNET, ChainId.RINKEBY].includes(chainId) &&
                      balances && (
                        <>
                          <div className="px-3 py-2 text-primary text-bold">
                            {balances?.[0]
                              ? ` ${formatBalance(balances[0], 18, 3)}`
                              : null}{" "}
                            {"ETH"}
                          </div>
                        </>
                      )}
                    <Web3Status
                      title="Connect Wallet"
                      className="px-6 py-4  rounded-full font-bold bg-gradient-to-r from-[#4F40DF] to-[#3870E7] text-white"
                    />
                  </div>

                  <div className="bottom-0 left-0 z-10 flex flex-row items-center justify-center lg:w-auto bg-dark-1000 lg:relative lg:p-0 lg:bg-transparent">
                    <div className="flex items-center justify-between w-full space-x-4 sm:justify-end">
                      {chainId &&
                        [ChainId.MAINNET, ChainId.RINKEBY].includes(chainId) &&
                        connector &&
                        connector === metaMask && (
                          <HtmlTooltip
                            title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  Import LUX
                                </Typography>
                                <p>
                                  By clicking this icon, LUX token would be
                                  imported to your wallet as a custom token
                                </p>
                              </React.Fragment>
                            }
                          >
                            <div className="inline-flex w-[25px]">
                              <div
                                className="flex rounded-md cursor-pointer sm:inline-flex bg-dark-900 hover:bg-dark-800"
                                onClick={() => {
                                  const tokenAddress =
                                    chainAddresses.LUX ||
                                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
                                  const tokenSymbol = "LUX";
                                  const tokenDecimals = 18;
                                  const tokenImage =
                                    window.location.origin + "/favicon.ico";
                                  if (
                                    connector &&
                                    connector === metaMask &&
                                    connector.provider.request
                                  ) {
                                    const params: any = {
                                      type: "ERC20",
                                      options: {
                                        address: tokenAddress,
                                        symbol: tokenSymbol,
                                        decimals: tokenDecimals,
                                        image: tokenImage,
                                      },
                                    };
                                    connector.provider
                                      .request({
                                        method: "wallet_watchAsset",
                                        params,
                                      })
                                      .then((success) => {
                                        if (success) {
                                          console.log(
                                            "Successfully added LUX to MetaMask"
                                          );
                                        } else {
                                          throw new Error(
                                            "Something went wrong."
                                          );
                                        }
                                      })
                                      .catch(console.error);
                                  }
                                }}
                              >
                                <Image
                                  src="/favicon.ico"
                                  alt="LUX"
                                  width={30}
                                  height={30}
                                  objectFit="contain"
                                  className="rounded-md"
                                />
                              </div>
                            </div>
                          </HtmlTooltip>
                        )}

                      {connector && connector === metaMask && (
                        <div className="hidden sm:inline-block">
                          <Web3Network />
                        </div>
                      )}
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
              {/* Mobile View Navbar Dropdown */}
              <Popover.Panel className="sm:hidden">
                <div className="flex flex-col px-4 pt-2 pb-3 space-y-1">
                  <Link passHref href="/swap">
                    <a
                      id={`swap-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-green focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      style={{ letterSpacing: "2px" }}
                    >
                      Swap
                    </a>
                  </Link>

                  {/* <div className="w-auto flex items-center rounded bg-dark-900 hover:bg-dark-800 p-0.5 whitespace-nowrap text-sm font-bold cursor-pointer select-none pointer-events-auto">
                  {account && chainId && userEthBalance && (
                    <>
                      <div className="px-3 py-2 text-primary text-bold">
                        {userEthBalance?.toFixed(3)}{" "}
                        {NATIVE[chainId]?.symbol || "ETH"}
                      </div>
                    </>
                  )}
                  <Web3Status
                    title={i18n._(t`My Wallet`)}
                    className="font-bold border border-green text-green"
                  />
                </div>

                {chainId && featureEnabled(Feature.LIQUIDITY_MINING, chainId) && (
                  <Link href={"/farm"}>
                    <a
                      id={`farm-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {" "}
                      {i18n._(t`Farm`)}
                    </a>
                  </Link>
                )}

                {chainId && featureEnabled(Feature.KASHI, chainId) && (
                  <>
                    <Link href={"/lend"}>
                      <a
                        id={`lend-nav-link`}
                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      >
                        {i18n._(t`Lend`)}
                      </a>
                    </Link>

                    <Link href={"/borrow"}>
                      <a
                        id={`borrow-nav-link`}
                        className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                      >
                        {i18n._(t`Borrow`)}
                      </a>
                    </Link>
                  </>
                )}

                {chainId && featureEnabled(Feature.STAKING, chainId) && (
                  <Link href={"/stake"}>
                    <a
                      id={`stake-nav-link`}
                      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                    >
                      {i18n._(t`Stake`)}
                    </a>
                  </Link>
                )}

                {chainId && featureEnabled(Feature.ANALYTICS, chainId) && (
                  <ExternalLink
                    id={`analytics-nav-link`}
                    href={
                      ANALYTICS_URL[chainId] || "https://analytics.sushi.com"
                    }
                    className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
                  >
                    {i18n._(t`Analytics`)}
                  </ExternalLink>
                )}
                */}
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      </header>
    </>
  );
}

export default AppBar;
