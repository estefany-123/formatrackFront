import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, User } from "@/schemas/User";
import { Form } from "@heroui/form";
import { useRol } from "@/hooks/Roles/useRol";
import Buton from "@/components/molecules/Button";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import FormularioRoles from "../Roles/FormRegister";
import Modal from "../modal";

type FormularioProps = {
  addData: (user: User) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioU({ addData, onClose, id }: FormularioProps) {
  const {
    roles,
    isLoading: loadinRoles,
    isError: errorRoles,
    addRol,
  } = useRol();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const [showModalRol, setShowModalRol] = useState(false);
  const handleClose = () => setShowModalRol(false);

  const onSubmit = async (data: User) => {
    console.log(data);
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Usuario agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <>
      <Form
        id={id}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Input
          label="Documento"
          type="text"
          placeholder="Documento"
          {...register("documento", { valueAsNumber: true })}
          isInvalid={!!errors.documento}
          errorMessage={errors.documento?.message}
        />
        <Input
          label="Nombre"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />
        <Input
          label="Apellido"
          type="text"
          placeholder="Apellido"
          {...register("apellido")}
          isInvalid={!!errors.apellido}
          errorMessage={errors.apellido?.message}
        />
        <Input
          label="Edad"
          type="text"
          placeholder="Edad"
          {...register("edad", { valueAsNumber: true })}
          isInvalid={!!errors.edad}
          errorMessage={errors.edad?.message}
        />
        <Input
          label="Teléfono"
          type="text"
          placeholder="Teléfono"
          {...register("telefono")}
          isInvalid={!!errors.telefono}
          errorMessage={errors.telefono?.message}
        />
        <Input
          label="Correo"
          type="email"
          placeholder="Correo"
          {...register("correo")}
          isInvalid={!!errors.correo}
          errorMessage={errors.correo?.message}
        />

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

        {errors.estado && (
          <p className="text-red-500">{errors.estado?.message}</p>
        )}
        <Input
          label="Cargo"
          type="text"
          placeholder="Cargo"
          {...register("cargo")}
          isInvalid={!!errors.cargo}
          errorMessage={errors.cargo?.message}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="Password"
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />

        {!loadinRoles && !errorRoles && roles && (
          <Controller
            control={control}
            name="fkRol"
            render={({ field }) => {
              const [query, setQuery] = useState("");
              const [showOptions, setShowOptions] = useState(false);

              const filteredRoles =
                roles?.filter(
                  (r) =>
                    r.estado &&
                    r.nombre.toLowerCase().includes(query.toLowerCase())
                ) || [];

              const selectedRol = roles?.find((r) => r.idRol === field.value);

              useEffect(() => {
                if (selectedRol) {
                  setQuery(selectedRol.nombre);
                }
              }, [selectedRol?.idRol]);

              return (
                <div className="relative w-full flex items-start gap-2">
                  <div className="w-full">
                    <Input
                      label="Rol"
                      placeholder="Selecciona un rol..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowOptions(true);
                        field.onChange(null);
                      }}
                      onFocus={() => setShowOptions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowOptions(false), 150)
                      }
                      isInvalid={!!errors.fkRol}
                      errorMessage={errors.fkRol?.message}
                    />

                    {showOptions && filteredRoles.length > 0 && (
                      <div
                        className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                      >
                        {filteredRoles.map((rol) => (
                          <div
                            key={rol.idRol}
                            className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              field.onChange(rol.idRol);
                              setQuery(rol.nombre);
                              setShowOptions(false);
                            }}
                          >
                            {rol.nombre}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Buton
                    type="button"
                    className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                    onPress={() => setShowModalRol(true)}
                  >
                    <PlusCircleIcon />
                  </Buton>
                </div>
              );
            }}
          />
        )}
      </Form>
      <Modal
        ModalTitle="Agregar Rol"
        isOpen={showModalRol}
        onOpenChange={handleClose}
      >
        <FormularioRoles
          id="rol"
          onClose={() => setShowModalRol(false)}
          addData={async (data) => {
            await addRol(data);
          }}
        />
        <Buton form="rol" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
