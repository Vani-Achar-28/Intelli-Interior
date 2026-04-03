import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminCharts({ stats }) {
  const pieData = {
    labels: ["Planning", "In Progress", "Completed"],
    datasets: [{
      data: [stats.planning || 0, stats.ongoing || 0, stats.completed || 0],
      backgroundColor: ["#e8c49a", "#4a7c5f", "#7a3b1e"],
      borderColor: "#fff",
      borderWidth: 2,
    }],
  };

  const barData = {
    labels: ["Users", "Projects"],
    datasets: [{
      label: "Count",
      data: [stats.users || 0, stats.projects || 0],
      backgroundColor: ["#4a7c5f", "#7a3b1e"],
      borderRadius: 8,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#2d4a3e", font: { family: "Jost" } } },
    },
    scales: {
      x: { ticks: { color: "#4a6358" }, grid: { color: "rgba(0,0,0,0.04)" } },
      y: { ticks: { color: "#4a6358" }, grid: { color: "rgba(0,0,0,0.04)" } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#2d4a3e", font: { family: "Jost" } } },
    },
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Users vs Projects</h3>
        <div className="chart-box">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      <div className="chart-card">
        <h3>Project Status</h3>
        <div className="chart-box">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}

export default AdminCharts;