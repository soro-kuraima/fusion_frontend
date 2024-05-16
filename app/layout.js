import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/ReduxProvider";
import { store } from "@/redux/store";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fusion",
  description: "Fusion: A smart contract zk-based wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider store={store}>
          <Toaster />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
