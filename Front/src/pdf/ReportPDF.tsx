import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";




const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    textAlign: "left",
  },
});

type Props = {
  title: string;
  headers: string[];
  accessors: string[];
  data: any[];
};

const ReportPDF = ({ title, headers, accessors, data }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.table}>
        {/* Encabezado */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {headers.map((h, i) => (
            <Text key={i} style={styles.tableCell}>{h}</Text>
          ))}
        </View>

        {/* Filas */}
        {data.map((row, i) => (
          <View key={i} style={styles.tableRow}>
            {accessors.map((acc, j) => (
              <Text key={j} style={styles.tableCell}>
                {row[acc]?.toString() || ""}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ReportPDF;