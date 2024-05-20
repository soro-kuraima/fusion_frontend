import { ArrowLeftRight, History, MoveDown } from "lucide-react";

import Balance from "@/components/layout/dashboard/Balance";
import RoundedGrayButton from "@/components/ui/RoundedGrayButton";

const DashboardMain = () => {
  return (
    <div className="space-y-1">
      <Balance />

      <div className="bg-white py-6 p-16 md:px-20 rounded-b-xl flex justify-between">
        <RoundedGrayButton label="Receive">
          <MoveDown size={20} />
        </RoundedGrayButton>

        <RoundedGrayButton label="Transfer">
          <ArrowLeftRight size={20} />
        </RoundedGrayButton>

        <RoundedGrayButton label="History">
          <History size={20} />
        </RoundedGrayButton>
      </div>
    </div>
  );
};

export default DashboardMain;
