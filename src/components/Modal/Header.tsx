import { ArrowBackIos, Close } from "@mui/icons-material";
import React, { FC } from "react";
interface ModalHeaderProps {
  title?: string;
  className?: string;
  onClose?: () => void;
  onBack?: () => void;
  textBg?: boolean;
  titleClassName?: string;
}

const ModalHeader: FC<ModalHeaderProps> = ({
  title = undefined,
  onClose = undefined,
  className = "",
  onBack = undefined,
  textBg,
  titleClassName,
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {onBack && (
        <ArrowBackIos
          onClick={onBack}
          width={24}
          height={24}
          className="cursor-pointer "
        />
      )}
      {title && (
        <div
          className={`px-2 py-1 rounded ${
            textBg && "bg-primary bg-grey"
          } ${titleClassName}`}
        >
          <h3 className="font-bold">{title}</h3>
        </div>
      )}
      {/* <div className='flex items-center justify-center w-6 h-6 cursor-pointer text-primary hover:text-high-emphesis' onClick={onClose}>
        <XCircle width={24} height={24} />
      </div> */}
      <div
        className="flex items-center justify-center w-10 h-10 text-gray-500 rounded-full cursor-pointer primary bg-white"
        onClick={onClose}
      >
        <Close />
      </div>
    </div>
  );
};

export default ModalHeader;
