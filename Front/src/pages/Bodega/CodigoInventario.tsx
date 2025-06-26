import { useEffect, useState } from "react";
import { useCodigoInventario } from "@/hooks/CodigoInventario/useCodigoInventario";
import { CodigoInventarioUpdate } from "@/schemas/CodigoInventario";
import Modall from "@/components/organismos/modal";
import Buton from "@/components/molecules/Button";
import { FormUpdate } from "@/components/organismos/CodigoInventario/FormUpdate";

type Props = {
  idInventario: number;
  onClose: () => void;
};

export const CodigoInventario = ({ idInventario, onClose }: Props) => {
  const { getCodigosPorInventario } = useCodigoInventario();
  const [codigos, setCodigos] = useState<CodigoInventarioUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [codigoIdSeleccionado, setCodigoIdSeleccionado] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarCodigos = () => {
    const data = getCodigosPorInventario(idInventario);
    console.log("🔍 Códigos encontrados por inventario:", data);
    setCodigos(data);
    setIsLoading(false);
  };

  const handleAbrirEdicion = (idCodigo: number) => {
    setCodigoIdSeleccionado(idCodigo);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setCodigoIdSeleccionado(null);
    setModalAbierto(false);
    cargarCodigos(); // Refrescar después de editar
  };

  useEffect(() => {
    cargarCodigos();
  }, [idInventario]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Códigos del Inventario</h2>

      {isLoading ? (
        <p>Cargando códigos...</p>
      ) : codigos.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay códigos registrados para este inventario.
        </p>
      ) : (
        <ul className="space-y-2">
          {codigos.map((codigo) => (
            <li
              key={codigo.idCodigoInventario}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{codigo.codigo}</span>
              <Buton
                text="Editar"
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                onPress={() => handleAbrirEdicion(codigo.idCodigoInventario!)}
              />
            </li>
          ))}
        </ul>
      )}

      <Modall
        ModalTitle="Editar Código"
        isOpen={modalAbierto}
        onOpenChange={handleCerrarModal}
      >
        {codigoIdSeleccionado !== null && (
          <FormUpdate
            codigos={codigos}
            codigoId={codigoIdSeleccionado}
            id="editar-codigo"
            onClose={handleCerrarModal}
          />
        )}
      </Modall>
    </div>
  );
};
