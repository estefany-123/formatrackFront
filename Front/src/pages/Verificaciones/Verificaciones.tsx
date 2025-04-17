import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useVerificacion } from "@/hooks/Verificaciones/useVerificacion";
import { Verificacion } from "@/types/Verificacion";
import Formulario from "@/components/organismos/Verificaciones/FormRegister";
import { FormUpdate } from "@/components/organismos/Verificaciones/FormUpdate";

export const VerificacionTable = () => {
  const { verificaciones, isLoading, isError, error, addVerificacion,  } =
    useVerificacion();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedVerificacion, setSelectedVerificacion] = useState<Verificacion | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedVerificacion(null);
  };

  const handleAddVerificacion = async (elemento: Verificacion) => {
    try {
      await addVerificacion(elemento);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la verifiacion:", error);
    }
  };

  const handleEdit = (elemento: Verificacion) => {
    setSelectedVerificacion(elemento);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Verificacion>[] = [
    { key: "persona_encargada", label: "" },
    { key: "persona_asignada", label: "Solicitante" },
    {
      key: "created_at",
      label: "Fecha Verificacion",
      render: (verificacion: Verificacion) => (
        <span>{new Date(verificacion.created_at).toLocaleDateString("es-ES")}</span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (verificacion: Verificacion) => (
        <span>{new Date(verificacion.updated_at).toLocaleDateString("es-ES")}</span>
      ),
    },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const VerificacionsWithKey = verificaciones
    ?.filter((elemento) => elemento?.id_verificacion !== undefined)
    .map((elemento) => ({
      ...elemento,
      key: elemento.id_verificacion
        ? elemento.id_verificacion.toString()
        : crypto.randomUUID(),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Verificacions Registrados
      </h1>

      <Buton
        text="Nueva Verificacion"
        onPress={() => setIsOpen(true)}
        type="button"
        variant="solid"
        className="relative top-12 text-white bg-blue-700"
      />

      <Modall
        ModalTitle="Registrar Nueva Verificacion"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="verificacion-form"
          addData={handleAddVerificacion}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="verificacion-form"
          className="bg-blue-700 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Verificacion"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedVerificacion && (
          <FormUpdate
            verificaciones={VerificacionsWithKey ?? []}
            verificacionId={selectedVerificacion.id_verificacion}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {VerificacionsWithKey && (
        <Globaltable
          data={VerificacionsWithKey}
          columns={columns}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};
