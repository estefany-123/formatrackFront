import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { TipoSitio } from "@/schemas/TipoSitio";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (tipos: TipoSitio) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormTipos({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<TipoSitio>({
        id_tipo: 0,
        nombre: "",
        estado: true
    });

    const onSubmit = async (e: React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            setFormData({
                id_tipo: 0,
                nombre: "",
                estado: true
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el tipo de sitio", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">

            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />

            <Select
                aria-labelledby="estado"
                labelPlacement="outside"
                name="estado"
                placeholder="Estado"
                onChange={(e) => setFormData({ ...formData, estado: e.target.value === "true" })} // Convierte a booleano
            >
                <SelectItem key="true">Activo</SelectItem>
                <SelectItem key="false" >Inactivo</SelectItem>
            </Select>
            
        </Form>
    )
}