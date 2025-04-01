import { useState } from "react";
import { HomeIcon, UserIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Inicio", icon: HomeIcon, href: "/Home" },

  { name: "Admin", icon: UserIcon, href: "/usuarios" },

  { name: "Configuración", icon: Cog6ToothIcon, href: "#" },
];

export default function Sidebar() {
  const [active, setActive] = useState(menuItems[0].name);

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">Mi App</h1>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${active === item.name ? "bg-gray-700 text-white" : "hover:bg-gray-800 text-gray-300"
              }`}
          >
            <item.icon className="w-6 h-6" />
            {item.name}
          </a>
        ))}
      </nav>
    </aside>

  );
}



