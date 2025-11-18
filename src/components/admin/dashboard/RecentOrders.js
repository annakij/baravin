import "./Dashboard.css";
import api from "../../../api/axiosInstance";
import { useState, useEffect } from "react";

function RecentOrders() {
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await api.get("/orders/recent");
          setOrders(res.data)
        } catch (err) {
          console.error("Kunde inte hämta ordrar:", err);
        }
      };
  
      fetchOrders();
    }, []); 
  
    return (
      <div className="recent-orders">
        <h3>Senaste ordrarna</h3>
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <div>
                <p><strong>#{order.id}</strong></p>
                <p>{order.date ? new Date(order.date).toISOString().split("T")[0] : "Odefinierat datum"}</p>
                <p className="product-name">
                    {order.items && order.items.length > 0
                        ? order.items.map(i => i.name).join(" , ")
                        : "Inga produkter" }
                                </p>
              </div>
              <div>
                <p>{order.total ? `${order.total.toFixed(2)} kr` : "0.00 kr"}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default RecentOrders;
