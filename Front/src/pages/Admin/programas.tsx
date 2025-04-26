import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/Programas/FormRegister";
import { useState } from "react";
import { FormUpdate } from "@/components/organismos/Programas/Formupdate";
import { programa } from "@/schemas/programas";
import { usePrograma } from "@/hooks/programas/usePrograma";

const ProgramasTable = () => {
  const { programas, isLoading, isError, error, addPrograma, changeState } =
    usePrograma();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState<programa | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedPrograma(null);
  };

  const handleState = async (programa: programa) => {
    await changeState(programa.id_programa as number);
  };

  const handleAddPrograma = async (programa: programa) => {
    try {
      await addPrograma(programa);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el programa:", error);
    }
  };

  const handleEdit = (programa: programa) => {
    setSelectedPrograma(programa);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<programa>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (programa: programa) => (
        <span>
          {programa.created_at
            ? new Date(programa.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualizacion",
      render: (programa: programa) => (
        <span>
          {programa.updated_at
            ? new Date(programa.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" }
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const usersWithKey = programas
    ?.filter((programa) => programa?.id_programa !== undefined)
    .map((programa) => ({
      ...programa,
      key: programa.id_programa
        ? programa.id_programa.toString()
        : crypto.randomUUID(),
      estado: Boolean(programa.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Tabla Programas de Formación
      </h1>

      <Buton
        text="Añadir Programa"
        onPress={() => setIsOpen(true)}
        type="button"
        color="primary"
        variant="solid"
        className="mb-8"
      />

      <Modall
        ModalTitle="Agregar Programa"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="Programa-form"
          addData={handleAddPrograma}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="Programa-form"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Programa"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedPrograma && (
          <FormUpdate
            programas={usersWithKey ?? []}
            programaId={selectedPrograma.id_programa as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {usersWithKey && (
        <Globaltable
          data={usersWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
        />
      )}
    </div>
  );
};

export default ProgramasTable;
