import { Ruta, RutaUpdate, RutaUpdateSchema } from "@/schemas/Ruta";
import { Form } from "@heroui/form";
import { useRuta } from "@/hooks/Rutas/useRuta";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@heroui/input";
import Buton from "@/components/molecules/Button";

type Props = {
  rutas: Ruta[];
  rutaId: number;
  id: string;
  onclose: () => void;
};

const FormUpRutas = ({ rutas, rutaId, id, onclose }: Props) => {
  console.log("Datos anteriores: ", rutas);

  const { updateRuta, getRutaById } = useRuta();

  const foundRuta = getRutaById(rutaId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RutaUpdateSchema),
    defaultValues: {
      ...foundRuta,
    },
  });

  const onSubmit = async (data: RutaUpdate) => {
    try {
      await updateRuta(data.idRuta, data);
      onclose();
    } catch (error) {
      console.log("Error al actualizar la ruta", error);
    }
  };

  return (
    <Form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
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
      <div>
        <Buton
          text="Guardar"
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
        />
      </div>
    </Form>
  );
};

export default FormUpRutas;
