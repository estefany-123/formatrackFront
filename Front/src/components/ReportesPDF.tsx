
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  extraInfo: { fontSize: 12, marginBottom: 20, fontStyle: "italic" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    borderBottom: "1pt solid #eee",
    paddingBottom: 2,
  },
  cell: {
    fontSize: 11,
    width: "45%", // ajusta si hay muchas columnas
  },
});

type Props = {
  tipo: string;
  data: any[];
};

const textoExtraPorTipo: Record<string, string> = {
  sitios: "Este reporte muestra los sitios con mayor cantidad de stock registrados en el sistema.",
  usuarios: "Este reporte presenta los usuarios que han realizado más movimientos de inventario.",
  caducar: "Listado de elementos que están próximos a vencer en los próximos 30 días.",
  historial: "Historial detallado de movimientos realizados en el rango de fechas seleccionado.",
};

export const ReportesPDF: React.FC<Props> = ({ tipo, data }) => {
  const extraInfo = textoExtraPorTipo[tipo] ?? "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte: {formatear(tipo)}</Text>

        {extraInfo && <Text style={styles.extraInfo}>{extraInfo}</Text>}

        {data.length === 0 ? (
          <Text>No hay datos disponibles.</Text>
        ) : (
          <>
            {/* Cabecera de la tabla */}
            <View style={styles.row}>
              {Object.keys(data[0]).map((key) => (
                <Text key={key} style={{ ...styles.cell, fontWeight: "bold" }}>
                  {formatear(key)}
                </Text>
              ))}
            </View>

            {/* Filas de datos */}
            {data.map((item, i) => (
              <View key={i} style={styles.row}>
                {Object.keys(item).map((key) => (
                  <Text key={key} style={styles.cell}>
                    {String(item[key])}
                  </Text>
                ))}
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};

const formatear = (clave: string) =>
  clave.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
