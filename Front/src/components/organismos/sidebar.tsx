import { useEffect, useState } from "react";
import { HomeIcon, UserIcon, CubeIcon, EnvelopeIcon, ClipboardDocumentCheckIcon, DocumentChartBarIcon, ChartBarIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const menuItems : Record<string,{name:string,icon:typeof HomeIcon,href:string}> = {
  "Inicio" : { name: "Inicio", icon: HomeIcon, href: "/" },
  "Admin" : { name: "Admin", icon: UserIcon, href: "/admin" },
  "Bodega" : { name: "Bodega", icon: CubeIcon, href: "/bodega" },
  "Solicitudes" :{ name: "Solicitudes", icon: EnvelopeIcon, href: "/solicitudes"},
  "Reportes" : { name: "Reportes", icon: DocumentChartBarIcon, href: "/reportes"},
  "Estadisticas" : { name: "Estadisticas", icon: ChartBarIcon, href: "/estadisticas" },
  "Verificaciones" : { name: "Verificaciones", icon: ClipboardDocumentCheckIcon, href:"/verificaciones" }
}
type modulo = {
  nombre : string
}

export default function Sidebar() {
  //Logica para obtener modulos

  const [modulos,setModulos] = useState<modulo[]>([])

  useEffect(()=>{
    const cookies = new Cookies();
    const token = cookies.get("token");
    const decodedToken : {modulos : modulo[]} = jwtDecode(token);
    setModulos(decodedToken.modulos);
  },[])


  const [openItems, setOpenItems] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <aside
      className={`h-screen ${
        collapsed ? "w-15" : "w-64"
      } bg-blue-950 text-white dark:bg-zinc-800 dark:text-white flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-xl font-bold flex items-center">
            <img className="w-12" src="/src/assets/Formatrack.png" alt="Formatrack" />
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
        {modulos && modulos.map((modulo : {nombre : string}) => {
          const item = menuItems[modulo.nombre];
          
          return(
          <div key={item.name}>
            <Link
              to={item.href}
              onClick={() => toggleItem(item.name)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                openItems.includes(item.name)
                  ? "bg-black-700 hover:bg-blue-600 " 
                  : "hover:bg-blue-600 text-black-300 text-black-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              {!collapsed && <span>{item.name}</span>}
              </Link>
          </div>
        )})}
      </nav>
    </aside>
  );
}



