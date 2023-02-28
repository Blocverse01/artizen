import Image from "next/image";
import logo from "@/images/logo.svg";
import Link from "next/link";
//import { ConnectKitButton } from "connectkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="py-8 px-16 flex justify-between items-center">
      <Link href={"/"}>
        <Image src={logo.src} alt="logo" width="138" height="56" />
      </Link>
      <nav>
        <ul className="flex text-white items-center">
          <li className="mr-8">
            <Link href={"/explore"}>Explore</Link>
          </li>
          <li className="mr-8">
            <ConnectButton />
          </li>
          <li className="pl-8 border-l border-white">
            <Link
              href="/upload"
              className="py-3 px-7 rounded-full font-semibold text-[#F8F6F6] bg-app-alt-dark"
            >
              Become a Creator
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
