import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { AreaSchema, Area } from "@/schemas/Area";
import { Select, SelectItem } from "@heroui/react";
import { useSede } from "@/hooks/sedes/useSedes";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";

type FormularioProps = {
  addData: (area: Area) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Area>({
    resolver: zodResolver(AreaSchema),
    mode: "onChange",
  });

  const { sede } = useSede();
  const { users } = useUsuario();

  const onSubmit = async (data: Area) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre"
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
        name="fk_sede"
        render={({ field }) => (
          <div className="w-full">
            <label className="text-sm text-gray-700 font-medium mb-1 block">
              Sede
            </label>
            <Select
              {...field}
              className="w-full"
              placeholder="Selecciona una sede..."
              aria-label="Seleccionar Sede"
            >
      
              {sede?.length ? (
                sede.map((s) => (
                  <SelectItem key={s.id_sede} textValue={s.nombre}>
                    {s.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay sedes disponibles</SelectItem>
              )}
            </Select>
            {errors.fk_sede && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_sede.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="fk_usuario"
        render={({ field }) => (
          <div className="w-full">
            <Select
            label="Usuario"
              {...field}
              className="w-full"
              placeholder="Selecciona un usuario..."
              aria-label="Seleccionar Usuario"
            >
              {/* Asegúrate de que users no sea undefined */}
              {users?.length ? (
                users.map((u) => (
                  <SelectItem key={u.id_usuario} textValue={u.nombre}>
                    {u.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay usuarios disponibles</SelectItem>
              )}
            </Select>
            {errors.fk_usuario && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_usuario.message}
              </p>
            )}
          </div>
        )}
      />
    </Form>
  );
}
