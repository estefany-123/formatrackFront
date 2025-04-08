import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Ruta } from "@/types/Ruta";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (rutas: Ruta) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormRutas({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Ruta>({
        id_ruta: 0,
        nombre: "",
        descripcion: "",
        url_destino: "",
        estado: true,
        fk_modulo: 0
    });

    const onSubmit = async (e: React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            setFormData({
                id_ruta: 0,
                nombre: "",
                descripcion: "",
                url_destino: "",
                estado: true,
                fk_modulo: 0
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar la ruta", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">

            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            <Inpu label="Descripcion" placeholder="Descripcion" type="text" name="descripcion" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
            <Inpu label="Url destino" placeholder="Url destino" type="text" name="url_destino" value={formData.url_destino} onChange={(e) => setFormData({ ...formData, url_destino: e.target.value })} />

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

            <Inpu label="Modulo" placeholder="Modulo" type="text" name="fk_modulo" value={formData.fk_modulo.toString()} onChange={(e) => setFormData({ ...formData, fk_modulo:Number (e.target.value) })} />


        </Form>
    )
}