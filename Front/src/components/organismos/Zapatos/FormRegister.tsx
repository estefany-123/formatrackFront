import { Form } from "@heroui/form";
import { addToast, Input} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZapatoCreate, ZapatoCreateSchema } from "@/schemas/zapato";

type FormularioProps = {
  addData: (zapato: ZapatoCreate) => Promise<any>;
  onClose: () => void;
  id: string;
};

export default function FormularioZapato({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ZapatoCreate>({
    resolver: zodResolver(ZapatoCreateSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ZapatoCreate) => {
    try {
      console.log("DAtos enviados:", data);
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Zapato agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };
  console.log("Errores", errors);
  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre"
        placeholder="Nombre"
        type="text"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        label="Marca"
        placeholder="Marca"
        type="text"
        {...register("marca")}
        isInvalid={!!errors.marca}
        errorMessage={errors.marca?.message}
      />
      <Input
        label="Talla"
        placeholder="Talla"
        type="text"
        {...register("talla")}
        isInvalid={!!errors.talla}
        errorMessage={errors.talla?.message}
      />
    </Form>
  );
}
