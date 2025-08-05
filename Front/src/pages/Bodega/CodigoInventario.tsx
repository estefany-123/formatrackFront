import { useEffect, useState } from "react";
import { useCodigoInventario } from "@/hooks/CodigoInventario/useCodigoInventario";
import { CodigoInventarioUpdate } from "@/schemas/CodigoInventario";
import Modall from "@/components/organismos/modal";
import Buton from "@/components/molecules/Button";
import { FormUpdate } from "@/components/organismos/CodigoInventario/FormUpdate";

type Props = {
  idInventario: number;
  tieneCaracteristicas: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export const CodigoInventario = ({
  idInventario,
  tieneCaracteristicas,
  isOpen,
}: Props) => {
  const { codigos: codigosAll, getCodigosPorInventario } = useCodigoInventario();
  const [codigos, setCodigos] = useState<CodigoInventarioUpdate[]>([]);
  const [isLoadingCo, setIsLoading] = useState(true);
  const [codigoIdSeleccionado, setCodigoIdSeleccionado] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarCodigos = async () => {
    setIsLoading(true);
    try {
      const disponibles = getCodigosPorInventario(idInventario, codigosAll ?? []).filter(
        (c) => !c.uso
      );
      setCodigos(disponibles);
    } catch (error) {
      console.error("Error al cargar códigos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && tieneCaracteristicas) {
      cargarCodigos();
    }
  }, [idInventario, tieneCaracteristicas, isOpen, codigosAll]);

  const handleAbrirEdicion = (idCodigo: number) => {
    setCodigoIdSeleccionado(idCodigo);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setCodigoIdSeleccionado(null);
    setModalAbierto(false);
    cargarCodigos(); // Refrescar después de editar
  };

  if (!tieneCaracteristicas) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Códigos del Inventario</h2>

      {isLoadingCo ? (
        <p>Cargando códigos...</p>
      ) : codigos.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hay códigos registrados para este inventario.
        </p>
      ) : (
        <ul className="space-y-2">
          {codigos.map((codigo, index) => (
            <li
              key={codigo.idCodigoInventario ?? `temp-${index}`}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{codigo.codigo}</span>
              <Buton
                text="Editar"
                className="text-sm px-3 py-1 rounded-xl"
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
