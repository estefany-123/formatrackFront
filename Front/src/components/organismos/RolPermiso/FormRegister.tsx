import { Form } from "@heroui/form";
import { addToast, Select, SelectItem, Checkbox } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RolPermisoCreate,
  RolPermisoSchema,
  RolPermisoPost,
} from "@/schemas/RolPermiso";
import Buton from "@/components/molecules/Button";

type Props = {
  addData: (data: RolPermisoPost) => Promise<any>;
  onClose: () => void;
  id?: number;
  permisos: { idPermiso: number; permiso: string }[];
  fkRolDefault?: number;
};

export default function FormularioRolPermiso({
  addData,
  onClose,
  id,
  permisos,
  fkRolDefault,
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
            isDisabled
            defaultSelectedKeys={["true"]}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />
      <Buton
        text="Guardar"
        type="submit"
        className="w-full rounded-xl"
      />
    </Form>
  );
}
