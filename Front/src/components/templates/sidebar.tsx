import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import iconsConfig from "@/config/iconsConfig";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import useLogin from "@/hooks/Usuarios/useLogin";

export default function Sidebar() {
  const { permissions } = useAuth();

  const mappingItems = [
    {
      id: 0,
      nombre: "Home",
      icono: "HomeIcon",
      href: "/",
    },
    ...permissions,
  ];

  const [openItems, setOpenItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const { logout } = useLogin();

  return (
    <aside
      className={`h-screen ${
        collapsed ? "w-15" : "w-64"
      } bg-blue-950 text-white dark:bg-zinc-800 dark:text-white flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-xl font-bold flex items-center">
            <img
              className="w-12"
              src="/src/assets/Formatrack.png"
              alt="Formatrack"
            />
            Formatrack
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-blue-950 text-white dark:bg-zinc-800 dark:text-white"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>
      <nav className="space-y-2 px-1 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
        {mappingItems.map((item) => {
          const Icono = iconsConfig[item.icono] ?? BookOpenIcon;
          return (
            <div key={item.nombre}>
              <Link
                to={item.href}
                onClick={() => toggleItem(item.nombre)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                  location.pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-600 text-black-300"
                }`}
              >
                <Icono className="w-6 h-6" />
                {!collapsed && <span>{item.nombre}</span>}
              </Link>
              {item.rutas && openItems.includes(item.nombre) && (
                <div className="pl-6">
                  {item.rutas.map((subItem: any) => {
                    if (!subItem.listed) return;
                    const SubIcono = iconsConfig[subItem.icono] ?? BookOpenIcon;
                    return (
                      <Link
                        key={subItem.nombre}
                        to={subItem.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                          location.pathname === subItem.href
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-600 text-black-300"
                        }`}
                      >
                        <SubIcono className="w-6 h-6" />
                        {!collapsed && <span>{subItem.nombre}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="flex">
        <ArrowRightStartOnRectangleIcon
          onClick={logout}
          height={26}
          className={`hover:text-red-500 cursor-pointer transition mb-4 ${collapsed ? "mx-auto" : "ms-auto me-6"}`}
        />
      </div>
    </aside>
  );
}
