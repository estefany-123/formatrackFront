import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useAreas } from "../../hooks/areas/useAreas"; 


Chart.register(...registerables);

const AreaEstadisticas = () => {
  // Obtenemos los datos de áreas y el estado de carga desde el hook
  const { areas, isLoading } = useAreas();

  // Si estamos cargando los datos, mostramos un mensaje de carga
  if (isLoading) return <p>Cargando...</p>;

  // Si no hay datos de áreas, mostramos un mensaje indicando que no hay datos
  if (!areas || areas.length === 0) return <p>No hay datos de áreas.</p>;

  // 🔢 Agrupar por sede
  const conteoPorSede: Record<string, number> = {};
  areas.forEach((area) => {
    const sedeKey = `Sede ${area.fk_sede}`; // Agrupar por sede
    conteoPorSede[sedeKey] = (conteoPorSede[sedeKey] || 0) + 1; // Contamos las áreas por sede
  });

  const sedes = Object.keys(conteoPorSede); // Obtener las sedes
  const cantidadesSedes = Object.values(conteoPorSede); // Obtener las cantidades de áreas por sede


  const mesesNombres = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];
  const conteoPorMes = new Array(12).fill(0); // Inicializamos el arreglo con 12 meses (todos en 0)
  areas.forEach((area) => {
    const fecha = new Date(area.created_at); // Convertimos la fecha a un objeto Date
    const mes = fecha.getMonth(); // Obtenemos el mes (0-11)
    conteoPorMes[mes]++; // Aumentamos el contador de áreas creadas ese mes
  });

  // Activas vs Inactivas
  const activas = areas.filter((a) => a.estado).length; // Contamos las áreas activas
  const inactivas = areas.length - activas; // Las inactivas son las restantes

  //  Datos para las gráficas
  const barData = {
    labels: sedes, // Las sedes como etiquetas
    datasets: [
      {
        label: "Áreas por sede",
        data: cantidadesSedes, // Los conteos de áreas por sede
        backgroundColor: "#60a5fa", // Color para las barras
      },
    ],
  };

  const lineData = {
    labels: mesesNombres, // Los nombres de los meses como etiquetas
    datasets: [
      {
        label: "Áreas creadas",
        data: conteoPorMes, // Los conteos de áreas creadas por mes
        borderColor: "#34d399", // Color de la línea
        fill: false, // No rellenamos el área debajo de la línea
      },
    ],
  };

  const pieData = {
    labels: ["Activas", "Inactivas"], // Etiquetas para el gráfico de pastel
    datasets: [
      {
        data: [activas, inactivas], // Datos para las áreas activas e inactivas
        backgroundColor: ["#4ade80", "#f87171"], // Colores del pastel (verde y rojo)
      },
    ],
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="bg-white dark:bg-zinc-800 dark:text-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Áreas por sede</h2>
        <Bar  data={barData} />
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Áreas creadas por mes</h2>
        <Line className="text-white" data={lineData} />
      </div>

      <div className="bg-white shadow rounded p-40 ">
        <h2 className="text-lg font-semibold mb-2">Distribución de estado</h2>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default AreaEstadisticas;
