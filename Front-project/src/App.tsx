import { Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Layout from "./layouts/layout";
import UsersTable from "./pages/usuarios";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Envolver todas las rutas dentro de Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="usuarios" element={<UsersTable />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;

