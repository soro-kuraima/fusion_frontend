import { ArrowLeftRight, Bolt, History } from "lucide-react";

import Balance from "@/components/layout/dashboard/Balance";
import RoundedGrayButton from "@/components/ui/RoundedGrayButton";

const DashboardMain = () => {
  return (
    <div className="space-y-1">
      <Balance />

      <div className="bg-white py-6 p-16 md:px-20 rounded-b-xl flex shadow-lg justify-between">
        <RoundedGrayButton label="Transfer" href="/transfer">
          <ArrowLeftRight size={20} />
        </RoundedGrayButton>

        <RoundedGrayButton label="History" href="/transactions">
          <History size={20} />
        </RoundedGrayButton>

        <RoundedGrayButton label="Settings" href="/settings">
          <Bolt size={20} />
        </RoundedGrayButton>
      </div>
    </div>
  );
};

export default DashboardMain;
