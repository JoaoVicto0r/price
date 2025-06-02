import "@/app/globals.css";
import Registerform from "@/components/registerform";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Registerform />
      {children}
    </>
  );
}
