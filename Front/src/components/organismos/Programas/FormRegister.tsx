import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { useCentro } from "@/hooks/Centros/useCentros";
import { programaCreate, programaCreateSchema } from "@/schemas/programas";

type FormularioSedeProps = {
  addData: (data: programaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSede({
  addData,
  onClose,
  id,
}: FormularioSedeProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<programaCreate>({
    resolver: zodResolver(programaCreateSchema),
    mode: "onChange",
  });

  const { centros } = useCentro();

  const onSubmit = async (data: programaCreate) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar el programa:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre del programa"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => field.onChange(e.target.value === "true")}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />
      {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}

      <Controller
        control={control}
        name="fk_area"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Área"
              placeholder="Selecciona un área"
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(Number(e.target.value))}
            >
              {centros?.length ? (
                centros.map((centro) => (
                  <SelectItem key={centro.id_centro}>
                    {centro.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay áreas disponibles</SelectItem>
              )}
            </Select>
            {errors.fk_area && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_area.message}
              </p>
            )}
          </div>
        )}
      />
    </Form>
  );
}
