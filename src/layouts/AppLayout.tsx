import { ReactNode, ReactElement } from "react";

// components
import Header from "components/Header";
import Footer from "components/Footer";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import { ChainId } from "constants/chainIds";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { chainId } = useActiveWeb3React();
  return (
    <div className="relative bg-black AppLayout">
      <Header />
      <div
        className="AppLayout__body bg-[url('/icons/dots.svg')]"
        style={{
          // minHeight: "70vh",
          // cursor: [ChainId.MAINNET, ChainId.RINKEBY].includes(chainId)
          //   ? "default"
          //   : "no-drop",
          zIndex: [ChainId.MAINNET, ChainId.RINKEBY].includes(chainId)
            ? 1
            : -500,
        }}
      >
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AppLayout;

export const getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};
