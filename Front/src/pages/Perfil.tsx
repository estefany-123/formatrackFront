import Card1 from '@/components/molecules/Card';
import { usePerfil } from '@/hooks/Usuarios/usePerfil';
import { Avatar } from '@heroui/react';
import {patchFotoPerfil} from '../axios/Usuarios/patchFotoPerfil'
import { PencilIcon } from '@heroicons/react/24/outline';

function Perfil() {
  const { perfil, setPerfil, isLoading, error } = usePerfil();

  if (isLoading) return <div>Cargando...</div>;
   if (error) return <div>Error: {error.message}</div>;
   if (!perfil) return <div>No se encontraron datos del perfil</div>;

  const { nombre, apellido, documento, edad, telefono, correo, perfil: perfilImg, fkRol } = perfil;

  async function handleEditFoto(e: any){
    const file = e.target.files[0] ?? undefined;
    if(!file) return;
    const response = await patchFotoPerfil(file);
    console.log(response.updated);
    setPerfil(response.updated);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card1 className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
         <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              {fkRol.nombre}
          </h1>
          <div className='relative w-32 h-32 rounded-full mb-4 border-4 border-blue-200 group'>
            <Avatar
              src={`http://localhost:3000/img/perfiles/${perfilImg || 'defaultPerfil.png'}`}
              className="w-full h-full group-hover:opacity-70 transition duration-200"
            />
            <PencilIcon color='#fff' className='absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full h-full p-6 opacity-0 group-hover:opacity-100 transition duration-200' />
            <input onChange={handleEditFoto} className='absolute top-0 left-0 w-full h-full rounded-full opacity-0' type='file' accept='image/png, image/jpeg'/>
          </div>
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
