import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { SolicitudUpdate } from "@/schemas/Solicitud";
import { useSolicitud } from "@/hooks/Solicitudes/useSolicitud";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SolicitudUpdateSchema } from "@/schemas/Solicitud";

type Props = {
  solicitudes: SolicitudUpdate[];
  solicitudId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ solicitudId, id, onclose }: Props) => {
  const { updateSolicitud, getSolicitudById } = useSolicitud();

  // Obtener la solicitud a actualizar
  const foundSolicitud = getSolicitudById(solicitudId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SolicitudUpdate>({
    resolver: zodResolver(SolicitudUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_solicitud: foundSolicitud?.id_solicitud ?? 0,
      descripcion: foundSolicitud?.descripcion ?? "",
      cantidad: foundSolicitud?.cantidad ?? 0,
      aceptada: foundSolicitud?.aceptada ?? true,
      pendiente: foundSolicitud?.pendiente ?? false,
      rechazada: foundSolicitud?.rechazada ?? false,
      fk_usuario: foundSolicitud?.fk_usuario ?? 0,
      fk_inventario: foundSolicitud?.fk_inventario ?? 0,
    },
  });
  const onSubmit = async (data: SolicitudUpdate) => {
    if (!data.id_solicitud) {
    }

    try {
      await updateSolicitud(data.id_solicitud, data);
      onclose();
    } catch (error) {
      console.log("Error al actualizar la solicitud", error);
    }
  };

  return (
    <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Descripción"
        placeholder="Descripción"
        type="text"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />
      <Input
        label="Cantidad"
        placeholder="Cantidad"
        type="number"
        {...register("cantidad")}
        isInvalid={!!errors.cantidad}
        errorMessage={errors.cantidad?.message}
      />
      <div className="justify-center pl-10">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-80 bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar Cambios
        </Button>
      </div>
    </Form>
  );
};
