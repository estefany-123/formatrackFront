import Card1 from '@/components/molecules/Card';
import { useUsuario } from '@/hooks/Usuarios/useUsuario';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar } from '@heroui/react';
import { User } from '@/schemas/User'


function Perfil() {
      console.log("Componente Perfil cargado");
      const {nombre, perfil,idUsuario} = useAuth();
      const { getUserById,users} = useUsuario();
      if(!idUsuario || !users){
        return "no se encontro al usuario"
      }
      console.log("esto es el iduser",idUsuario)

      const foundUser =  getUserById(idUsuario,users);
      console.log("esto es founduser",foundUser)
  return (
    <div className='w-1/2 flex items-center absolute bottom-44 translate-x-3/4'>
        <Card1 className=''>
            <h1 className='text-4xl text-center mb-4'>Perfil</h1>
            <Avatar src={`http://localhost:3000/perfiles/${perfil ?? 'defaultPerfil.png'}`} className="w-60 h-60 "/>
            <h1 className='font-mono text-2xl text-center'> {nombre} </h1>
            <p>{foundUser?.correo}</p>
            
        </Card1>
    </div>
  )
}

export default Perfil