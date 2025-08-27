import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/react";
import Buton from "@/components/molecules/Button";
import { ZapatoUpdate, ZapatoUpdateSchema } from "@/schemas/zapato";
import { useZapato } from "@/hooks/Zapatos/useZapato";

type Props = {
  zapatos: (ZapatoUpdate & { idZapato: number })[];
  zapatoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ zapatos, zapatoId, id, onclose }: Props) => {
  const { updateZapato, getZapatoById } = useZapato();

  const foundRol = getZapatoById(zapatoId, zapatos) as ZapatoUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZapatoUpdate>({
    resolver: zodResolver(ZapatoUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idZapato: foundRol.idZapato,
      nombre: foundRol.nombre,
      marca: foundRol.marca,
      talla: foundRol.talla,
    },
  });

  const onSubmit = async (data: ZapatoUpdate) => {
    console.log(data);
    if (!data.idZapato) return;
    try {
      await updateZapato(data.idZapato, data);
      onclose();
      addToast({
        title: "Actualizacion Exitosa",
        description: "Zapato actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.log("Error al actualizar el zapato : ", error);
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
        label="Nombre"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        label="Marca"
        placeholder="Marca"
        {...register("marca")}
        isInvalid={!!errors.marca}
        errorMessage={errors.marca?.message}
      />
      <Input
        label="Talla"
        placeholder="Talla"
        {...register("talla")}
        isInvalid={!!errors.talla}
        errorMessage={errors.talla?.message}
      />
      <Buton
        text="Guardar"
        type="submit"
        isLoading={isSubmitting}
        className="w-full rounded-xl"
      />
    </Form>
  );
};
