import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { useCentro } from "@/hooks/Centros/useCentros";
import { sedeCreate, sedeCreateSchema } from "@/schemas/sedes";

type FormularioSedeProps = {
  addData: (data: sedeCreate) => Promise<void>;
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
  } = useForm<sedeCreate>({
    resolver: zodResolver(sedeCreateSchema),
    mode: "onChange",
  });

  const { centros } = useCentro();

  const onSubmit = async (data: sedeCreate) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar sede:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre de la sede"
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
        name="fk_centro"
        render={({ field }) => (
          <div className="w-full">
            <Select
            label="Centro"
              {...field}
              className="w-full"
              placeholder="Selecciona un centro..."
              aria-label="Seleccionar Centro"
            >
              {centros?.length ? (
                centros.map((centro) => (
                  <SelectItem key={centro.id_centro} textValue={centro.nombre}>
                    {centro.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay centros disponibles</SelectItem>
              )}
            </Select>
            {errors.fk_centro && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_centro.message}
              </p>
            )}
          </div>
        )}
      />
    </Form>
  );
}
