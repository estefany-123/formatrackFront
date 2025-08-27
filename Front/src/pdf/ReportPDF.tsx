import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import LogoSena from "@/assets/sena.png"; // tu logo
import OtroIcono from "@/assets/Formatrack.png"; // otro icono cualquiera

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    textAlign: "center",
  },
  generatedInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    fontSize: 9,
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.5,
    fontSize: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 15,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#e4e4e4",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
    padding: 8,
    textAlign: "center",
    fontSize: 9,
  },
  logoLeft: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 50,
    height: 50,
  },
  logoRight: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 50,
    height: 50,
  },
  footer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#999",
    paddingTop: 8,
  },
});

type Props = {
  title: string;
  headers: string[];
  accessors: string[];
  data: any[];
  descripcion: string;
  beneficio: string;
  infoExtra: string;
  observacion: string;
  fechaGeneracion: string;
  usuario: string;
  logoIzq?: string;
  logoDer?: string;
};

const ReportPDF = ({
  title,
  headers,
  accessors,
  data,
  descripcion,
  beneficio,
  infoExtra,
  observacion,
  fechaGeneracion,
  usuario,
}: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image style={styles.logoLeft} src={LogoSena} />
      <Image style={styles.logoRight} src={OtroIcono} />

      <Text style={styles.title}>{title}</Text>

      {/* Generado por y fecha debajo del título */}
      <View style={styles.generatedInfo}>
        <Text>{` ${usuario}`}</Text>
        <Text>{`Fecha: ${fechaGeneracion}`}</Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: "bold" }}>Descripción:</Text> {descripcion}
      </Text>
      <Text style={styles.paragraph}>
        <Text style={{ fontWeight: "bold" }}>Beneficio:</Text> {beneficio}
      </Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          {headers.map((h, i) => (
            <Text key={i} style={styles.tableCell}>
              {h}
            </Text>
          ))}
        </View>

        {data.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            {accessors.map((acc, j) => (
              <Text key={j} style={styles.tableCell}>
                {Array.isArray(row[acc])
                  ? row[acc].join(", ")
                  : row[acc]?.toString() || ""}
              </Text>
            ))}
          </View>
        ))}
      </View>

      {/* Información adicional al final */}
      <View style={styles.footer}>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Información Adicional:</Text>{" "}
          {infoExtra}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={{ fontWeight: "bold" }}>Observación:</Text> {observacion}
        </Text>
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
