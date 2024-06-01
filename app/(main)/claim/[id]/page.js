import ClaimHeader from "@/components/layout/claim/ClaimHeader";
import ClaimInfo from "@/components/layout/claim/ClaimInfo";
import { Suspense } from "react";

export default function claim() {
  return (
    <Suspense>
      <ClaimHeader />
      <ClaimInfo />
    </Suspense>
  );
}
