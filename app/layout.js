import { Outfit } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/ReduxProvider";
import { store } from "@/redux/store";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin-ext"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Fusion",
  description: "Fusion: A smart contract zk-based wallet",
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
