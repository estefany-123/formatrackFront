import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/Sedes/FormRegister";
import { useState } from "react";
import { FormUpdate } from "@/components/organismos/Sedes/Formupdate";
import { Sede } from "@/schemas/sedes";
import { useSede } from "@/hooks/sedes/useSedes";

const SedeTable = () => {
  const { sede, isLoading, isError, error, addSede, changeState } = useSede();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedSede(null);
  };

  const handleState = async (sede: Sede) => {
    await changeState(sede.id_sede as number);
  };

  const handleAddSede = async (sede: Sede) => {
    try {
      await addSede(sede);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la sede:", error);
    }
  };

  const handleEdit = (sede: Sede) => {
    setSelectedSede(sede);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Sede>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha CReacion",
      render: (sede: Sede) => (
        <span>
          {sede.created_at
            ? new Date(sede.created_at).toLocaleDateString("es-ES", {
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
      label: "Fecha Actualización",
      render: (sede: Sede) => (
        <span>
          {sede.updated_at
            ? new Date(sede.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const sedeWithKey = sede
    ?.filter((sede) => sede?.id_sede !== undefined)
    .map((sede) => ({
      ...sede,
      key: sede.id_sede ? sede.id_sede.toString() : crypto.randomUUID(),
      id_sede:sede.id_sede || 0,
      estado: Boolean(sede.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Tabla de Sedes</h1>

      <Buton
        text="Añadir sede"
        onPress={() => setIsOpen(true)}
        type="button"
        color="primary"
        variant="solid"
        className="mb-8"
      />

      <Modall
        ModalTitle="Agregar sede"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="sede-form"
          addData={handleAddSede}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="sede-form"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar sede"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedSede && (
          <FormUpdate
            sedes={sedeWithKey ?? []}
            sedeId={selectedSede.id_sede as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {sedeWithKey && (
        <Globaltable
          data={sedeWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
        />
      )}
    </div>
  );
};

export default SedeTable;
