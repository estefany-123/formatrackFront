import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AreaUpdateSchema, AreaUpdate, Area } from "@/schemas/Area";
import { useAreas } from "@/hooks/areas/useAreas";

type FormuProps = {
  areas: Area[];
  areaId: number;
  id: string;
  onclose: () => void;
};

export const FormuUpdate = ({ areas, areaId, id, onclose }: FormuProps) => {
  const { updateArea, getAreaById } = useAreas();

  const foundArea = getAreaById(areaId, areas) as Area;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AreaUpdate>({
    resolver: zodResolver(AreaUpdateSchema),
    mode: "onChange",
    defaultValues: foundArea
      ? {
          id_area: foundArea.id_area,
          nombre: foundArea.nombre,
          persona_encargada: foundArea.persona_encargada,
        }
      : {
          id_area: 0,
          nombre: "",
          persona_encargada: "",
        },
  });

  const onSubmit = async (data: AreaUpdate) => {
    console.log("Enviando datos:", data);
    if (!data.id_area) return;
    try {
      await updateArea(data.id_area, data);
      onclose();
    } catch (error) {
      console.error("Error al actualizar el área: ", error);
    }
  };

  return (
    <form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        label="Persona Encargada"
        placeholder="Persona encargada"
        {...register("persona_encargada")}
        isInvalid={!!errors.persona_encargada}
        errorMessage={errors.persona_encargada?.message}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Guardar Cambios
      </button>
      
    </form>
  );
};

export default FormuUpdate;
