import React, { useState, useEffect } from "react";
import { TipoSitio } from "@/types/TipoSitio";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";


type Props = {
    tipos: TipoSitio[] ;
    tipoSitioId: number;
    id: string
    onclose: () => void;

}

const FormUpTipos = ({ tipos, tipoSitioId, id, onclose }: Props) => {
    const [formData, setFormData] = useState<Partial<TipoSitio>>({
        id_tipo: 0,
        nombre: "",
        estado: true
    });

    const {updateTipo, getTipoById} = useTipoSitio()

    useEffect(() => { // se ejecuta cuando algo se cambie en un usuario, obtiene el id y modifica el FormData
        const foundTipoSitio = getTipoById(tipoSitioId);

        if (foundTipoSitio) {
            setFormData(foundTipoSitio);
        }

    }, [tipos, tipoSitioId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { //se ejecuta cuando el usuario cambia algo en un campo
        const { name, value, type, checked } = e.target;

        setFormData((prev : Partial<TipoSitio>) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleSubmit = async (e : React.FormEvent) => {

        e.preventDefault();
        if (!formData.id_tipo) {
            return <p className="text-center text-gray-500">Tipo sitio no encontrado</p>;
        }
        
        try {
            await updateTipo(formData.id_tipo, formData);
            onclose();
        } catch (error) {
            console.log("Error al actualizar el tipo de sitio", error);
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


export default FormUpTipos;