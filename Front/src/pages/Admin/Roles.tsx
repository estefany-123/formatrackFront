import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useRol } from "@/hooks/Roles/useRol";
import Formulario from "@/components/organismos/Roles/FormRegister";
import { FormUpdate } from "@/components/organismos/Roles/FormUpdate";
import { Rol } from "@/types/Rol";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export const RolTable = () => {
  const { roles, isLoading, isError, error, addRol, changeState } = useRol();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

  const navigate = useNavigate();

  const handleGoToUsuario = () => {
    navigate("/admin/usuarios");
  };
  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedRol(null);
  };

  const handleState = async (idRol: number) => {
    await changeState(idRol);
  };

  const handleAddRol = async (data: Rol) => {
    try {
      await addRol(data);
      handleClose();
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  const handleEdit = (rol: Rol) => {
    if (!rol || !rol.idRol) {
      return;
    }
    setSelectedRol(rol);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Rol>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "createdAt",
      label: "Fecha CReacion",
      render: (rol: Rol) => (
        <span>
          {rol.createdAt
            ? new Date(rol.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Fecha Actualización",
      render: (rol: Rol) => (
        <span>
          {rol.updatedAt
            ? new Date(rol.updatedAt).toLocaleDateString("es-ES", {
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

  const rolesWithKey = roles
    ?.filter(
      (rol) => rol?.idRol !== undefined && rol?.createdAt && rol?.updatedAt
    )
    .map((rol) => ({
      ...rol,
      key: rol.idRol ? rol.idRol.toString() : crypto.randomUUID(),
      idRol: rol.idRol || 0,
      estado: Boolean(rol.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Roles</h1>
              <div className="flex gap-2">
                <Button
                  className="text-white bg-blue-700"
                  onPress={handleGoToUsuario}
                >
                  Usuarios
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
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
        <Button
          type="submit"
          form="rol-form"
          className="bg-blue-700 text-white p-2 rounded-xl"
        >
          Guardar
        </Button>
      </Modall>

      <Modall
        ModalTitle="Editar Rol"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedRol && (
          <FormUpdate
            roles={rolesWithKey ?? []}
            rolId={selectedRol.idRol as number}
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
          onDelete={(rol) => handleState(rol.idRol)}
          extraHeaderContent={
            <Buton text="Nuevo rol" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};
