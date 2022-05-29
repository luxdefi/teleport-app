import logo from "/public/images/footer-logo.svg";
import Facebook from "Icons/Facebook";
import Instagram from "Icons/Instagram";
import Twitter from "Icons/Twitter";
import Discord from "Icons/Discord";
import Medium from "Icons/Medium";
import NavLink from "components/NavLink";
import { YouTube, Telegram } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-between px-5 py-16 md:px-10 lg:px-14 mt-14 md:py-28 md:flex-row xl:justify-start xl:gap-x-44 bg-footer">
      <div className="w-full md:w-[45%] flex flex-col lg:flex-row items-start gap-x-14">
        <img src={logo.src} alt="logo" className="w-20 xl:w-auto" />
        <div className="mt-6 lg:mt-0">
          <h1 className="text-base font-medium text-white font-work_sans text-opacity-70 md:text-opacity-100 xl:text-lg">
            Oxygen kills everything! But we can create digital duplicates to
            preserve the things that matter and lock their value in for life!
          </h1>
          <div className="items-center hidden pt-10 md:flex gap-x-5">
            <button
              onClick={() =>
                window.open("https://www.facebook.com/artmobmajor/", "_blank")
              }
              className="outline-none"
            >
              <Facebook size={23} />
            </button>
            <button
              onClick={() =>
                window.open("https://www.instagram.com/artmobpod/", "_blank")
              }
              className="outline-none"
            >
              <Instagram size={23} />
            </button>
            <button
              className="outline-none"
              onClick={() =>
                window.open(
                  "https://twitter.com/artmobpod/status/1515694975387906058?s=21&t=CAncr5Daf9auxFiSNL-1Wg",
                  "_blank"
                )
              }
            >
              <Twitter size={23} />
            </button>
            <button
              onClick={() =>
                window.open("https://discord.gg/pcw8ujkF", "_blank")
              }
              className="outline-none"
            >
              <Discord size={23} />
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://youtube.com/channel/UCXz8DMohbv6agrekAYMlwVQ",
                  "_blank"
                )
              }
              className="outline-none"
            >
              <YouTube style={{ color: "white" }} />
            </button>
            <button
              onClick={() => window.open("https://t.me./artmobpod", "_blank")}
              className="outline-none"
            >
              <Telegram style={{ color: "white" }} />
            </button>
          </div>
          <h1 className="hidden pt-16 text-base font-normal text-white md:block font-work_sans xl:text-lg">
            All rights reserved &copy; {new Date().getFullYear()}
          </h1>
        </div>
      </div>

      <div className="flex gap-20 mt-12 md:mt-0 lg:gap-x-36 xl:gap-x-44">
        <div>
          <h1 className="font-work_sans text-xl md:text-[1.37rem] font-bold text-grey1">
            About Us
          </h1>
          <ul className="mt-3 space-y-3 md:mt-5 md:space-y-2">
            <FooterLink label="About NFTs" href="#about" />
            <FooterLink label="Live Auctions" href="/" />
            <FooterLink label="NFT Blog" href="/" />
            <FooterLink label="Activity" href="/" />
          </ul>
        </div>

        <div>
          <h1 className="font-work_sans text-xl md:text-[1.37rem] font-bold text-grey1">
            Support
          </h1>
          <ul className="mt-3 space-y-3 md:mt-5 md:space-y-2">
            <FooterLink label="Help & Support" href="/" />
            <FooterLink label="Item Details" href="/" />
            <FooterLink label="Author Profile" href="/" />
            <FooterLink label="Collection" href="/" />
          </ul>
        </div>
      </div>

      <div className="mt-14 md:hidden">
        <div className="flex items-center gap-x-5">
          <button
            onClick={() =>
              window.open("https://www.facebook.com/artmobmajor/", "_blank")
            }
            className="outline-none"
          >
            <Facebook size={22} />
          </button>
          <button
            onClick={() =>
              window.open("https://www.instagram.com/artmobpod/", "_blank")
            }
            className="outline-none"
          >
            <Instagram size={22} />
          </button>
          <button
            onClick={() =>
              window.open(
                "https://twitter.com/artmobpod/status/1515694975387906058?s=21&t=CAncr5Daf9auxFiSNL-1Wg",
                "_blank"
              )
            }
            className="outline-none"
          >
            <Twitter size={22} />
          </button>
          <button
            onClick={() => window.open("https://discord.gg/pcw8ujkF", "_blank")}
            className="outline-none"
          >
            <Discord size={22} />
          </button>
          <button
            onClick={() => window.open("https://t.me./artmobpod", "_blank")}
            className="outline-none"
          >
            <Telegram style={{ color: "white" }} />
          </button>
        </div>
        <h1 className="pt-6 text-base font-normal text-white font-work_sans text-opacity-70 md:text-opacity-100">
          All rights reserved &copy; {new Date().getFullYear()}
        </h1>
      </div>
    </footer>
  );
};

export default Footer;

interface FooterLinksProps {
  label: string;
  href: string;
}

const FooterLink = ({ label, href }: FooterLinksProps) => {
  return (
    <NavLink href={href}>
      <h1 className="text-sm font-normal text-white font-work_sans text-opacity-70 md:text-opacity-100 md:text-lg">
        {label}
      </h1>
    </NavLink>
  );
};
