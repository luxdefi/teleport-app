import { useEffect, useState } from "react";
import Link from "next/link";

import Logo from "/public/images/logo.svg";
import Discord from "Icons/Discord";
import Instagram from "Icons/Instagram";
import Twitter from "Icons/Twitter";
import NavLink from "components/NavLink";
import HamburgerMenu from "Icons/HamburgerMenu";
import { MobileMenu } from "./MobileMenuPanel";
import Web3Status from "components/Web3Status";
import { YouTube } from "@mui/icons-material";
import WalletSidebar from "modals/WalletSidebar";
import { useRouter } from "next/router";

const Header = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const menuToggler = () => setOpenMenu(!openMenu);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const sidebarToggler = () => setOpenSidebar(!openSidebar);

  const [changeHeaderBg, setChangeHeaderBg] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [scroll]);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setChangeHeaderBg(true);
    } else {
      setChangeHeaderBg(false);
    }
  };

  return (
    <section
      id="home"
      className="fixed flex items-center w-full border-white border-opacity-50 border-solid z-100 lg:border-b"
      style={{
        backgroundColor: changeHeaderBg && "#000",
      }}
    >
      <header className="flex items-center w-full px-5 lg:pl-10 xl:pl-14">
        <div className="flex items-center justify-between flex-1 border-white border-opacity-50 border-solid py-7 lg:py-4">
          <div className="flex-1">
            <Link href="/">
              <img
                src={Logo.src}
                alt="Logo"
                className="w-11 lg:w-auto hover:cursor-pointer"
              />
            </Link>
          </div>
          <div className="flex-1">
            <nav className="hidden lg:block">
              <ul className="flex items-center justify-center gap-x-10">
                <NavSecLink href="#about" label="About" />
                <NavSecLink href="#roadmap" label="Roadmap" />
                <NavSecLink href="#community" label="Community" />
                <NavSecLink href="#team" label="Team" />
                <NavSecLink href="#faq" label="FAQs" />
              </ul>
            </nav>
          </div>

          <div className="flex justify-end flex-1">
            <div className="items-center hidden pr-10 lg:flex gap-x-4 lg:border-r">
              <Socials />
            </div>
            <Web3Status
              title="Connect Wallet"
              className="px-4 py-2 font-bold text-white bg-black rounded-full"
            />
          </div>
        </div>

        <button onClick={menuToggler} className="outline-none lg:hidden">
          <HamburgerMenu />
        </button>
      </header>

      {openMenu && (
        <MobileMenu {...{ menuToggler, openMenu, sidebarToggler }} />
      )}
    </section>
  );
};

export default Header;

interface NavSecLinkProps {
  label: string;
  href: string;
}

const NavSecLink = ({ label, href }: NavSecLinkProps) => {
  const router = useRouter();
  return (
    // <NavLink href={href}>
    //   <h1 className="text-sm font-normal text-white hover:cursor-pointer font-object_sans">
    //     {label}
    //   </h1>
    // </NavLink>

    <a
      href={href}
      onClick={() => router.push("/")}
      className="text-sm font-normal text-white hover:cursor-pointer font-object_sans"
    >
      {label}
    </a>
  );
};

const Socials = (props: any) => {
  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() =>
          window.open("https://www.instagram.com/artmobpod/", "_blank")
        }
      >
        <Instagram />
      </div>
      <div
        className="cursor-pointer"
        onClick={() =>
          window.open(
            "https://twitter.com/artmobpod/status/1515694975387906058?s=21&t=CAncr5Daf9auxFiSNL-1Wg",
            "_blank"
          )
        }
      >
        <Twitter />
      </div>

      <div
        className="cursor-pointer"
        onClick={() =>
          window.open(
            "https://youtube.com/channel/UCXz8DMohbv6agrekAYMlwVQ",
            "_blank"
          )
        }
      >
        <YouTube style={{ color: "white" }} />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => window.open("https://discord.gg/pcw8ujkF", "_blank")}
      >
        <Discord />
      </div>
    </>
  );
};
