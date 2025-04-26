import React from "react";
import { Form } from "@heroui/form"
import Inpu from "@/components/molecules/input";
import { UserFicha } from "@/types/userFicha";
// import { Select, SelectItem } from "@heroui/react";

type FormularioProps = {

    addData: (user: UserFicha) => Promise<void>;
    onClose: () => void;
    id: string
}

export default function Formulario({ addData, onClose, id }: FormularioProps) {


    const [formData, setFormData] = React.useState<UserFicha>({
        id_usuario_ficha: 0,
        fk_usuario: 0,
        fk_ficha: 0,
    });

    const onSubmit = async (e : React.FormEvent) => { //preguntar si esta bien no usar el e: React.FormEvent
        //y aqui el preventdefault
        e.preventDefault();
        try {
            console.log("Enviando formulario con datos:", formData);
            await addData(formData);
            console.log("Usuario ficha guardado correctamente");
            setFormData({
                id_usuario_ficha: 0,
        fk_usuario: 0,
        fk_ficha: 0,
            });
            onClose();
        } catch (error) {
            console.error("Error al cargar el usuario ficha ", error);
        }
    }

    return (
        <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      
            <Inpu label="usuario" placeholder="usuario" type="number" name="fk_rol" value={formData.fk_usuario.toString()} onChange={(e) => setFormData({ ...formData, fk_usuario: Number(e.target.value) })} />
            <Inpu label="ficha" placeholder="ficha" type="number" name="fk_rol" value={formData.fk_ficha.toString()} onChange={(e) => setFormData({ ...formData, fk_ficha: Number(e.target.value) })} />

        </Form>
    )
}