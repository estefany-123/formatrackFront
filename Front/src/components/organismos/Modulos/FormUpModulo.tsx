import React, { useState, useEffect } from "react";
import { Modulo } from "@/types/Modulo";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { useModulo } from "@/hooks/Modulos/useModulo";



type Props = {
    modulos: Modulo[] ;
    moduloId: number;
    id: string
    onclose: () => void;

}

const FormUpCentro = ({ modulos, moduloId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Modulo>>({
        id_modulo: 0,
        nombre: "",
        descripcion : "",
        estado: true
    });

    const {updateModulo,getModuloById} = useModulo()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundModulo = getModuloById(moduloId);

        if (foundModulo) {
            setFormData(foundModulo);
        }

    }, [modulos, moduloId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Modulo>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_modulo) {
            return <p className="text-center text-gray-500">Modulo no encontrado</p>;
        }
        
        try {
            await updateModulo(formData.id_modulo, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el modulo", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />
            <Inpu label="Descripcion" placeholder="Descripcion" type="text" name="descripcion" value={formData.descripcion ?? ''} onChange={handleChange} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpCentro;