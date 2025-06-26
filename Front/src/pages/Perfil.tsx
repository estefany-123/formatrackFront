import Card1 from '@/components/molecules/Card';
import { useRol } from '@/hooks/Roles/useRol';
import { usePefil } from '@/hooks/Usuarios/usePerfil';
import { Avatar } from '@heroui/react';

function Perfil() {
  const { perfil, isLoading, error } = usePefil();
  const { roles, isLoading: loadinRol, isError, error: errorRol, getRolById } = useRol();

  if (isLoading || loadinRol) return <div>Cargando...</div>;
   if (error) return <div>Error: {error.message}</div>;
   if (errorRol) return <div>Error: {errorRol.message}</div>;
   if (!perfil) return <div>No se encontraron datos del perfil</div>;


  const rol = getRolById(perfil.fkRol);
  if (!rol) {
    return <div className="text-center text-gray-500">No se encontró el rol para fkRol: {perfil.fkRol}</div>;
  }

  const { nombre, apellido, documento, edad, telefono, correo, perfil: perfilImg } = perfil;

  console.log("Perfil:", { nombre, apellido, documento, edad, telefono, correo, perfilImg, rol: rol.nombre });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card1 className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
         <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              {rol.nombre}
          </h1>
          <Avatar
            src={`http://localhost:3000/img/perfiles/${perfil.perfil || 'defaultPerfil.png'}`}
            className="w-32 h-32 rounded-full mb-4 border-4 border-blue-200"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {nombre} {apellido}
          </h1>
          <div className="w-full space-y-3 text-gray-600">
            <div className="flex justify-between">
              <span className="font-semibold">Documento:</span>
              <span>{documento}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Edad:</span>
              <span>{edad || 'No especificada'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Teléfono:</span>
              <span>{telefono || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Correo:</span>
              <span>{correo}</span>
            </div>
          </div>
        </div>
      </Card1>
    </div>
  );
}

export default Perfil;
