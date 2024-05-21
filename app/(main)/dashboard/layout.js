import QRcodeModal from "@/components/modal/QRcodeModal";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <QRcodeModal />

      <main className="flex flex-col grow overflow-hidden w-full items-center justify-center my-10">
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
