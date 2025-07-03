import { postMassiveUsuarios } from "@/axios/Usuarios/postMassiveUsuarios";
import Buton from "@/components/molecules/Button";
import { Button } from '@heroui/button'
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, useModalContext } from "@heroui/react";
import { FormEvent, useState } from "react";

export default function FormRegisterMasivo(){

    const { onClose } = useModalContext();

    const [file,setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    async function onSubmit(e: FormEvent){
        e.preventDefault();
        if(!file) return setError("Selecciona un archivo primero");
        const formData = new FormData();
        formData.append("excel",file);
        try{
            await postMassiveUsuarios(formData);
            addToast({
                title: "Usuarios subidos exitosamente",
                description: "Los usuarios se crearon en la base de datos",
                color: "success"
            })
            onClose();
        }
        catch(error){
            console.log(error);
            addToast({
                title: "Error subiendo usuarios",
                description: "Hubo un error intentando subir los usuarios",
                color: "danger"
            })
        }
    }

    return(
        <Form onSubmit={onSubmit} className="flex flex-col gap-6">
            <a href={`${import.meta.env.VITE_API_CLIENT}img/excel/FORMATO EXCEL.xlsx`} download><Button variant="bordered" color="success">Descargar formato</Button></a>
            <Input onChange={handleFileChange} type="file" accept=".xlsx,.xls" />
            {file && <p>Selected file: {file.name}</p>}

            {error && <p>{error}</p>}
            <div className="flex gap-2">
                <Buton onPress={() => onClose()} className="bg-red-500" type="button">Cancelar</Buton>
                <Buton type="submit">Crear usuarios</Buton>
            </div>

        </Form>
    )
}