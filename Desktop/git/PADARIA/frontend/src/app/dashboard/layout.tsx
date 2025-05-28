import Header from "@/components/header";
import "@/app/globals.css";


export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <header>
        
         
        <main>{children}</main>
       
    </header>
  );
}
