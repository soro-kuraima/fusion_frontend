import LoginInfo from "@/components/layout/login/LoginInfo";
import LoginFormContainer from "@/components/layout/login/LoginFormContainer";
import { Suspense } from "react";

export default function Login() {
  return (
    <Suspense>
      <LoginInfo />

      <LoginFormContainer />
    </Suspense>
  );
}
