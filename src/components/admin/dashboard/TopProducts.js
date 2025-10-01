import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import "./Dashboard.css";

function TopProducts() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/get-all");
        const orders = res.data;

        const allItems = orders.flatMap(order => order.items || []);

        // Calculate top sales
        const salesMap = {};
        allItems.forEach(item => {
          const key = item.name; // name as key
          if (!salesMap[key]) {
            salesMap[key] = {
              name: item.name,
              price: item.price,
              sales: 0,
            };
          }
          salesMap[key].sales += item.quantity;
        });

        // Put in array and sort
        const sorted = Object.values(salesMap).sort((a, b) => b.sales - a.sales);

        // Top 5
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
