import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import "./Dashboard.css";

function TopProducts() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/get-all"); // eller vilken endpoint du har
        const orders = res.data;

        // 1. Platta ut alla items från alla ordrar
        const allItems = orders.flatMap(order => order.items || []);

        // 2. Räkna antal sales per produktnamn
        const salesMap = {};
        allItems.forEach(item => {
          const key = item.name; // använder namn som nyckel
          if (!salesMap[key]) {
            salesMap[key] = {
              name: item.name,
              price: item.price,
              sales: 0,
            };
          }
          salesMap[key].sales += item.quantity;
        });

        // 3. Gör om till array och sortera
        const sorted = Object.values(salesMap).sort((a, b) => b.sales - a.sales);

        // 4. Ta topp 5
        setTopProducts(sorted.slice(0, 5));
      } catch (err) {
        console.error("Kunde inte hämta ordrar:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="top-products">
      <h3>Top Products</h3>
      <ul>
        {topProducts.map((product, i) => (
          <li key={product.name}>
            <div>
              <span className="rank">{i + 1}</span>
              <div>
                <p>{product.name}</p>
                <p className="sub">{product.sales} sålda</p>
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
