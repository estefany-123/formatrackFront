import { Bar,Pie,Line } from "react-chartjs-2";
import { Chart,registerables } from "chart.js";
import  {usePrograma} from '../../hooks/programas/usePrograma' 


Chart.register(...registerables);

const ProgramaEstadisticas = ()=>{
    const {programas,isLoading} =usePrograma();
    if(isLoading) return <p>cargando...</p>;

    if(!programas || programas.length === 0) return <p>no hay datos de programas de formación</p>;

    const conteoPorArea: Record<string,number>={};
    programas.forEach((programa)=>{
        const programaKey =`area ${programa.fk_area}`;
        conteoPorArea[programaKey]=(conteoPorArea[programaKey]||0)+1;
    })
    const areas= Object.keys(conteoPorArea);
    const cantidadesAreas = Object.values(conteoPorArea);

    
    const mesesNombres = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
      ];
      const conteoPorMes = new Array(12).fill(0); 
    programas.forEach((programa) => {
    const fecha = new Date(programa.created_at); 
    const mes = fecha.getMonth(); 
    conteoPorMes[mes]++;
  });

    const barData={
        labels:areas,
        datasets:[
        {
            label:"programas por area",
            data: cantidadesAreas,
            backgroundColor: "#60a5fa",
        },
           
        ],


    };

    const lineData = {
        labels: mesesNombres,
        datasets: [
          {
            label: "Programas creados",
            data: conteoPorMes, 
            borderColor: "#34d399", 
            fill: false, 
          },
        ],
      };

      const activas = programas.filter((a) => a.estado).length; 
      const inactivas = programas.length - activas; 
    

      const pieData = {
        labels: ["Activas", "Inactivas"], 
        datasets: [
          {
            data: [activas, inactivas], 
            backgroundColor: ["#4ade80", "#f87171"], 
          },
        ],
      };



    return (
        <div  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">programas por area</h2>
        <Bar data={barData} />
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Programas de formación  creados por mes</h2>
        <Line data={lineData} />
      </div>
      <div className="bg-white shadow rounded p-40 ">
        <h2 className="text-lg font-semibold mb-2">Distribución de estado</h2>
        <Pie data={pieData} />
      </div>
        </div>

    );
};

export default ProgramaEstadisticas;