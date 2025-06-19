import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { sitio, sitioUpdate, sitioUpdateSchema } from "@/schemas/sitios";
import { useSitios } from "@/hooks/sitios/useSitios";
import { addToast } from "@heroui/react";

type Props = {
  sitios: (sitioUpdate & { idSitio?: number })[];
  sitioId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ sitios, sitioId, id, onclose }: Props) => {
  const { updateSitio, getSitioById } = useSitios();

  const foundSitio = getSitioById(sitioId, sitios) as sitio;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<sitioUpdate>({
    resolver: zodResolver(sitioUpdateSchema),
    mode: "onChange",
    defaultValues: {
      nombre: foundSitio.nombre,
      personaEncargada: foundSitio.personaEncargada,
      ubicacion: foundSitio.ubicacion
    },
  });

  const onSubmit = async (data: sitioUpdate) => {
    console.log(data);
    if (!data.idSitio) return;
    try {
      await updateSitio(data.idSitio, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Sitio actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar la sede : ", error);
    }
  };

  console.log("Errores", errors);

  return (
    <Form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre del sitio"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Persona encargada"
        type="text"
        placeholder="Encargado"
        {...register("personaEncargada")}
        isInvalid={!!errors.personaEncargada}
        errorMessage={errors.personaEncargada?.message}
      />

      <Input
        label="Ubicación"
        type="text"
        placeholder="Ubicación"
        {...register("ubicacion")}
        isInvalid={!!errors.ubicacion}
        errorMessage={errors.ubicacion?.message}
      />

      <div className="justify-center pl-10">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </div>
    </Form>
  );
};
