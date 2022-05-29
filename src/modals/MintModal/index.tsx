import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import Modal from "../../components/Modal/MintModal";
import { ApplicationModal } from "../../state/application/actions";
import {
  useMintModalToggle,
  useModalOpen,
} from "../../state/application/hooks";
import { useMint } from "state/nfts/hooks";
import Button from "components/Button";
import Pattern from "/public/images/mint-pattern.svg";
import { useAppSelector } from "state/hooks";

interface MintModalProps {}

const MintModal: React.FC<MintModalProps> = () => {
  const [quantity, setQuantity] = useState(1);
  const mintModal = useModalOpen(ApplicationModal.MINT);
  const toggleMintModal = useMintModalToggle();
  const mintNft = useMint();
  const [loading, setLoading] = useState(false);
  const totalNfts = 1111;
  const nftsPerMint = 20;
  const nftPrice = "0.09";
  const { totalNftSold }: any = useAppSelector((state) => state.nfts);
  return (
    <Modal
      backgroundColor="transparent"
      isOpen={mintModal}
      onDismiss={() => toggleMintModal()}
      maxWidth={400}
      noPadding={true}
    >
      <div className={`flex justify-center items-center`}>
        <div className="relative w-11/12 p-6 border border-white border-solid rounded-lg md:w-96 bg-dark2 border-opacity-20">
          <div className="relative z-50">
            <div className="flex">
              <div>
                {/* <h1 className="text-3xl font-semibold text-white font-work_sans">
                  <span className="text-purple">{totalNftSold}</span>/
                  {totalNfts}
                </h1>
                <h1 className="text-sm font-medium text-white text-opacity-50 font-work_sans">
                  Art Mobs Minted
                </h1> */}
              </div>
              <div className="flex justify-end w-full mb-8">
                <div
                  className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white rounded-full cursor-pointer primary"
                  onClick={toggleMintModal}
                >
                  <Close />
                </div>
              </div>
            </div>
            <div className="my-7">
              <Transaction
                quantity={quantity}
                setQuantity={(val) => setQuantity(val)}
                nftsPerMint={nftsPerMint}
              />
            </div>
            <div className="grid items-center grid-cols-2 gap-x-3">
              <MidCard
                title={`${nftPrice} X ${quantity} ETH`}
                subTitle="Excluding gas fee"
              />
              <MidCard
                title={`${(parseFloat(nftPrice) * quantity).toFixed(2)} ETH`}
                subTitle="Price"
              />
            </div>
            <Button
              loading={loading}
              onClick={() =>
                mintNft(quantity.toString(), nftPrice, (val) => {
                  setLoading(val);
                })
              }
              className="w-full mt-7"
            >
              <h1 className="text-lg font-medium text-white font-work_sans">
                Mint
              </h1>
            </Button>
          </div>

          {/* bg pattern */}
          <img
            src={Pattern.src}
            alt=""
            className="absolute top-0 left-0 z-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>
    </Modal>
  );
};

export default MintModal;

interface MidCardProps {
  title: string;
  subTitle: string;
}

const MidCard = ({ title, subTitle }: MidCardProps) => {
  return (
    <div className="px-4 py-3 bg-dark1">
      <h1 className="text-lg font-medium leading-none text-white font-work_sans">
        {title}
      </h1>
      <h1 className="font-work_sans font-normal text-[10px] text-white text-opacity-50">
        {subTitle}
      </h1>
    </div>
  );
};

const Transaction = ({ quantity, setQuantity, nftsPerMint }) => {
  const substract = () => {
    quantity > 1 && setQuantity((prev) => prev - 1);
  };

  const add = () => {
    if (quantity < nftsPerMint) setQuantity((prev) => prev + 1);
  };

  console.log("quantity", quantity);

  return (
    <>
      <div className="flex items-center justify-between w-full px-4 h-11 bg-dark3">
        <button
          onClick={substract}
          className="text-3xl text-white outline-none"
        >
          -
        </button>
        <h1 className="text-xl font-medium text-white font-work_sans">
          {quantity}
        </h1>
        <button onClick={add} className="text-2xl text-white outline-none">
          +
        </button>
      </div>
      <h1
        className="font-work_sans font-normal text-[12px] mt-1 text-white text-opacity-50"
        style={{
          color: quantity >= nftsPerMint && "orange",
        }}
      >
        Amount max {nftsPerMint} per transaction
      </h1>
    </>
  );
};
