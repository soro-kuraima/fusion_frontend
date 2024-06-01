import DeployMain from "@/components/layout/deploy/DeployMain";
import { Suspense } from "react";

export default function Deploy() {
  return (
    <Suspense>
      <DeployMain />;
    </Suspense>
  );
}
