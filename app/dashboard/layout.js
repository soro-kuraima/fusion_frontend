import ChainSelector from "@/components/ui/ChainSelector";

const DashboardLayout = ({ children }) => {
  return (
    <main className="bg-gray-200 w-screen h-screen p-3 md:p-10 text-center">
      <ChainSelector />
      {children}
    </main>
  );
};

export default DashboardLayout;
