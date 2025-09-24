import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/get-all");
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta ordrar");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Laddar ordrar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recent-orders">
      <h1>Ordrar</h1>

      {/* Desktop Table */}
      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Datum</th>
              <th>Frakt</th>
              <th>Total</th>
              <th>Antal artiklar</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{order.shipping} kr</td>
                <td>{order.total} kr</td>
                <td>{order.items?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Display */}
      <div className="order-cards">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span>Order #{order.id}</span>
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="order-card-body">
              <p><strong>Frakt:</strong> {order.shipping} kr</p>
              <p><strong>Total:</strong> {order.total} kr</p>
              <p><strong>Antal artiklar:</strong> {order.items?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
