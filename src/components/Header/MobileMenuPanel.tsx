import Link from "next/link";
import { useEffect } from "react";

import Logo from "/public/images/logo.svg";
import Button from "../Button";
import CloseIcon from "Icons/CloseIcon";
import Web3Status from "components/Web3Status";
import { useRouter } from "next/router";

interface MenuProps {
  openMenu?: boolean;
  menuToggler?: () => void;
  sidebarToggler?: () => void;
}

export const MobileMenu = ({
  openMenu,
  menuToggler,
  sidebarToggler,
}: MenuProps) => {
  useEffect(() => {
    openMenu && (document.body.style.overflow = "hidden");

    return () => {
      document.body.style.overflowY = "unset";
    };
  }, [openMenu]);

  return (
    <div className="fixed top-0 left-0 w-full h-screen px-5 overflow-y-auto bg-black py-7 z-999 no-scrollbar lg:hidden">
      <div className="relative w-full h-full">
        <header className="flex items-center justify-between">
          <Link href="/">
            <img src={Logo.src} alt="Logo" className="w-11 lg:w-auto" />
          </Link>

          <button onClick={menuToggler}>
            <CloseIcon />
          </button>
        </header>

        <div className="flex flex-col items-center justify-between pb-12 gap-y-12 mt-14">
          <MobileNavLink title="HOME" onClick={menuToggler} />
          <MobileNavLink href="#about" title="ABOUT" onClick={menuToggler} />
          <MobileNavLink
            href="#roadmap"
            title="ROADMAP"
            onClick={menuToggler}
          />
          <MobileNavLink
            href="#community"
            title="COMMUNITY"
            onClick={menuToggler}
          />
          <MobileNavLink href="#team" title="TEAM" onClick={menuToggler} />
          <MobileNavLink href="#faq" title="FAQ" onClick={menuToggler} />

          {/* <Button
            // onClick={() => {
            //   sidebarToggler();
            //   menuToggler();
            // }}
            className="px-10 h-14"
          >
            <Web3Status
              title="Connect Wallet"
              className="px-4 py-2 font-bold text-white bg-black rounded-full"
            />
          </Button> */}
        </div>
      </div>
    </div>
  );
};

interface MobileNavLinkProps {
  title?: string;
  href?: string;
  onClick?: () => void;
}

const MobileNavLink = ({ title, href, onClick }: MobileNavLinkProps) => {
  const router = useRouter();

  return (
    // <Link href={href ? href : "/"}>
    //   <li
    //     onClick={onClick}
    //     className="list-none group"
    //   >
    //     <h1
    //       className={`font-filson text-base md:text-xl md:uppercase font-semibold tracking-[0.2px] uppercase text-white`}
    //     >
    //       {title}
    //     </h1>
    //   </li>
    // </Link>

    <a
      href={href && href}
      onClick={() => {
        router.push("/");
        onClick();
      }}
      className="font-filson text-base md:text-xl md:uppercase font-semibold tracking-[0.2px] uppercase text-white"
    >
      {title}
    </a>
  );
};
