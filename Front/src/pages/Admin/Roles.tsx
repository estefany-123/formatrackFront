import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useRol } from "@/hooks/Roles/useRol";
import { Rol } from "@/types/Rol";
import Formulario from "@/components/organismos/Roles/FormRegister";
import { FormUpdate } from "@/components/organismos/Roles/FormUpdate";

export const RolTable = () => {
  const { roles, isLoading, isError, error, addRol, changeState } =
    useRol();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedRol(null);
  };

  const handleState = async (rol: Rol) => {
    await changeState(rol.id_rol);
  };

  const handleAddRol = async (rol: Rol) => {
    try {
      await addRol(rol);
      handleClose();
    } catch (error) {
      console.error("Error al agregar el rol:", error);
    }
  };

  const handleEdit = (rol: Rol) => {
    setSelectedRol(rol);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Rol>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (rol: Rol) => (
        <span>{new Date(rol.created_at).toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (rol: Rol) => (
        <span>{new Date(rol.updated_at).toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
      ),
    },
    { key: "estado", label:"Estado"}
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const rolesWithKey = roles
    ?.filter((rol) => rol?.id_rol !== undefined)
    .map((rol) => ({
      ...rol,
      key: rol.id_rol ? rol.id_rol.toString() : crypto.randomUUID(),
      estado: Boolean(rol.estado),
    }));
    

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Roles Registrados
      </h1>

      <Buton
        text="Nuevo rol"
        onPress={() => setIsOpen(true)}
        type="button"
        variant="solid"
        className="relative top-12 text-white bg-blue-700"
      />

      <Modall
        ModalTitle="Registrar Nuevo Rol"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="rol-form"
          addData={handleAddRol}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="rol-form"
          className="bg-blue-700 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Rol"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedRol && (
          <FormUpdate
            roles={rolesWithKey ?? []}
            rolId={selectedRol.id_rol}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {rolesWithKey && (
        <Globaltable
          data={rolesWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
        />
      )}
    </div>
  );
};
