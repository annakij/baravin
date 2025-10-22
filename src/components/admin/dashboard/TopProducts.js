import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import "./Dashboard.css";

function TopProducts() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/get-all");
        const allOrders = res.data || [];

        // Take statistics from last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentOrders = allOrders.filter(
          (o) => new Date(o.date) >= sixMonthsAgo
        && o.statusId === 1);

        const productCounts = {};

        recentOrders.forEach((order) => {
          order.items?.forEach((item) => {
            if (!productCounts[item.name]) {
              productCounts[item.name] = { 
                name: item.name, 
                quantity: 0,
                price: item.price
              };
            }
        
            productCounts[item.name].quantity += item.quantity;
          });
        });
        
        // Sort after most sold
        const sorted = Object.values(productCounts)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 10);

        setTopProducts(sorted);
      } catch (err) {
        console.error("Kunde inte hämta topprodukter:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="top-products">
      <h3>Bästsäljare (6 mån)</h3>
      <ul>
        {topProducts.map((product, i) => (
          <li key={product.name}>
            <div>
              <span className="rank">{i + 1}</span>
              <div>
                <p>{product.name}</p>
                <p className="sub">{product.quantity} sålda</p>
              </div>
            </div>
            <div>
              <p>{product.price} kr</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopProducts;
