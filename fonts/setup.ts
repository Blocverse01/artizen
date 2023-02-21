import { NextFontWithVariable } from "@next/font";
import localFont from "@next/font/local";

export const SFPro: NextFontWithVariable = localFont({
  src: [
    {
      path: "./sfpro/SF-Pro-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./sfpro/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./sfpro/SF-Pro-Display-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});
