import SignUpInfo from "@/components/layout/register/SignupInfo";
import SignupFormContainer from "@/components/layout/register/SignupFormContainer";
import { Suspense } from "react";

export default function Register() {
  return (
    <Suspense>
      <SignUpInfo />

      <SignupFormContainer />
    </Suspense>
  );
}
