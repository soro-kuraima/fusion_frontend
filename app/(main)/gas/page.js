import GasMain from "@/components/layout/gas/GasMain";
import { Suspense } from "react";

export default function Gas() {
  return (
    <Suspense>
      <GasMain />
    </Suspense>
  );
}
