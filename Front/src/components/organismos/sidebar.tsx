import { useState } from "react";
import { HomeIcon, UserIcon, Cog6ToothIcon, CubeIcon, EnvelopeIcon, ClipboardDocumentCheckIcon, DocumentChartBarIcon, ChartBarIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import useLogin from "@/hooks/Usuarios/useLogin";

export const menuItems = [
  { name: "Inicio", icon: HomeIcon, href: "Home" },

  { name: "Admin", icon: UserIcon, href: "/admin" },

  { name: "Bodega", icon: CubeIcon, href: "/bodega" },

  { name: "Solicitudes", icon: EnvelopeIcon, href: "/solicitudes"},

  { name: "Reportes", icon: DocumentChartBarIcon, href: "/reportes"},

  { name: "Estadisticas", icon: ChartBarIcon, href: "/estadisticas" },

  { name: "Verificaciones", icon: ClipboardDocumentCheckIcon, href:"/verificaciones" },

  { name: "Configuración", icon: Cog6ToothIcon, href: "/configuraciones" },
];

export default function Sidebar() {
  const [active, setActive] = useState(menuItems[0].name);
  const {nombre} = useAuth();
  const {logout} = useLogin()

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold">Mi App</h1>
      {nombre && <p className="text-center my-4 flex items-center justify-center gap-2">{nombre} <ArrowRightStartOnRectangleIcon onClick={logout} height={24} className="hover:text-red-500 cursor-pointer transition"/> </p>}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${active === item.name ? "bg-gray-700 text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <item.icon className="w-6 h-6" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>

  );
}



