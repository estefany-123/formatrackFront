import { Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import UsersTable from "./pages/Admin/admin";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/admin";

function App() {

  return (
    <Routes>
      {/* Envolver todas las rutas dentro de Layout */}
      <Route path="/" element={<Layout />}>
        <Route path="usuarios" element={<UsersTable />} />
        <Route path="admin" element={<Admin/>}/>
        <Route path="Home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;

