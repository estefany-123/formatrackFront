import { PDFViewer, pdf, DocumentProps } from "@react-pdf/renderer";
 import Buton from "../molecules/Buton";
 import { saveAs } from 'file-saver';
 import { ReactElement } from "react";
 
 interface Props {
   component: ReactElement<DocumentProps>;
   onBack: () => void;
 }
 
 export const VisualizadorPDF = ({ component, onBack }: Props) => {
   const handleDownload = async () => {
     const blob = await pdf(component).toBlob();
     saveAs(blob, "reporte.pdf");
   };
 
   return (
     <div className="space-y-4">
       <div className="flex gap-4 mb-2">
         <Buton onPress={onBack} text="Volver reportes"/>
         <Buton onPress={handleDownload} text="Descargar PDF"/>
       </div>
 
       <PDFViewer style={{ width: "100%", height: "80vh" }} className="rounded-xl shadow-md">
         {component}
       </PDFViewer>
     </div>
   );
 };