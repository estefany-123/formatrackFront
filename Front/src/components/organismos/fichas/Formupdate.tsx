import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { fichaUpdateSchema, fichaUpdate } from "@/schemas/fichas";
import { Form } from "@heroui/form";
import { useFichas } from "@/hooks/fichas/useFichas";
import { zodResolver } from "@hookform/resolvers/zod";

type FormuProps = {
  fichas: (fichaUpdate & { key: string })[];
  fichaId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdateFicha = ({ fichas, fichaId, id, onclose }: FormuProps) => {
  const { updateFicha, getFichaById } = useFichas();

  const foundFicha = getFichaById(fichaId, fichas) as fichaUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<fichaUpdate>({
    resolver: zodResolver(fichaUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id_ficha: foundFicha.id_ficha ?? 0,
      codigo_ficha: foundFicha.codigo_ficha,
      estado: foundFicha.estado,
      fk_programa: foundFicha.fk_programa
    },
  });

  const onSubmit = async (data: fichaUpdate) => {
    if (!data.id_ficha) return;
    try {
      await updateFicha(data.id_ficha, data);
      onclose();
    } catch (error) {
      console.error("Error al actualizar la ficha:", error);
    }
  };

  return (
    <Form id={id} className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Código Ficha"
        placeholder="Ingrese el código de ficha"
        {...register("codigo_ficha")}
        isInvalid={!!errors.codigo_ficha}
        errorMessage={errors.codigo_ficha?.message}
      />

      {/* Botón submit de tipo "submit" */}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Guardar Cambios
      </button>
    </Form>
  );
};
