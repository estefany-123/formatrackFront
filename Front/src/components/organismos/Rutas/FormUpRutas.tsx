import React, { useState, useEffect } from "react";
import { Ruta } from "@/types/Ruta";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { useRuta } from "@/hooks/Rutas/useRuta";


type Props = {
    rutas: Ruta[] ;
    rutaId: number;
    id: string
    onclose: () => void;

}

const FormUpRutas = ({ rutas, rutaId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<Ruta>>({
        id_ruta: 0,
        nombre: "",
        descripcion: "",
        url_destino: "",
        estado: true,
        fk_modulo: 0
    });

    const { updateRuta, getRutaById} = useRuta()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundRuta = getRutaById(rutaId);

        if (foundRuta) {
            setFormData(foundRuta);
        }

    }, [rutas, rutaId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<Ruta>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_ruta) {
            return <p className="text-center text-gray-500">Ruta no encontrada</p>;
        }
        
        try {
            await updateRuta(formData.id_ruta, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar la ruta", error);
        }
    }




    return (
        <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit}>
            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre ?? ''} onChange={handleChange} />
            <Inpu label="Descripcion" placeholder="Descripcion" type="text" name="descripcion" value={formData.descripcion ?? ''} onChange={handleChange} />
            <Inpu label="Url destino" placeholder="Url destino" type="text" name="url_destino" value={formData.url_destino ?? ''} onChange={handleChange} />

            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                Guardar Cambios
            </button>
        </Form>
    )

}


export default FormUpRutas;