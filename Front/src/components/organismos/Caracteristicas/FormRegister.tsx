import { Form } from "@heroui/form";
import { addToast, Input} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaracteristicaCreate, CaracteristicaCreateSchema } from "@/schemas/Caracteristica";

type FormularioProps = {
  addData: (tipo: CaracteristicaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CaracteristicaCreate>({
    resolver: zodResolver(CaracteristicaCreateSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CaracteristicaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Tipo Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };
  console.log("Errores", errors)
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
        label="Simbolo"
        placeholder="Simbolo"
        type="text"
        {...register("simbolo")}
        isInvalid={!!errors.simbolo}
        errorMessage={errors.simbolo?.message}
      />
    </Form>
  );
}
