import Image from "next/image";
import logo from "@/images/logo.svg";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="py-8 px-5 lg:px-16 flex flex-col lg:flex-row justify-between space-y-10 lg:space-y-0 items-center">
      <ul className="flex justify-between">
        <li>
          <Link href={"/"}>
            <Image
              src={logo.src}
              alt="logo"
              className="object-scale-down object-left lg:object-contain"
              width="138"
              height="56"
            />
          </Link>
        </li>
        <li className="lg:hidden ml-6">
          <ConnectButton />
        </li>
      </ul>

      <nav>
        <ul className="flex text-white items-center">
          <li className="mr-5 lg:mr-8">
            <Link href={"/explore"}>Explore</Link>
          </li>
          <li className="mr-5 hidden lg:inline-block lg:mr-8">
            <ConnectButton />
          </li>
          <li className="lg:pl-8 lg:border-l shrink-0 border-white">
            <Link
              href="/upload"
              className="py-3 px-4 text-sm lg:text-base lg:px-7 rounded-full font-semibold text-[#F8F6F6] bg-app-alt-dark"
            >
              Become a Creator
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
