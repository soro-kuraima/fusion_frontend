const ProfileLayout = ({ children }) => {
  return (
    <main className="flex flex-col grow overflow-hidden w-full items-center justify-center my-10">
      {children}
    </main>
  );
};

export default ProfileLayout;
