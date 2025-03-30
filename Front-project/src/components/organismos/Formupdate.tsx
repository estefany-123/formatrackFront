import React, { useState, useEffect } from "react";
import getUserById from "@/hooks/Usuarios/getUsuario";
import { User } from "@/pages/usuarios";
import { Form } from "@heroui/form"
import Inpu from "../molecules/input";
import UpdateData from "@/hooks/Usuarios/Update";



type Props = {
    users: User[] | undefined;
    userId: number;
    id: string
    onclose: () => void;
    
}

const FormuUpdate = ({ users, userId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<User>>({
        id_usuario: 0,
        documento: 0,
        nombre: "",
        apellido: "",
        edad: 0,
        telefono: "",
        correo: "",
        estado: false,
        cargo: "",
        password: "",
        fk_rol: 0,
    });

    const { updateData } = UpdateData<User>({
        url: "http://localhost:3000/usuarios",
        idKey: "id_usuario",
    });

    useEffect(() => {
        const foundUser = getUserById(users, userId);

        if (foundUser) {
            setFormData(foundUser);
        }

    }, [users, userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async () => {// lo mismo del e
       //y el e.preventdefault

        if (!formData.id_usuario) return;

        try {
            await updateData(formData.id_usuario, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el usuario", error);
        }
    }

    if (!formData.id_usuario) {
        return <p className="text-center text-gray-500">Usuario no encontrado</p>;
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