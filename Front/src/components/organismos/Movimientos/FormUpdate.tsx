import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { MovimientoUpdate, MovimientoUpdateSchema } from "@/schemas/Movimento";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { addToast } from "@heroui/react";
import Buton from "@/components/molecules/Button";

type Props = {
  movimientos: (MovimientoUpdate & { idMovimiento?: number })[];
  movimientoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({
  movimientos,
  movimientoId,
  id,
  onclose,
}: Props) => {
  const { updateMovimiento, getMovimientoById } = useMovimiento();

  const foundMovimiento = getMovimientoById(
    movimientoId,
    movimientos
  ) as MovimientoUpdate;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MovimientoUpdate>({
    resolver: zodResolver(MovimientoUpdateSchema),
    mode: "onChange",
    defaultValues: {
      ...foundMovimiento,
      horaIngreso: foundMovimiento?.horaIngreso
        ? foundMovimiento.horaIngreso.slice(0, 5)
        : "",
      horaSalida: foundMovimiento?.horaSalida
        ? foundMovimiento.horaSalida.slice(0, 5)
        : "",
    },
  });

  const onSubmit = async (data: MovimientoUpdate) => {
    const payload = {
      ...data,
      horaIngreso: data.horaIngreso
        ? data.horaIngreso.length === 5
          ? `${data.horaIngreso}:00`
          : data.horaIngreso
        : null,
      horaSalida: data.horaSalida
        ? data.horaSalida.length === 5
          ? `${data.horaSalida}:00`
          : data.horaSalida
        : null,
    };

    console.log("🚀 Payload enviado:", payload);

    if (!payload.idMovimiento) return;

    try {
      await updateMovimiento(payload.idMovimiento, payload);
      onclose();
      addToast({
        title: "Actualización Exitosa",
        description: "Movimiento actualizado correctamente",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("❌ Error al actualizar el movimiento:", error);
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
        label="Descripcion"
        placeholder="Ingresa la descripcion ..."
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />
      <Input
        label="Hora Ingreso"
        placeholder="Seleccione la Hora Ingreso"
        type="time"
        {...register("horaIngreso")}
        isInvalid={!!errors.horaIngreso}
        errorMessage={errors.horaIngreso?.message}
      />
      <Input
        label="Hora Salida"
        placeholder="Ingrese la hora de Salida"
        type="time"
        {...register("horaSalida")}
        isInvalid={!!errors.horaSalida}
        errorMessage={errors.horaSalida?.message}
      />
      <Buton
        text="Guardar"
        type="submit"
        isLoading={isSubmitting}
        className="w-full bg-blue-700 text-white p-2 rounded-xl"
      />
    </Form>
  );
};
