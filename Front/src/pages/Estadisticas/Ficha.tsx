import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useFichas } from "../../hooks/fichas/useFichas";
import { ChartData } from "chart.js";  // Asegúrate de importar ChartData

Chart.register(...registerables);

const EstadisticasFichas = () => {
  const { fichas, isLoading } = useFichas();

  if (isLoading) return <p>Cargando...</p>;
  if (!fichas || fichas.length === 0) return <p>No hay datos de fichas.</p>;

  const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const conteoPorMes = new Array(12).fill(0);
  const conteoActivasPorMes = new Array(12).fill(0);
  const conteoInactivasPorMes = new Array(12).fill(0);
  const conteoPorPrograma: { [key: number]: number } = {};

  // Contar fichas activas e inactivas por mes, y total por programa
  fichas.forEach((ficha) => {
    const fecha = new Date(ficha.created_at);
    const mes = fecha.getMonth();
    conteoPorMes[mes]++;
    if (ficha.estado) conteoActivasPorMes[mes]++;
    else conteoInactivasPorMes[mes]++;
    
    // Contar fichas por programa
    if (conteoPorPrograma[ficha.fk_programa]) {
      conteoPorPrograma[ficha.fk_programa]++;
    } else {
      conteoPorPrograma[ficha.fk_programa] = 1;
    }
  });

  // 1. Gráfico de barras (Total de fichas por mes)
  const barData = {
    labels: mesesNombres,
    datasets: [
      {
        label: "Total de fichas",
        data: conteoPorMes,
        backgroundColor: "#34d399",
      },
    ],
  };

  // 2. Gráfico de Pastel (Distribución activa/inactiva)
  const pieData = {
    labels: ["Activas", "Inactivas"],
    datasets: [
      {
        data: [
          fichas.filter((ficha) => ficha.estado).length,
          fichas.filter((ficha) => !ficha.estado).length,
        ],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };

  // 3. Gráfico de líneas (Fichas activas vs. inactivas por mes)
  const lineData: ChartData<"line", any[], string> = {
    labels: mesesNombres,
    datasets: [
      {
        label: "Fichas activas",
        data: conteoActivasPorMes,
        borderColor: "#34d399",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Fichas inactivas",
        data: conteoInactivasPorMes,
        borderColor: "#e11d48",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  // 4. Gráfico de barras (Total de fichas por programa)
  const programData = {
    labels: Object.keys(conteoPorPrograma).map((key) => `Programa ${key}`),
    datasets: [
      {
        label: "Total de fichas por programa",
        data: Object.values(conteoPorPrograma),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* 1. Gráfico de barras - Total de fichas por mes */}
      <div className="bg-white shadow rounded p-4 w-full md:w-2/3 mx-auto">
        <h2 className="text-lg font-semibold mb-2">Total de fichas por mes</h2>
        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>

      {/* 2. Gráfico de Pastel - Distribución activa/inactiva */}
      <div className="bg-white shadow rounded p-4 w-full md:w-1/3 mx-auto">
        <h2 className="text-lg font-semibold mb-2">Distribución de estado de las fichas</h2>
        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>

      {/* 3. Gráfico de líneas - Fichas activas vs inactivas por mes */}
      <div className="bg-white shadow rounded p-4 w-full md:w-2/3 mx-auto">
        <h2 className="text-lg font-semibold mb-2">Fichas activas vs inactivas por mes</h2>
        <Line data={lineData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>

      {/* 4. Gráfico de barras - Fichas por programa */}
      <div className="bg-white shadow rounded p-4 w-full md:w-2/3 mx-auto">
        <h2 className="text-lg font-semibold mb-2">Fichas por programa</h2>
        <Bar data={programData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div>
    </div>
  );
};

export default EstadisticasFichas;
