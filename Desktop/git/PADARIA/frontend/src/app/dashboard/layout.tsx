import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar"; // Crie este componente
import { Toaster } from "@/components/ui/toaster"; // Opcional para notificações
import "@/app/globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header fixo no topo */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - opcional */}
        <Sidebar />

        {/* Conteúdo principal com scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Rodapé - opcional */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Design Spacee. Todos os direitos reservados.
        </div>
      </footer>

      {/* Componente para notificações */}
      <Toaster />
    </div>
  );
}