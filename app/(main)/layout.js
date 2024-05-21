import ChainSelector from "@/components/ui/ChainSelector";
import WalletProvider from "@/provider/WalletProvider";

const mainLayout = ({ children }) => {
  return (
    <WalletProvider>
      <main className="bg-gray-200 relative flex min-h-screen flex-col items-center justify-center px-2 pt-5">
        <ChainSelector />
        {children}
      </main>
    </WalletProvider>
  );
};

export default mainLayout;
