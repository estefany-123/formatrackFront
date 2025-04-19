import React, { useState } from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Select, SelectItem } from "@heroui/react";
import { Rol } from "@/types/Rol";
import { RolSchema } from "@/schemas/Rol";

type FormularioProps = {
  addData: (rol: Rol) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Rol>({
    id_rol: 0,
    nombre: "",
    estado: true,
    created_at:'',
    updated_at:'',
  });

  const [error, setError] = useState<{ nombre?: string }>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const result = RolSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError({
        nombre: fieldErrors.nombre?.[0],
      });
      return;
    }

    try {
      await addData(formData);
      setFormData({
        id_rol: 0,
        nombre: "",
        estado: true,
        created_at: "",
        updated_at: "",
      });
      setError({});
      onClose();
    } catch (error) {
      console.error("Error al cargar el rol", error);
    }
  };

  return (
    <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      <Inpu
        label="Nombre"
        placeholder="Nombre"
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={(e) => {
          setFormData({ ...formData, nombre: e.target.value });
          setError({});
        }}
        error={error.nombre}
      />

      <Select
        aria-labelledby="estado"
        labelPlacement="outside"
        name="estado"
        placeholder="Estado"
        onChange={(e) =>
          setFormData({ ...formData, estado: e.target.value === "true" })
        }
        selectedKeys={formData.estado ? "true" : "false"}
      >
        <SelectItem key="true">Activo</SelectItem>
        <SelectItem key="false">Inactivo</SelectItem>
      </Select>
    </Form>
  );
}
