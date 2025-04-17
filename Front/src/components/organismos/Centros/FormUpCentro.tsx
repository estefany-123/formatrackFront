import React, { useState, useEffect } from "react";
import { Centro } from "@/types/Centro";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { useCentro } from "@/hooks/Centros/useCentros";



type Props = {
    centros: Centro[] ;
    centroId: number;
    id: string
    onclose: () => void;

}

const FormUpCentro = ({ centros, centroId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Centro>>({
        id_centro: 0,
        nombre: "",
        estado: true,
        fk_municipio: 0,
    });

    const {updateCentro, getCentroById} = useCentro()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundCentro = getCentroById(centroId);

        if (foundCentro) {
            setFormData(foundCentro);
        }

    }, [centros, centroId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Centro>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_centro) {
            return <p className="text-center text-gray-500">Centro no encontrado</p>;
        }
        
        try {
            await updateCentro(formData.id_centro, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el centro", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpCentro;