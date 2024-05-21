import ProfileMain from "@/components/layout/profile/ProfileMain";
import Tokens from "@/components/layout/profile/Tokens";
import Gas from "@/components/ui/Gas";
import Menu from "@/components/ui/Menu";
import QR from "@/components/ui/QR";

export default function Profile() {
  return (
    <>
      <div className="flex flex-col max-w-[29rem] w-full gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium ">Fusion</h1>

          <div className="flex space-x-2">
            <Gas />
            <QR />
            <Menu />
          </div>
        </div>

        <ProfileMain />
        <Tokens />
      </div>
    </>
  );
}
