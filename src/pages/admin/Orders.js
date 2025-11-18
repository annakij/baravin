import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import Loading from "../../components/admin/Loading";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // 🔹 Fetch all orders once
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/get-all");
        const data = res.data || [];
        setOrders(data);
        setFilteredOrders(data); // default view
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta ordrar");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 🔹 Filter orders when searchTerm changes
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    if (!term.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((o) => {
      const itemsMatch = o.items?.some((item) =>
        item.name?.toLowerCase().includes(term)
      );

      return (
        o.fullName?.toLowerCase().includes(term) ||
        o.city?.toLowerCase().includes(term) ||
        o.email?.toLowerCase().includes(term) ||
        o.mobile?.toLowerCase().includes(term) ||
        o.source?.toLowerCase().includes(term) ||
        getStatusName(o.statusId)?.toLowerCase().includes(term) ||
        itemsMatch
      );
    });

    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // 🔹 Helper for status text
  function getStatusName(statusId) {
    switch (statusId) {
      case 0: return "Pågående";
      case 1: return "Betald";
      case 2: return "Avbruten";
      case 3: return "Cancellerad";
      default: return "Okänd";
    }
  }

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  // 🔹 Sort filtered results by date
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="admin-orders">
      {/* 🔝 Topbar */}
      <div className="products-topbar">
        <h1 className="orders-header">Ordrar</h1>
        <input
          type="text"
          placeholder="Sök kund, status, artikel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* 🖥️ Desktop Table */}
      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Datum</th>
              <th>Kund</th>
              <th>Status</th>
              <th>Totalt</th>
              <th>Artiklar</th>
              <th>Källa</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{new Date(order.date).toLocaleDateString("sv-SE")}</td>
                <td>
                  <div className="order-customer">
                    <strong>{order.fullName}</strong>
                    <div className="order-customer-sub">
                      <span>{order.city}</span>
                      <br />
                      {order.email}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${order.statusId}`}>
                    {getStatusName(order.statusId)}
                  </span>
                </td>
                <td>{order.total.toLocaleString("sv-SE")} kr</td>
                <td className="order-items-cell">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, i) => (
                      <div key={i} className="order-item">
                        {item.name} <span className="qty">x{item.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <span className="no-items">–</span>
                  )}
                </td>
                <td>
                  <span
                    className={`source-badge ${
                      order.source === "webb" ? "source-web" : "source-app"
                    }`}
                  >
                    {order.source === "webb" ? "Webb" : "App"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Cards */}
      <div className="order-cards">
        {sortedOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <h3>#{order.id}</h3>
              <span>{new Date(order.date).toLocaleDateString("sv-SE")}</span>
            </div>
            <div className="order-card-body">
              <p>
                <strong>Kund:</strong> {order.fullName}
                <br />
                <span className="sub">{order.city}</span>
                <br />
                {order.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
              <span className={`status-badge status-${order.statusId}`}>
                    {getStatusName(order.statusId)}
                  </span>
              </p>
              <p><strong>Total:</strong> {order.total.toLocaleString("sv-SE")} kr</p>
              <p>
                <strong>Artiklar:</strong>{" "}
                {order.items?.length ? (
                  order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")
                ) : (
                  <span>Inga artiklar</span>
                )}
              </p>
              <p>
                <strong>Källa:</strong>{" "}
                <span
                  className={`source-badge ${
                    order.source === "webb" ? "source-web" : "source-app"
                    }`}
                  >
                    {order.source === "webb" ? "Webb" : "App"}
                </span>
              </p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
