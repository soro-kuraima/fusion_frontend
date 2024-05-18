const OnBoardLayout = ({ children }) => {
  return (
    <main className="bg-gray-200 flex-col-reverse overflow-auto flex xl:flex-row gap-10 w-screen h-screen p-3 md:p-10">
      {children}
    </main>
  );
};

export default OnBoardLayout;
