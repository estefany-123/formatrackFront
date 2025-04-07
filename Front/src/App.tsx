import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import UsersTable from "./pages/Admin/admin";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/admin";
import { Bodega } from "./components/organismos/taps/Bodega";
import { Solicitudes } from "./pages/Solicitudes/Solicitudes";
import { Verificaciones } from "./pages/Verificaciones/Verificaciones";
import { Configuraciones } from "./components/organismos/taps/Configuraciones";
import { Reportes } from "./components/organismos/taps/Reportes";

function App() {

  return (
    <Routes>
      {/* Envolver todas las rutas dentro de Layout */}
      <Route path="/" element={<Layout />}>
        <Route path="Home" element={<Home />} />
        <Route path="admin" element={<Admin/>}/>
        <Route path="bodega" element={<Bodega/>}/>
        <Route path="solicitudes" element={<Solicitudes/>}/>
        <Route path="reportes" element={<Reportes/>}/>
        <Route path="verificaciones" element={<Verificaciones/>}/>
        <Route path="configuraciones" element={<Configuraciones/>}/>
        <Route path="usuarios" element={<UsersTable />} />
      </Route>
    </Routes>
  );
}

export default App;

