import DashboardCard from "./DashboardCard";
import { ShoppingCart, Users, Package, ReceiptText } from "lucide-react";
import api from "../../../api/axiosInstance";
import { useState, useEffect } from "react";

function DashboardOverview() {
  const [profiles, setProfiles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect (() => {
    const fetchData = async () => {
        try {
            const [profilesRes, regionsRes, ordersRes] = await Promise.all([
                api.get("/customer/profiles"),
                api.get("/regions"),
                api.get("orders/get-all")
            ]);
        setProfiles(profilesRes.data);
        setRegions(regionsRes.data);
        setOrders(ordersRes.data);
        } catch (error) {
            console.error("Fel vid hämtning av data till dashboard", error);
        }
    };
    fetchData();
  }, []);
  
  const countWineBoxes = () => {
    let total = 0;
    let available = 0;
  
    regions.forEach((region) => {
      region.wineries?.forEach((winery) => {
        winery.wineBoxes?.forEach((box) => {
          total += 1;
          if (box.availableQuantity > 0) {
            available += 1;
          }
        });
      });
    });
  
    return { total, available };
  };
  const { total, available } = countWineBoxes();

  const calculateRevenue = () => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  };


  return (
    <div className="overview-cards">
      <DashboardCard
        title="Registrerade Konton"
        value={profiles.length}
        color="orange"
        icon={<Users />}
      />
        <DashboardCard
        title="Tillgängliga Vinboxar"
        value={available}
        color="green"
        icon={<Package />}
        />
      <DashboardCard
        title="Ordrar"
        value={orders.length}
        color="blue"
        icon={<ShoppingCart />}
      />
      <DashboardCard
        title="Omsättning"
        value={`${calculateRevenue().toLocaleString()} kr`}
        color="green"
        icon={<ReceiptText />}
      />
    </div>
  );
}

export default DashboardOverview;
