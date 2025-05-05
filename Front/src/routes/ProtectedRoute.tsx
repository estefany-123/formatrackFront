import { useAuth } from "../providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { authenticated } = useAuth();

  if (authenticated === undefined) {
    return <div>Cargando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }else{
    return <Outlet />;
  }


};

export default ProtectedRoute;
