import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/molecules/modal";
import Formulario from "@/components/organismos/permisos/FormRegister";
import { useState } from "react";
import { Permisos } from "@/types/permisos";
import { usePermisos } from "@/hooks/permisos/usePermisos";
import { FormUpdate } from "@/components/organismos/permisos/Formupdate";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

const PermisoTable = () => {
  const { permiso, isLoading, isError, error, addPermiso } = usePermisos();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedPermisos, setSelectedPermiso] = useState<Permisos | null>(
    null
  );

  const navigate = useNavigate();

  const handleGoToModulo = () => {
    navigate("/admin/modulos");
  };

  const handleGoToRuta = () => {
    navigate("/admin/rutas");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedPermiso(null);
  };

  const handleAddUser = async (permiso: Permisos) => {
    try {
      await addPermiso(permiso);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el permiso:", error);
    }
  };

  const handleEdit = (permiso: Permisos) => {
    setSelectedPermiso(permiso);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Permisos>[] = [
    { key: "permiso", label: "permiso" },
    {
          key: "createdAt",
          label: "Fecha Creacion",
          render: (permisos: Permisos) => (
            <span>
              {permisos.createdAt
                ? new Date(permisos.createdAt).toLocaleDateString("es-ES", {
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
          render: (permisos: Permisos) => (
            <span>
              {permisos.updatedAt
                ? new Date(permisos.updatedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "N/A"}
            </span>
          ),
        },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const PermisoWithKey = permiso
    ?.filter((permiso) => permiso?.idPermiso !== undefined)
    .map((permiso) => ({
      ...permiso,
      key: permiso.idPermiso
        ? permiso.idPermiso.toString()
        : crypto.randomUUID(),
      estado: Boolean(permiso.idPermiso),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Permisos</h1>
              <div className="flex gap-2">
                <Buton text="Gestionar Modulos" onPress={handleGoToModulo} />
                <Buton text="Gestionar Rutas" onPress={handleGoToRuta} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar permiso"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="permiso-form"
          addData={handleAddUser}
          onClose={handleClose}
        />
        <div className="justify-center pt-2">
          <Buton
            text="Guardar"
            type="submit"
            form="permiso-form"
            className="w-full rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar permiso"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedPermisos && (
          <FormUpdate
            permisos={PermisoWithKey ?? []}
            permisoId={selectedPermisos.idPermiso as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {PermisoWithKey && (
        <Globaltable
          data={PermisoWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={() => {}}
          extraHeaderContent={
            <Buton text="Añadir permiso" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};

export default PermisoTable;
