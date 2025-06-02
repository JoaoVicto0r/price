"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/receitas", label: "Receitas" },
    { href: "/insumos", label: "Insumos" },
    { href: "/financeiro", label: "Financeiro" },
    { href: "/suporte", label: "Suporte" },
  ];

  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-lg ${
                  pathname.startsWith(item.href)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}