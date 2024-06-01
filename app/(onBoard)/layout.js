import BackgroundAnimation from "@/components/ui/BackgroundAnimation";

const OnBoardLayout = ({ children }) => {
  return (
    <>
      <BackgroundAnimation />

      <main className="flex-col-reverse overflow-auto flex xl:flex-row gap-10 w-screen h-screen p-3 md:p-10 relative z-20">
        {children}
      </main>
    </>
  );
};

export default OnBoardLayout;
