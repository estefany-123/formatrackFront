import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import Formulario from "@/components/organismos/Inventarios/FormRegister";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Inventario } from "@/types/Inventario";
import { FormUpdate } from "@/components/organismos/Inventarios/FormUpdate";

interface InventariosTableProps {
  inventarios?: Inventario[];
  idSitio?: number;
}

export const InventariosTable = ({ inventarios: inventariosProp, idSitio }: InventariosTableProps) => {
  const { inventarios: inventariosHook, isLoading, isError, error, addInventario, changeState } =
    useInventario();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedInventario, setSelectedInventario] =
    useState<Inventario | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedInventario(null);
  };

  const handleState = async (inventario: Inventario) => {
    await changeState(inventario.id_inventario);
  };

  const handleAddInventario = async (inventario: Inventario) => {
    try {
      await addInventario(inventario);
      handleClose();
    } catch (error) {
      console.error("Error al agregar al inventario:", error);
    }
  };

  const handleEdit = (inventario: Inventario) => {
    setSelectedInventario(inventario);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Inventario>[] = [
    { key: "stock", label: "Cantidad" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (inventario: Inventario) => (
        <span>
          {new Date(inventario.created_at).toLocaleDateString("es-ES")}
        </span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (inventario: Inventario) => (
        <span>
          {new Date(inventario.updated_at).toLocaleDateString("es-ES")}
        </span>
      ),
    },
    { key: "estado", label:"Estado"}
  ];

  if (isLoading && !inventariosProp) {
    return <span>Cargando datos...</span>;
  }

  if (isError && !inventariosProp) {
    return <span>Error: {error?.message}</span>;
  }

  const filtered = inventariosProp ?? inventariosHook;

  const InventariosWithKey = filtered
    ?.filter((inventario) => inventario?.id_inventario !== undefined && (idSitio ? inventario.fk_sitio === idSitio : true))
    .map((inventario) => ({
      ...inventario,
      key: inventario.id_inventario
        ? inventario.id_inventario.toString()
        : crypto.randomUUID(),
      estado: Boolean(inventario.estado),
    }));

  return (
    <div className="p-4">
      {!idSitio && (
        <h1 className="text-2xl font-bold mb-4 text-center">
          Inventarios Registrados
        </h1>
      )}

      
        <Buton
          text="Nuevo inventario"
          onPress={() => setIsOpen(true)}
          type="button"
          variant="solid"
          className="relative top-12 text-white bg-blue-700"
        />
      

      <Modall
        ModalTitle="Registrar Nuevo Inventario"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="inventario-form"
          addData={handleAddInventario}
          onClose={handleClose}
          idSitio={idSitio}
        />
        <button
          type="submit"
          form="inventario-form"
          className="bg-blue-700 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Usuario"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedInventario && (
          <FormUpdate
            inventarios={InventariosWithKey ?? []}
            inventarioId={selectedInventario.id_inventario}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {InventariosWithKey && (
        <Globaltable
          data={InventariosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
        />
      )}
    </div>
  );
};
