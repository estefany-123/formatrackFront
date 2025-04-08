import { Route, Routes } from "react-router-dom"
import Layout from "./layouts/layout"
import UsersTable from "./pages/Admin/admin"
import AreaTable from "./pages/Admin/admin"
import FcihasTable from "./pages/Admin/admin"
import ProgramasTable from "./pages/Admin/admin"
import RolModuloTable from "./pages/Admin/admin"
import SedeTable from "./pages/Admin/admin"
import SitiosTable from "./pages/Admin/admin"
import Home from "./pages/Home/Home"
import Admin from "./pages/Admin/admin"
import DashboardEstadisticas from "./pages/Admin/DashboardEstadisticas" // 👈 NUEVO

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="usuarios" element={<UsersTable />} />
        <Route path="areas" element={<AreaTable />} />
        <Route path="fichas" element={<FcihasTable />} />
        <Route path="programas" element={<ProgramasTable />} />
        <Route path="rol modulo" element={<RolModuloTable />} />
        <Route path="sedes" element={<SedeTable />} />
        <Route path="sitios" element={<SitiosTable />} />
        <Route path="admin" element={<Admin />} />
        <Route path="Home" element={<Home />} />
        <Route path="admin/DashboardEstadisticas" element={<DashboardEstadisticas />} /> {/* 👈 NUEVO */}
      </Route>
    </Routes>
  )
}

export default App
