import { ArrowLeftRight, History, MoveDown } from "lucide-react";

import Balance from "@/components/layout/dashboard/Balance";
import RoundedGrayButton from "@/components/ui/RoundedGrayButton";

const DashboardMain = () => {
  return (
    <div className="space-y-1">
      <Balance />

      <div className="bg-white py-8 p-16 md:px-20 rounded-b-xl flex justify-between md:justify-evenly">
        <RoundedGrayButton label="Receive">
          <MoveDown size={24} />
        </RoundedGrayButton>

        <RoundedGrayButton label="Transfer">
          <ArrowLeftRight size={24} />
        </RoundedGrayButton>

        <RoundedGrayButton label="History">
          <History size={24} />
        </RoundedGrayButton>
      </div>
    </div>
  );
};

export default DashboardMain;
