import { Contract, ethers } from "ethers";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  getTotalNfts,
  getTotalNftSold,
  getUserNfts,
  getContractAddress,
  getNftDetails,
  getNftPrice,
  getNftMaxSupply,
  getNftsPerMint,
  getNftTotalSupply,
} from "./action";
import { nftContractAddress, useNftContract } from "../../hooks/useContract";

import { toast } from "react-toastify";
import { useMintModalToggle } from "state/application/hooks";
import { notify } from "components/alertMessage";
import { NFT_PRICE } from "../../constants";
import axios from "axios";
import { useAppDispatch } from "state/store";
// curl --request GET \
//      --url https://api.opensea.io/api/v1/collection/artmobnft/stats \
//      --header 'Accept: application/json'
export function useGetUserNfts(): (ownerAddress) => void {
  const dispatch = useDispatch();
  return useCallback((ownerAddress) => {
    const URL = `${process.env.NEXT_PUBLIC_OPENSEA_URL}?owner=${ownerAddress}&asset_contract_address=${nftContractAddress}&order_direction=desc&offset=0&limit=20&collection=${process.env.NEXT_PUBLIC_COLLECTION_NAME}`;
    axios
      .get(`${URL}`, {
        headers: {
          'X-API-KEY': 'fb065181b2d948afa493d41f7da09f28',
        }
      })
      .then((res) => {
        console.log("ress fething user nfts", res);
        dispatch(getUserNfts(res.data.assets));
      })
      .catch((error) => console.log("error fething user nfts"));
  }, []);
}
export function useGetNftSupply(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => {
    const URL = `https://api.opensea.io/api/v1/collection/artmobnft/stats`;
    axios
      .get(`${URL}`, {
        headers: {
          'X-API-KEY': 'fb065181b2d948afa493d41f7da09f28',
        }
      })
      .then((res) => {
        console.log("ress fething getNftTotalSupply nfts", res);
        dispatch(getNftTotalSupply(res.data.stats.total_supply));
      })
      .catch((error) => console.log("error fething getNftTotalSupply nfts"));
  }, []);
}

export const useGetContractAddress = () => {
  const dispatch = useDispatch();
  const contract: Contract | null = useNftContract();

  return useCallback(async () => {
    try {
      const transaction = await contract?.getContractAddress();
      dispatch(getContractAddress(transaction));
    } catch (error) {
      console.log("getContractAddress error:", error);
      toast.error(error);
    }
  }, [contract, dispatch]);
};

export function useGetNftDetails(): [
  () => void,
  () => void,
  () => void,
  () => void
] {
  const dispatch = useAppDispatch();
  const contract: Contract | null = useNftContract();
  console.log('contract', contract)
  // NFT_PRICE(), NFT_MAX_SUPPL(), NFTS_PER_MINT(), revealed()

  const getPrice = useCallback(async () => {
    try {
      const price = await contract?.NFT_PRICE();
      console.log("NFT DETAILS price:", price.toString());
      dispatch(getNftPrice(price.toString()));
    } catch (error) {
      console.log("NFT DETAILS error:", error);
      toast.error(error);
    }
  }, []);

  const getMaxSupply = useCallback(async () => {
    // try {
    //   const maxSupply = await contract?.NFT_MAX_SUPPLY();
    //   console.log("NFT DETAILS maxSupply:", maxSupply.toString());
    //   dispatch(getNftMaxSupply(maxSupply.toString()));
    // } catch (error) {
    //   console.log("NFT DETAILS error:", error);
    //   toast.error(error);
    // }
  }, []);
  const getPerMint = useCallback(async () => {
    try {
      const nftsPerMint = await contract?.NFTS_PER_MINT();
      console.log("NFT DETAILS nftsPerMint:", nftsPerMint.toString());
      dispatch(getNftsPerMint(nftsPerMint.toString()));
    } catch (error) {
      console.log("NFT DETAILS error:", error);
      toast.error(error);
    }
  }, []);
  const getTotalSupply = useCallback(async () => {
    try {
      const totalSupply = await contract?.totalSupply();
      console.log("NFT DETAILS totalSupply:", totalSupply.toString());
      dispatch(getNftTotalSupply(totalSupply.toString()));
    } catch (error) {
      console.log("NFT DETAILS error:", error);
      toast.error(error);
    }
  }, []);

  return [getPrice, getMaxSupply, getPerMint, getTotalSupply];
}

export function useMint(): (
  quantity: string,
  price: string,
  setLoading: (val: boolean) => void
  // contract: Contract
) => void {
  const toggleMintModal = useMintModalToggle();
  const [getPrice, getMaxSupply,
    getPerMint, getTotalSupply] = useGetNftDetails();
  const dispatch = useDispatch();
  const contract: Contract | null = useNftContract();
  return useCallback(
    async (quantity, price, setLoading) => {
      setLoading(true);
      const cost = ethers.utils.parseEther(price).mul(quantity);
      try {
        let transaction = await contract?.mint(quantity, { value: cost });
        let tx = await transaction.wait();
        console.log("minted my contract", typeof tx.confirmations);
        toggleMintModal();
        setLoading(false);
        getPrice();
        getTotalSupply()
        notify("Minting Succesful", "success");
      } catch (error: any) {
        console.log("error", error);
        if (error.code === "UNSUPPORTED_OPERATION") {
          console.log("Please connect wallet");
          notify("Please connect wallet", "error");
          setLoading(false);
        } else if (error.code === "INSUFFICIENT_FUNDS") {
          console.log("Insufficient funds in wallet");
          notify("Insufficient funds in wallet", "error");
          setLoading(false);
        } else {
          setLoading(false);
          notify(
            error?.data?.message || "Something went wrong. Please try again",
            "error"
          );
          console.log(
            error.code ||
            error?.data?.message ||
            "Something went wrong. Please try again"
          );
        }
      }
    },
    [contract, dispatch]
  );
}
