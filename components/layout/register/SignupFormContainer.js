import React from "react";
import SignupForm from "./SignupForm";

const SignupFormContainer = () => {
  return (
    <section
      className="flex-1 rounded-2xl px-12 py-10 flex flex-col justify-evenly items-center h-full gap-10"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: "cover",
      }}
    >
      <div>
        <h1 className="text-xl font-medium text-white w-fit mx-auto uppercase">
          Fusion
        </h1>
        <p className="text-white text-sm w-fit mx-auto text-center">
          zk-based multichain smart contract wallet
        </p>
      </div>

      <SignupForm />
    </section>
  );
};

export default SignupFormContainer;
