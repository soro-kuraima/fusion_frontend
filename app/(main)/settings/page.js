import SettingsMain from "@/components/layout/settings/SettingsMain";
import { Suspense } from "react";

export default function Settings() {
  return (
    <Suspense>
      <SettingsMain />;
    </Suspense>
  );
}
