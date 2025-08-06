import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { AreaCreate, AreaCreateSchema } from "@/schemas/Area";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useSede } from "@/hooks/sedes/useSedes";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useEffect, useState } from "react";
import Modal from "@/components/organismos/modal";
import FormularioSede from "../Sedes/FormRegister";
import Buton from "@/components/molecules/Button";
import Formulario from "../Usuarios/FormRegister";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

type FormularioProps = {
  addData: (area: AreaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioArea({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AreaCreate>({
    resolver: zodResolver(AreaCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { sede, addSede } = useSede();
  const { users, addUser } = useUsuario();

  const [showModal, setShowModal] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseUser = () => setShowModalUser(false);

  const onSubmit = async (data: AreaCreate) => {
    try {
      console.log("Datos que se van a enviar al backend:", data); //errores

      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Area agregada correctamente",
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
    <>
      <Form
        id={id}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Input
          label="Nombre"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />

        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <Select
              label="Estado"
              placeholder="Seleccione un estado"
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

        <Controller
          control={control}
          name="fkSede"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredSedes =
              sede?.filter(
                (s) =>
                  s.estado &&
                  s.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedSede = sede?.find((s) => s.idSede === field.value);

            useEffect(() => {
              if (selectedSede) {
                setQuery(selectedSede.nombre);
              }
            }, [selectedSede?.idSede]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Sede"
                    placeholder="Selecciona una sede..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkSede}
                    errorMessage={errors.fkSede?.message}
                  />

                  {showOptions && filteredSedes.length > 0 && (
                    <div
                      className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      {filteredSedes.map((sedeItem) => (
                        <div
                          key={sedeItem.idSede}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(sedeItem.idSede);
                            setQuery(sedeItem.nombre);
                            setShowOptions(false);
                          }}
                        >
                          {sedeItem.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModal(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="fkUsuario"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredUsuarios =
              users?.filter(
                (u) =>
                  u.estado &&
                  u.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedUsuario = users?.find(
              (u) => u.idUsuario === field.value
            );

            useEffect(() => {
              if (selectedUsuario) {
                setQuery(selectedUsuario.nombre);
              }
            }, [selectedUsuario?.idUsuario]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Usuario"
                    placeholder="Selecciona un usuario..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkUsuario}
                    errorMessage={errors.fkUsuario?.message}
                  />

                  {showOptions && filteredUsuarios.length > 0 && (
                    <div
                      className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      {filteredUsuarios.map((usuario) => (
                        <div
                          key={usuario.idUsuario}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(usuario.idUsuario);
                            setQuery(usuario.nombre);
                            setShowOptions(false);
                          }}
                        >
                          {usuario.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalUser(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />
      </Form>
      <Modal
        ModalTitle="Agregar Sede"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormularioSede
          id="sede"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addSede(data);
          }}
        />
        <Buton form="sede" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Usuario"
        isOpen={showModalUser}
        onOpenChange={handleCloseUser}
      >
        <Formulario
          id="user"
          onClose={() => setShowModalUser(false)}
          addData={async (data) => {
            await addUser(data);
          }}
        />
        <Buton form="user" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
