import { Form } from "@heroui/form";
import { addToast, Select, SelectItem, Checkbox, Button } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RolPermisoCreate,
  RolPermisoSchema,
  RolPermisoPost,
} from "@/schemas/RolPermiso";

type Props = {
  addData: (data: RolPermisoPost) => Promise<any>;
  onClose: () => void;
  id?: number;
  permisos: { idPermiso: number; permiso: string }[];
  roles: { idRol: number; nombre: string }[];
  fkRolDefault?: number;
};

export default function FormularioRolPermiso({
  addData,
  onClose,
  id,
  permisos,
  roles,
  fkRolDefault
}: Props) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RolPermisoCreate>({
    resolver: zodResolver(RolPermisoSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
      permisos: [],
      fkRol: fkRolDefault ?? undefined,
    },
  });

  const seleccionados = watch("permisos");

  const togglePermiso = (id: number) => {
    const actualizados = seleccionados.includes(id)
      ? seleccionados.filter((p) => p !== id)
      : [...seleccionados, id];
    setValue("permisos", actualizados);
  };

  const onSubmit = async (data: RolPermisoCreate) => {
    try {
      for (const permiso of data.permisos) {
        await addData({
          estado: data.estado,
          fkRol: data.fkRol,
          fkPermiso: permiso,
        });
      }

      onClose();
      addToast({
        title: "Permisos asignados",
        description: "Los permisos fueron asignados correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Form
      id={id?.toString()}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* ✅ Sección de permisos */}
      <div>
        <label className="font-semibold">Permisos disponibles</label>
        <div className="grid grid-cols-2 gap-2 border p-2 rounded max-h-[200px] overflow-y-auto">
          {permisos.map((perm) => (
            <Checkbox
              key={perm.idPermiso}
              isSelected={seleccionados.includes(perm.idPermiso)}
              onChange={() => togglePermiso(perm.idPermiso)}
            >
              {perm.permiso}
            </Checkbox>
          ))}
        </div>
        {errors.permisos && (
          <p className="text-sm text-red-500">{errors.permisos.message}</p>
        )}
      </div>

      {/* ✅ Select de estado */}
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
  name="fkRol"
  render={({ field }) => (
    <Select
      label="Rol"
      placeholder="Selecciona un rol"
      {...field}
      value={field.value !== undefined ? String(field.value) : ""}
      onChange={(e) => field.onChange(Number(e.target.value))}
      isInvalid={!!errors.fkRol}
      errorMessage={errors.fkRol?.message} // Opcional: si quieres que no se pueda cambiar
    >
      {roles?.map((rol) => (
        <SelectItem key={rol.idRol} textValue={rol.idRol.toString()}>
          {rol.nombre}
        </SelectItem>
      ))}
    </Select>
  )}
/>

      <Button type="submit" className="w-full bg-indigo-600 text-white">
        Guardar
      </Button>
    </Form>
  );
}
