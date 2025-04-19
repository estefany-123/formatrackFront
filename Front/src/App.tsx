import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Home from "./pages/Home/Home";
import Admin from "./components/organismos/taps/admin";
import {Estadisticas} from "./components/organismos/taps/estadisticas";
import { Bodega } from "./components/organismos/taps/Bodega";
import { SolicitudTable } from "./pages/Solicitudes/Solicitudes";
import { VerificacionTable } from "./pages/Verificaciones/Verificaciones";
import { Configuraciones } from "./components/organismos/taps/Configuraciones";
import { Reportes } from "./components/organismos/taps/Reportes";
import { InventarioArea } from "./pages/Bodega/Inventario/Areas/InventarioArea";
import { Inventario } from "./pages/Bodega/Inventarios";
import { InventarioSitio } from "./pages/Bodega/Inventario/Sitios/InventarioSitio";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="admin" element={<Admin />} />
        <Route path="bodega" element={<Bodega />} />
        <Route path="/bodega/inventario/areas" element={<Inventario />} />
        <Route path="/bodega/inventario/areas/:id" element={<InventarioArea />}/>
        <Route path="/bodega/inventario/areas/:id/sitios/:sitioId" element={<InventarioSitio />}/>
        <Route path="solicitudes" element={<SolicitudTable />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="verificaciones" element={<VerificacionTable />} />
        <Route path="configuraciones" element={<Configuraciones />} />
        <Route path="estadisticas" element={<Estadisticas />} />
      </Route>
    </Routes>
  );
}

export default App;
