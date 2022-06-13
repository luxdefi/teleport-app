import useActiveWeb3React from "hooks/useActiveWeb3React";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  useBridge,
  useFetchUserBalances,
  useGetAvailableTokens,
  useGetCurrentBalances,
  useGetQuote,
  useSwap,
  useUpdateActiveChains,
} from "state/swap/hooks";
import { AppState } from "state/store";
import { useAppSelector } from "state/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  Field,
  updateActiveChains,
  updateCurrentAmount,
  updateCurrentSelectSide,
  updateCurrentTrade,
  updateError,
} from "state/swap/action";
import SwapHeader from "components/Swap/Header";
import Exchange from "components/Swap/Exchange";
import Lottie from "lottie-react";
import { useWalletModalToggle } from "state/application/hooks";
import { ChainId } from "constants/chainIds";
import Head from "next/head";
import TransactionDetail from "components/Swap/TransactionDetail";
import CustomizedSteppers from "components/Stepper";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { NETWORK_LABEL, SUPPORTED_NETWORKS } from "config/networks";
import ListCard from "components/Swap/ListCard";
import { useLbtcContract, useTeleportContract } from "hooks/useContract";
import { Contract } from "ethers";
import addresses from "constants/addresses";
import Web3 from "web3";
import { isAddress } from "functions/validate";

interface SwapProps {}

const Swap: React.FC<SwapProps> = ({}) => {
  const { library, connector, chainId, account } = useActiveWeb3React();
  const { loading } = useSelector((state: any) => state.swap);
  const { Moralis, initialize } = useMoralis();
  const teleportContract = useTeleportContract();
  const dispatch = useDispatch();
  const toggleWalletModal = useWalletModalToggle();
  const getAvailableTokens = useGetAvailableTokens();
  const fetchUserBalances = useFetchUserBalances();
  const getCurrentBalances = useGetCurrentBalances();
  const swapTokens = useSwap();
  const bridgeTokens = useBridge();
  const getQuote = useGetQuote();
  const updateChains = useUpdateActiveChains();
  const [animateSwapArrows, setAnimateSwapArrows] = useState<boolean>(false);
  const [TeleportContractBurn, setTeleportContractBurn] = useState<any>();
  const [TeleportContractMint, setTeleportContractMint] = useState<Contract>();
  const [fromTeleportAddr, setFromTeleportAddr] = useState("");
  const [evmToAddress, setEvmToAddress] = useState("");

  const router = useRouter();
  // get query
  const query = router.query;
  // console.log("app_query", query?.toChain, query?.fromChain);

  // useEffect(() => {
  //   if (!query.fromChain) {
  //     fromChain(ChainId.MAINNET);
  //   }
  //   if (!query.toChain) {
  //     toChain(ChainId.MAINNET);
  //   }
  // }, [fromChain, query.fromChain, query.toChain, toChain]);

  const {
    currentAmount,
    currentTrade,
    currentBalances,
    error,
    currentSelectSide,
    balances,
    activeChains,
  } = useAppSelector((state: AppState) => state.swap);

  // useEffect(() => {
  //   getAvailableTokens();
  // }, [getAvailableTokens]);

  const initMoralis = useCallback(() => {
    async () => {
      console.log("initMoralis chainId", chainId);
      if (chainId) {
        try {
          await Moralis.initPlugins();
          await Moralis.enableWeb3();
          getAvailableTokens();
          fetchUserBalances();
          if (!Moralis.User.current()) await Moralis.authenticate();
        } catch (error) {
          console.log("error in init", error);
        }
      }
    };
  }, [Moralis, chainId, fetchUserBalances, getAvailableTokens]);

  useEffect(() => {
    console.log("initMoralis chainId", chainId);

    initMoralis();
  }, [chainId]);

  useEffect(() => {
    if (currentTrade) {
      getCurrentBalances();
    }
  }, [currentTrade, balances]);

  const handleChange = (value, side?) => {
    const newAmount = { ...currentAmount, [side || currentSelectSide]: value };
    if (currentBalances[Field.INPUT] < newAmount.from) {
      dispatch(
        updateError({
          description: "Insufficient Balance",
        })
      );
    } else {
      dispatch(updateError(null));
    }
    console.log("newAmountssssss", newAmount);
    if (side) {
      console.log("side exisststsss currentSelectSide", side);
      updateCurrentSelectSide(side);
    }
    dispatch(updateCurrentAmount(newAmount));
    getQuote(newAmount, side);
  };
  const onSwitchTokens = () => {
    router.query["fromChain"] = String(activeChains.to);
    router.query["toChain"] = String(activeChains.from);
    router.query["from"] = String(currentTrade.to.symbol.toUpperCase());
    router.query["to"] = String(currentTrade.from.symbol.toUpperCase());
    router.push(router);
    dispatch(
      updateCurrentTrade({
        to: currentTrade.from,
        from: currentTrade.to,
      })
    );
    dispatch(
      updateActiveChains({
        to: activeChains.from,
        from: activeChains.to,
      })
    );

    const newAmount = {
      to: currentAmount.from,
      from: currentAmount.to,
    };
    dispatch(updateCurrentAmount(newAmount));
  };

  //BRIDGE FUNCTIONS
  const lBTCContract = useLbtcContract();

  async function checkBalanceInput(value) {
    const usrBalance = Web3.utils.fromWei(
      (await lBTCContract.balanceOf(account)).toString(),
      "ether"
    );

    console.log(
      "User Balance:",
      Number(value),
      Number(usrBalance),
      Number(value) > Number(usrBalance)
    );

    if (value && usrBalance) {
      if (Number(value) > Number(usrBalance)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  async function handleInput() {
    await setNets();
    const msgSig = await library
      ?.getSigner()
      .signMessage("Sign to prove you are initiator of transaction.");

    try {
      const amt = Web3.utils.toWei(currentAmount[Field.INPUT].toString()); // Convert intialAmt toWei
      console.log("TeleportContractBurn:", TeleportContractBurn);

      const tx = await TeleportContractBurn.bridgeBurn(
        amt,
        currentTrade[Field.INPUT].address
      ); // Burn coins

      let cnt = 0;

      // Listen for burning completion
      TeleportContractBurn.once("BridgeBurned", async (caller, amount) => {
        console.log("Recipient:", caller);
        console.log("Amount:", amount.toString());

        if (cnt == 0) {
          handleMint(amount, cnt, query?.fromChain, query?.toChain, tx, msgSig);
          cnt++;
        }
      });

      const receipt = await tx.wait();
      console.log("Receipt:", receipt, receipt.status === 1);

      if (receipt.status !== 1) {
        console.log("Transaction Failure.");

        return;
      } else {
        console.log("Receipt received");
        TeleportContractBurn.off("BridgeBurned");
        TeleportContractBurn.removeAllListeners(["BridgeBurned"]);

        if (cnt == 0) {
          console.log(
            "cookie array:",
            amt,
            cnt,
            tx,
            currentAmount[Field.INPUT].name
          );
          await handleMint(
            amt,
            cnt,
            query?.fromChain,
            query?.toChain,
            tx,
            msgSig
          );
          cnt++;
        }
      }
    } catch (err) {
      console.log("Error:", err);
      return;
    }
  }

  function setNets() {
    console.log("currentTrade", currentTrade);
    console.log("teleportContract", teleportContract);
    const fromNetRadio = query?.fromChain;
    const toNetRadio = query?.toChain;
    console.log("chains", fromNetRadio, toNetRadio);
    if (fromNetRadio == "43113" && toNetRadio == "4") {
      // && tokenName == "LuxBTC" => check if token is LBTC or LETH
      console.log("from lux to eth chain");
      setTeleportContractBurn(teleportContract); //set contract burn to teleport lux contract
      setTeleportContractMint(teleportContract); //set contract mint to teleport eth contract
      setFromTeleportAddr(addresses.Teleport_Lux);
    } else if (fromNetRadio == "4" && toNetRadio == "43113") {
      console.log("from eth to lux chain");

      setTeleportContractBurn(teleportContract); //set contract burn to teleport eth contract
      setTeleportContractMint(teleportContract); //set contract mint to teleport lux contract
      setFromTeleportAddr(addresses.Teleport_Eth);
    }
    console.log("TeleportContractBurn", TeleportContractBurn);
    console.log("setTeleportContractMint", setTeleportContractMint);
    console.log("fromTeleportAddr", fromTeleportAddr);
  }

  //async function handleMint(amount, cnt, fromNetId, toNetId, receipt, tx){
  async function handleMint(amount, cnt, fromNetId, toNetId, tx, msgSig) {
    const amtNoWei = Web3.utils.fromWei(amount.toString());
    console.log("amtNoWei", Number(amtNoWei), "cnt", cnt);
    const txid = tx.hash;
    console.log("txid:", txid);

    if (Number(amtNoWei) > 0 && cnt == 0) {
      console.log("bridge received coins with transaction has", txid);

      const toNetIdHash = Web3.utils.keccak256(toNetId.toString());
      const toTargetAddrHash = Web3.utils.keccak256(evmToAddress); //Web3.utils.keccak256(evmToAddress.slice(2));
      const toTokenAddrHash = Web3.utils.keccak256(
        currentTrade[Field.OUTPUT].address
      ); //Web3.utils.keccak256(toTokenAddress.slice(2));
      console.log(
        "toTargetAddrHash",
        toTargetAddrHash,
        "toNetIdHash",
        toNetIdHash,
        "toTokenAddrHash",
        toTokenAddrHash
      );
      //var cmd = "http://localhost:5000/api/v1/getsig/txid/"+txid+"/fromNetId/"+fromNetId+"/toNetIdHash/"+toNetIdHash+"/tokenName/"+tokenName+"/tokenAddrHash/"+toTokenAddrHash+"/msgSig/"+msgSig+"/toTargetAddrHash/"+toTargetAddrHash;
      const cmd =
        "https://teleporter.wpkt.cash/api/v1/getsig/txid/" +
        txid +
        "/fromNetId/" +
        fromNetId +
        "/toNetIdHash/" +
        toNetIdHash +
        "/tokenName/" +
        currentTrade[Field.OUTPUT].name +
        "/tokenAddrHash/" +
        toTokenAddrHash +
        "/msgSig/" +
        msgSig +
        "/toTargetAddrHash/" +
        toTargetAddrHash;

      console.log("cmd", cmd);

      fetch(cmd)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("Data:", result);

          if (result.signature && result.hashedTxId) {
            // Set globals
            console.log("result here", result);
          } else if (Number(result.output) === -1) {
            console.log("Duplicate transaction.");
            return;
          } else if (Number(result.output) === -3) {
            console.log("Gas price error.");
            return;
          } else if (Number(result.output) === -4) {
            console.log("Unknown Error.");
            return;
          } else if (Number(result.output) === -5) {
            console.log("Front Run Attempt.");
            return;
          } else {
            console.log("Bad transaction.");
            return;
          }
        })
        .catch(async function (err) {
          console.log("error", err);
          return;
        });

      return;
    } else {
      return;
    }
  }
  console.log("currentBalances", currentBalances);
  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full h-full px-2 mt-24 sm:px-0">
      <div id="swap-page" className="w-full max-w-xl py-4 md:py-8 lg:py-12">
        <Head>
          <title>LUX | BRIDGE</title>
          <meta
            key="description"
            name="description"
            content="Lux Zero Knowledge Privacy Bridge"
          />
        </Head>

        <div className="py-6 space-y-4 rounded-3xl bg-primary z-1 mb-7">
          {/* Add slippage */}
          <div className="px-5">
            <SwapHeader
              input={currentTrade[Field.INPUT]}
              output={currentTrade[Field.OUTPUT]}
              crossChain={query?.fromChain !== query?.toChain}
              bothSelected={
                currentTrade.from &&
                currentTrade.to &&
                activeChains.fromChain &&
                activeChains.toChain
              }
              fromChain={NETWORK_LABEL[Number(activeChains?.fromChain)]}
              toChain={NETWORK_LABEL[Number(activeChains?.toChain)]}
            />
          </div>
          {/* <ConfirmSwapModal
                isOpen={showConfirm}
                trade={trade}
                originalTrade={tradeToConfirm}
                onAcceptChanges={handleAcceptChanges}
                attemptingTxn={attemptingTxn}
                txHash={txHash}
                recipient={recipient}
                allowedSlippage={allowedSlippage}
                onConfirm={handleSwap}
                swapErrorMessage={swapErrorMessage}
                onDismiss={handleConfirmDismiss}
                minerBribe={doArcher ? archerETHTip : undefined}
              /> */}
          <div className="mb-12">
            <div className="px-5">
              <Exchange
                // priceImpact={priceImpact}
                label={`Swap From:`}
                selectedCurrencyBalance={currentBalances[Field.INPUT]}
                value={currentAmount[Field.INPUT]}
                showMaxButton={true}
                token={currentTrade[Field.INPUT]}
                onUserInput={handleChange}
                onMax={() =>
                  handleChange(currentBalances[Field.INPUT], Field.INPUT)
                }
                // fiatValue={fiatValueInput ?? undefined}
                onCurrencySelect={(token) => {
                  dispatch(
                    updateCurrentTrade({
                      ...currentTrade,
                      from: { ...token, isNative: token.symbol === "ETH" },
                    })
                  );
                  router.query.from = token.symbol.toUpperCase();
                  router.push(router);
                }}
                otherToken={currentTrade[Field.OUTPUT]}
                showCommonBases={true}
                onKeyDownFunc={() =>
                  dispatch(updateCurrentSelectSide(Field.INPUT))
                }
                id="swap-currency-input"
                onChainChange={(val) => updateChains(val, "fromChain")}
              />
            </div>
            <div className="relative grid py-3">
              <hr className="h-px bg-[#323546] opacity-30 block absolute w-full top-[50%] z-[1]" />
              <div className="z-10 flex flex-wrap justify-center w-full px-4">
                <button
                  className="-mt-6 -mb-6 rounded-full"
                  onClick={() => {
                    onSwitchTokens();
                  }}
                >
                  <div className="p-1 rounded-full bg-secondary">
                    <div
                      className="flex flex-col justify-center py-1 rounded-full"
                      onMouseEnter={() => setAnimateSwapArrows(true)}
                      onMouseLeave={() => setAnimateSwapArrows(false)}
                    >
                      <Image
                        src="/icons/swithcer.svg"
                        alt=""
                        width={30}
                        height={30}
                        className="stroke-white"
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="px-5">
              <Exchange
                // priceImpact={priceImpact}
                label={`Swap To:`}
                selectedCurrencyBalance={currentBalances[Field.OUTPUT]}
                value={currentAmount[Field.OUTPUT]}
                showMaxButton={true}
                token={currentTrade[Field.OUTPUT]}
                onUserInput={handleChange}
                onMax={() =>
                  handleChange(currentBalances[Field.OUTPUT], Field.OUTPUT)
                }
                // fiatValue={fiatValueInput ?? undefined}
                onCurrencySelect={(token) => {
                  dispatch(
                    updateCurrentTrade({
                      ...currentTrade,
                      to: { ...token, isNative: token.symbol === "ETH" },
                    })
                  );
                  router.query.to = token.symbol.toUpperCase();
                  router.push(router);
                }}
                otherToken={currentTrade[Field.INPUT]}
                showCommonBases={true}
                onKeyDownFunc={() =>
                  dispatch(updateCurrentSelectSide(Field.OUTPUT))
                }
                id="swap-currency-output"
                onChainChange={(val) => updateChains(val, "toChain")}
              />
            </div>
          </div>
          {currentTrade.from &&
            currentTrade.to &&
            !!query?.fromChain &&
            !!query?.toChain &&
            query?.toChain !== query?.fromChain && (
              <CustomizedSteppers
                steps={[
                  {
                    label: "LUX",
                    icon: 1,
                    logo: "/icons/uniswap.png",
                  },
                  {
                    label: "Lux",
                    sublabel: "Smart Routing",
                    icon: 2,
                    logo: "/icons/lux-logo.svg",
                  },
                  {
                    label: "Teleport",
                    icon: 3,
                    logo: "/icons/livepeer.png",
                  },
                ]}
              />
            )}
          {currentTrade.from &&
            currentTrade.to &&
            !!query?.fromChain &&
            !!query?.toChain &&
            query?.toChain === query?.fromChain && (
              <div className="px-5">
                <ListCard
                  fee="$37.74"
                  label="Via Teleport"
                  amount="0.000000000491183"
                  className="flex items-center justify-between"
                />
                <div className="flex flex-wrap gap-x-6">
                  {/* <ListCard
                    fee="$37.74"
                    label="Via Uniswap V2"
                    amount="0.000000000491183"
                    background="bg-white-2"
                  />
                  <ListCard
                    fee="$37.74"
                    label="Via 0x"
                    amount="0.000000000491183"
                    background="bg-white-2"
                  />
                  <ListCard
                    fee="$37.74"
                    label="Via 1inch"
                    amount="0.000000000491183"
                    background="bg-white-2"
                  />
                  <ListCard
                    fee="$37.74"
                    label="Via Uniswap V3"
                    amount="0.000000000491183"
                    background="bg-white-2"
                  /> */}
                </div>
              </div>
            )}
          <div className="flex px-5 mt-1">
            <input
              type="text"
              id="token-search-input"
              placeholder="Enter Destination Address"
              autoComplete="off"
              value={evmToAddress}
              onChange={(e) => setEvmToAddress(e.target.value)}
              className="w-2/3 bg-transparent border bg-[#1B1D2B] border-[#323546] focus:outline-none rounded-full placeholder-white-50  font-light text-sm pl-11 px-6 py-4 mr-2"
            />
            {!account ? (
              <div
                className="w-1/3 px-6 py-4 text-base text-center text-white border rounded-full shadow-sm cursor-pointer focus:ring-2 focus:ring-offset-2 bg-primary-300 border-dark-800 focus:ring-offset-dark-700 focus:ring-dark-800 disabled:bg-opacity-80 disabled:cursor-not-allowed focus:outline-none"
                onClick={toggleWalletModal}
              >
                Connect Wallet
              </div>
            ) : !evmToAddress || !isAddress(evmToAddress) ? (
              <div>
                <p>Add a valid EVM Address</p>
              </div>
            ) : (
              <button
                className="w-1/3 px-3 py-4 text-base text-center text-white border rounded-full shadow-sm focus:ring- focus:ring-offset- bg-primary-300 border-dark-800 focus:ring-offset-dark-700 focus:ring-dark-800 disabled:bg-opacity-80 disabled:cursor-not-allowed focus:outline-none"
                onClick={async () => {
                  if (chainId !== Number(query?.fromChain)) {
                    // connector.activate(Number(query?.fromChain));
                    console.debug(
                      `Switching to chain ${Number(query?.fromChain)}`,
                      SUPPORTED_NETWORKS[Number(query?.fromChain)]
                    );
                    const params = SUPPORTED_NETWORKS[Number(query?.fromChain)];
                    try {
                      await library?.send("wallet_switchEthereumChain", [
                        {
                          chainId: `0x${Number(query?.fromChain).toString(16)}`,
                        },
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
                  } else handleInput();
                }}
                id="swap-button"
                // disabled={
                //   (chainId === Number(query?.fromChain ?? 1) &&
                //     ((query?.fromChain ?? 1) === (query?.toChain ?? 1) &&
                //     query?.to &&
                //     query?.from &&
                //     query?.to === query?.from
                //       ? true
                //       : false)) ||
                //   error ||
                //   ![ChainId.MAINNET, ChainId.RINKEBY].includes(chainId)
                // }
              >
                {loading ? (
                  <i className="text-white fas fa-circle-notch animate-spin" />
                ) : query?.fromChain && chainId !== Number(query?.fromChain) ? (
                  `switch to ${
                    NETWORK_LABEL[Number(query?.fromChain) || 1]
                  } network` ? (
                    (query?.fromChain ?? 1) === (query?.toChain ?? 1) &&
                    query?.to &&
                    query?.from &&
                    query?.to === query?.from ? (
                      "Cannot swap same token"
                    ) : error ? (
                      error.description
                    ) : (
                      "Swap"
                    )
                  ) : null
                ) : (
                  "Bridge"
                )}
              </button>
            )}
          </div>
          {/* <UnsupportedCurrencyFooter show={swapIsUnsupported} currentTrade={[currentTrade.INPUT, currentTrade.OUTPUT]} /> */}
        </div>
        {query.from && query.to && currentTrade.from !== 0 && (
          <TransactionDetail evmToAddress={evmToAddress} />
        )}
      </div>
    </main>
  );
};

export default Swap;
