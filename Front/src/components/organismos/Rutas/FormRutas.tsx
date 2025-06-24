import { Form } from "@heroui/form";
import { Ruta, RutaSchema } from "@/schemas/Ruta";
import { Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModulo } from "@/hooks/Modulos/useModulo";

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
    control,
  } = useForm({
    resolver: zodResolver(RutaSchema),
  });

  const { modulos } = useModulo();

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
      <Input
        {...register("nombre")}
        label="Nombre"
        placeholder="Ingrese el nombre de la ruta"
        type="text"
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        {...register("descripcion")}
        label="Descripcion"
        placeholder="Ingrese la descripcion de la ruta"
        type="text"
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />
      <Input
        {...register("urlDestino")}
        label="Url destino"
        placeholder="Ingrese la url de la ruta"
        type="text"
        isInvalid={!!errors.urlDestino}
        errorMessage={errors.urlDestino?.message}
      />

      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Selecciona estado"
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => field.onChange(e.target.value === "true")}
            isInvalid={!!errors.estado}
            errorMessage={errors.estado?.message}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />

      <Controller
        control={control}
        name="fkModulo"
        render={({ field }) => (
          <div className="w-full">
            <Select
              {...field}
              label="Modulo"
              placeholder="Selecciona un modulo"
              aria-label="Seleccionar modulo"
              className="w-full"
              selectedKeys={field.value ? [field.value.toString()] : []}
              onChange={(e) => {
                const elementoId = Number(e.target.value);
                field.onChange(elementoId);
              }}
              isInvalid={!!errors.fkModulo}
              errorMessage={errors.fkModulo?.message}
            >
              {modulos?.length ? (
                modulos.map((elemento) => (
                  <SelectItem
                    key={elemento.idModulo}
                    textValue={elemento.nombre}
                  >
                    {elemento.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay modulos disponibles</SelectItem>
              )}
            </Select>
          </div>
        )}
      />
    </Form>
  );
}
