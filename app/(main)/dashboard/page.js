import CrossChain from "@/components/layout/dashboard/CrossChain";
import DashboardMain from "@/components/layout/dashboard/DashboardMain";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <Suspense>
      <DashboardMain />
      <CrossChain />
    </Suspense>
  );
}
