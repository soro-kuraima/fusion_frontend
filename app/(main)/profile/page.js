import Tokens from "@/components/layout/profile/Tokens";
import ProfileMain from "@/components/layout/profile/ProfileMain";
import { Suspense } from "react";

export default function Profile() {
  return (
    <Suspense>
      <ProfileMain />
      <Tokens />
    </Suspense>
  );
}
