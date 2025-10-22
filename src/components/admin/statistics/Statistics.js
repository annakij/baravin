import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { ShoppingCart, Package, ChartColumnBig } from "lucide-react";
import api from "../../../api/axiosInstance";
import "./Statistics.css";
import DashboardCard from "../dashboard/DashboardCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Statistics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesRange, setSalesRange] = useState(3);

  const [dailySales, setDailySales] = useState(null);
  const [monthlyOrders, setMonthlyOrders] = useState(null);
  const [revenuePerProduct, setRevenuePerProduct] = useState(null);

  const [kpis, setKpis] = useState({
    totalOrders: 0,
    paidOrders: 0,
    avgOrderValue: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/get-all");
        const allOrders = res.data || [];
        setOrders(allOrders);
        buildKpis(allOrders);
        buildMonthlyOrders(allOrders);
        buildRevenueChart(allOrders);
      } catch (err) {
        console.error("Kunde inte hämta statistikdata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) buildDailySales(orders);
  }, [salesRange, orders]);

  // --- KPI ---
  const buildKpis = (orders) => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.statusId === 1).length;
    const avgOrderValue =
      totalOrders > 0
        ? orders.reduce((sum, o) => sum + o.total, 0) / totalOrders
        : 0;
    setKpis({ totalOrders, paidOrders, avgOrderValue });
  };

  // --- Daglig försäljning ---
  const buildDailySales = (orders) => {
    const today = new Date();
    const monthsAgo = new Date(today);
    monthsAgo.setMonth(today.getMonth() - salesRange);

    const filtered = orders.filter(
      (o) => new Date(o.date) >= monthsAgo && o.statusId === 1
    );

    const dailyMap = {};
    filtered.forEach((o) => {
      const key = new Date(o.date).toLocaleDateString("sv-SE");
      dailyMap[key] = (dailyMap[key] || 0) + o.total;
    });

    const labels = Object.keys(dailyMap).sort(
      (a, b) =>
        new Date(a.split("-").reverse().join("-")) -
        new Date(b.split("-").reverse().join("-"))
    );

    setDailySales({
      labels,
      datasets: [
        {
          label: `Försäljning (${salesRange} mån)`,
          data: labels.map((d) => dailyMap[d]),
          borderColor: "#b91c1c",
          backgroundColor: "rgba(185, 28, 28, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
        },
      ],
    });
  };

  // --- Månadsordrar ---
  const buildMonthlyOrders = (orders) => {
    const now = new Date();
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);

    const map = {};
    orders
      .filter((o) => new Date(o.date) >= yearAgo && o.statusId === 1)
      .forEach((o) => {
        const d = new Date(o.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        map[key] = (map[key] || 0) + 1;
      });

    const labels = Object.keys(map).sort();
    setMonthlyOrders({
      labels,
      datasets: [
        {
          label: "Antal ordrar",
          data: labels.map((l) => map[l]),
          backgroundColor: "#661a26",
        },
      ],
    });
  };

  // --- Intäkter per produkt ---
  const buildRevenueChart = (orders) => {
    const revenueMap = {};
    orders
      .filter((o) => o.statusId === 1)
      .forEach((o) => {
        o.items?.forEach((item) => {
          const key = item.name;
          revenueMap[key] =
            (revenueMap[key] || 0) + item.price * item.quantity;
        });
      });

    const top5 = Object.entries(revenueMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setRevenuePerProduct({
      labels: top5.map(([name]) => name),
      datasets: [
        {
          label: "Intäkter (kr)",
          data: top5.map(([_, val]) => val),
          backgroundColor: "#661a26",
        },
      ],
    });
  };

  if (loading) return <p>Laddar statistik...</p>;

  return (
    <div className="statistics">
        <div className="overview-cards">
            <DashboardCard
            title="Totalt antal ordrar"
            value={kpis.totalOrders}
            color="orange"
            icon={<ShoppingCart />}
        />
            <DashboardCard
            title="Betalda ordrar"
            value={kpis.paidOrders}
            color="green"
            icon={<Package />}
            />
        <DashboardCard
            title="Snittorder (kr)"
            value={Math.round(kpis.avgOrderValue).toLocaleString("sv-SE")}
            color="blue"
            icon={<ChartColumnBig />}
        />
        </div>

      {/* Diagram */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Försäljning</h3>
          <div className="range-buttons">
            {[1, 3, 6, 12].map((m) => (
              <button
                key={m}
                className={`range-btn ${salesRange === m ? "active" : ""}`}
                onClick={() => setSalesRange(m)}
              >
                {m} mån
              </button>
            ))}
          </div>
        </div>
        <div className="chart-wrapper">
          {dailySales ? (
            <Line
              data={dailySales}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { callback: (v) => `${v} kr` },
                  },
                },
              }}
            />
          ) : (
            <p>Ingen data</p>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Ordrar / månad</h3>
          <p className="subtitle">Totalt antal betalda ordrar från 12 månader bak.</p>
          {monthlyOrders ? (
            <div className="chart-wrapper">
              <Bar
                data={monthlyOrders}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          ) : (
            <p>Ingen data</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Topp 5 vinboxar</h3>
          <p className="subtitle">Mest sålda boxarna räknat utifrån intäkter från start.</p>
          {revenuePerProduct ? (
            <div className="chart-wrapper">
              <Bar
                data={revenuePerProduct}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>
          ) : (
            <p>Ingen data</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
