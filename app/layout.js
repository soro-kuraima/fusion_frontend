import { Outfit } from "next/font/google";

import { Toaster } from "sonner";

import { store } from "@/redux/store";
import ReduxProvider from "@/provider/ReduxProvider";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "De-fuse",
  description: "De-fuse: An account abstraction zk-proof based wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <ReduxProvider store={store}>
          <Toaster />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
