import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { Modulo } from "@/types/Modulo";
import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (modulos: Modulo) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function FormModulos({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<Modulo>({
        id_modulo: 0,
        nombre: "",
        descripcion: "",
        estado: true
    });

    const onSubmit = async (e: React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("Modulo guardado correctamente");
            setFormData({
                id_modulo: 0,
                nombre: "",
                descripcion: "",
                estado: true
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el modulo", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">

            <Inpu label="Nombre" placeholder="Nombre" type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
            <Inpu label="Descripcion" placeholder="Descripcion" type="text" name="descripcion" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />

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