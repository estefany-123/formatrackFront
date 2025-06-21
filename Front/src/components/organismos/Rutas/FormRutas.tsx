import { Form } from "@heroui/form";
import { Ruta, RutaSchema } from "@/schemas/Ruta";
import { Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormularioProps = {
  addData: (rutas: Ruta) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormRutas({ addData, onClose, id }: FormularioProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(RutaSchema),
  });

  const onSubmit = async (data: Ruta) => {
    try {
      console.log("Enviando formulario con datos:", data);
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al cargar la ruta", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input {...register("nombre")} label="Nombre" type="text" />
      {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
      <Input {...register("descripcion")} label="Descripcion" type="text" />
      {errors.descripcion && (
        <p className="text-red-500">{errors.descripcion.message}</p>
      )}
      <Input {...register("urlDestino")} label="Url destino" type="text" />
      {errors.urlDestino && (
        <p className="text-red-500">{errors.urlDestino.message}</p>
      )}

      <Select
        aria-labelledby="estado"
        labelPlacement="outside"
        placeholder="Estado"
        onChange={(e) =>
          setValue("estado", e.target.value === "true" ? true : false)
        }
      >
        <SelectItem key="true">Activo</SelectItem>
        <SelectItem key="false">Inactivo</SelectItem>
      </Select>
      {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}

      <Input
        label="Modulo"
        type="number"
        onChange={(e) => setValue("fkModulo", parseInt(e.target.value))}
      />
      {errors.fkModulo && (
        <p className="text-red-500">{errors.fkModulo.message}</p>
      )}
    </Form>
  );
}
