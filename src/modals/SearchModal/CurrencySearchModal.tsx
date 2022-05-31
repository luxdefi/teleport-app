import React, { useCallback, useEffect, useState } from "react";
import CurrencyModalView from "./CurrencyModalView";
import { CurrencySearch } from "./CurrencySearch";
import Modal from "components/Modal";
import { Token, TokenList } from "state/types";
import useLast from "hooks/useLast";
import usePrevious from "hooks/usePrevious";

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Token | null;
  onCurrencySelect: (currency: Token) => void;
  otherSelectedCurrency?: Token | null;
  showCommonBases?: boolean;
  currencyList?: string[];
  includeNativeCurrency?: boolean;
  allowManageTokenList?: boolean;
}

function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  currencyList,
  showCommonBases = false,
  includeNativeCurrency = true,
  allowManageTokenList = true,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(
    CurrencyModalView.manage
  );
  const lastOpen = useLast(isOpen);

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(CurrencyModalView.search);
    }
  }, [isOpen, lastOpen]);

  const handleCurrencySelect = useCallback(
    (currency: Token) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  // for token import view
  const prevView = usePrevious(modalView);

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>();

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>();
  const [listURL, setListUrl] = useState<string | undefined>();

  // change min height if not searching
  const minHeight =
    modalView === CurrencyModalView.importToken ||
    modalView === CurrencyModalView.importList
      ? 40
      : 75;
  return (
    <Modal
      maxWidth={800}
      isOpen={isOpen}
      onDismiss={onDismiss}
      minHeight={minHeight}
      maxHeight={85}
      noPadding
    >
      {modalView === CurrencyModalView.search ? (
        <CurrencySearch
          isOpen={isOpen}
          onDismiss={onDismiss}
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
          showImportView={() => setModalView(CurrencyModalView.importToken)}
          setImportToken={setImportToken}
          showManageView={() => setModalView(CurrencyModalView.manage)}
          currencyList={currencyList}
          includeNativeCurrency={includeNativeCurrency}
          allowManageTokenList={allowManageTokenList}
        />
      ) : (
        ""
      )}
    </Modal>
  );
}

CurrencySearchModal.whyDidYouRender = true;

export default CurrencySearchModal;
