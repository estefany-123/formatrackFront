import React, { useState, useEffect } from "react";
import { UserFicha } from "@/types/userFicha";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import {useUsuarioFcihas} from "@/hooks/usersFichas/useUserFichas";



type Props = {
    users: UserFicha[] ;
    userId: number;
    id: string
    onclose: () => void;

}

const FormuUpdate = ({ users, userId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<UserFicha>>({
        id_usuario_ficha: 0,
        fk_usuario: 0,
        fk_ficha: 0,
    });

    const {updateUser, getUserById} = useUsuarioFcihas()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundUser = getUserById(userId);

        if (foundUser) {
            setFormData(foundUser);
        }

    }, [users, userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<UserFicha>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_usuario_ficha) {
            return <p className="text-center text-gray-500">Usuario ficha  no encontrado</p>;
        }
        
        try {
            await updateUser(formData.id_usuario_ficha, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el usuario usuarip ficha ", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />
            <Inpu label="Apellido" placeholder="Apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
            <Inpu label="Edad" placeholder="Edad" type="number" name="edad" value={String(formData.edad) ?? ''} onChange={handleChange} />
            <Inpu label="Telefono" placeholder="Telefono" type="number" name="telefono" value={String(formData.telefono) ?? ''} onChange={handleChange} />
            <Inpu label="Correo" placeholder="Correo" type="email" name="correo" value={formData.correo ?? ''} />
            <Inpu label="Cargo" placeholder="Cargo" type="text" name="cargo" value={formData.cargo ?? ''} onChange={handleChange} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormuUpdate;