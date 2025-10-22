import { useState } from "react";
import { Calendar, CalendarRange, Mail, BarChart3, TrendingUp } from "lucide-react";
import api from "../../api/axiosInstance";
import Statistics from "../../components/admin/statistics/Statistics";
import "./Reports.css";

function Reports() {
  const [activeTab, setActiveTab] = useState("overview");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    from: "",
    to: "",
  });

  const handleSendReport = async () => {
    try {
      setLoading(true);
      setStatus("");

      if (activeTab === "day") {
        await api.get(
          `/reports/dayreport?year=${params.year}&month=${params.month}&day=${params.day}`
        );
      } else if (activeTab === "month") {
        await api.get(
          `/reports/sendmonthlyreport?year=${params.year}&month=${params.month}`
        );
      } else if (activeTab === "period") {
        const from = new Date(params.from);
        const to = new Date(params.to);
        await api.get(
          `/reports/sendweeklyreport?fromYear=${from.getFullYear()}&fromMonth=${
            from.getMonth() + 1
          }&fromDay=${from.getDate()}&tillYear=${to.getFullYear()}&tillMonth=${
            to.getMonth() + 1
          }&tillDay=${to.getDate()}`
        );
      }

      setStatus("Rapport skickad till admin-mailen!");
    } catch (err) {
      console.error(err);
      setStatus("Något gick fel. Kunde inte skicka rapporten.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Översikt", icon: <TrendingUp size={20} /> },
    { id: "day", label: "Dagsrapport", icon: <Calendar size={20} /> },
    { id: "month", label: "Månadsrapport", icon: <BarChart3 size={20} /> },
    { id: "period", label: "Periodrapport", icon: <CalendarRange size={20} /> },
  ];

  return (
    <div className="reports-page">
      <h1>Statistik & Rapporter</h1>
      <p className="subtitle">Statistik över försäljning, intäkter och ordrar. Skicka rapporter eller analysera din försäljning.</p>

      <div className="tabs-list reports-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-trigger ${activeTab === tab.id ? "tab-trigger-active" : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
              setStatus("");
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {/* Fetch statistics */}
        {activeTab === "overview" && <Statistics />}

        {/* Report - DAY */}
        {activeTab === "day" && (
          <div className="report-form">
            <h3>Dagsrapport</h3>
            <input
              type="number"
              value={params.year}
              onChange={(e) => setParams({ ...params, year: e.target.value })}
              placeholder="År"
            />
            <input
              type="number"
              value={params.month}
              onChange={(e) => setParams({ ...params, month: e.target.value })}
              placeholder="Månad"
            />
            <input
              type="number"
              value={params.day}
              onChange={(e) => setParams({ ...params, day: e.target.value })}
              placeholder="Dag"
            />
          </div>
        )}

        {/* Report - MONTH */}
        {activeTab === "month" && (
          <div className="report-form">
            <h3>Månadsrapport</h3>
            <input
              type="number"
              value={params.year}
              onChange={(e) => setParams({ ...params, year: e.target.value })}
              placeholder="År"
            />
            <input
              type="number"
              value={params.month}
              onChange={(e) => setParams({ ...params, month: e.target.value })}
              placeholder="Månad"
            />
          </div>
        )}

        {/* Report - PERIOD */}
        {activeTab === "period" && (
          <div className="report-form">
            <h3>Periodrapport</h3>
            <input
              type="date"
              value={params.from}
              onChange={(e) => setParams({ ...params, from: e.target.value })}
              placeholder="Från datum"
            />
            <input
              type="date"
              value={params.to}
              onChange={(e) => setParams({ ...params, to: e.target.value })}
              placeholder="Till datum"
            />
          </div>
        )}
      </div>

      {activeTab !== "overview" && (
        <div className="report-actions">
          <button className="send-btn" onClick={handleSendReport} disabled={loading}>
            <Mail className="icon" /> {loading ? "Skickar..." : "Skicka rapport till e-post"}
          </button>
        </div>
      )}

      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}

export default Reports;
