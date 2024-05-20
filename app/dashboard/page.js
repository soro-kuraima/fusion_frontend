import QR from "@/components/ui/QR";
import Gas from "@/components/ui/Gas";
import Profile from "@/components/ui/Profile";

import CrossChain from "@/components/layout/dashboard/CrossChain";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";

export default function Register() {
  return (
    <>
      <section className="mt-10 space-y-4 max-w-xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium ">Fusion</h1>

          <div className="flex space-x-4">
            <Gas />
            <QR />
            <Profile />
          </div>
        </div>

        <DashboardMain />
        <CrossChain />
      </section>
    </>
  );
}
