import { useEffect, useState } from "react";
import DiscountCardsContainer from "../../components/admin/DiscountCardsContainer";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockDiscounts = [
    { id: 1, code: "HÖST2025", amount: 100, usageCount: 5, isValid: true },
    { id: 2, code: "VIN20", amount: 20, usageCount: 18, isValid: false },
    { id: 3, code: "MASSA200", amount: 200, usageCount: 5, isValid: true },
    { id: 4, code: "VINVINVIN", amount: 500, usageCount: 1, isValid: false },
    { id: 5, code: "VIN50", amount: 50, usageCount: 1, isValid: false },
    { id: 6, code: "HEJ200", amount: 200, usageCount: 90, isValid: false },
    { id: 7, code: "HEJ100", amount: 100, usageCount: 10, isValid: false }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDiscounts(mockDiscounts);
      setLoading(false);
    }, 500);
  }, []);

  // 👉 toggla rabatt
  const toggleDiscountValidity = (id) => {
    setDiscounts((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, isValid: !d.isValid } : d
      )
    );

    // här kan du senare lägga ett PUT-anrop till API:t
    // axios.put(`/discount/${id}`, { isValid: newValue });
  };

  if (loading) return <p>Laddar rabatter...</p>;
  if (discounts.length === 0) return <p>Inga rabatter hittades.</p>;

  return (
    <div className="discount-list">
      <h1>Rabattkoder</h1>
      <DiscountCardsContainer
        discounts={discounts}
        onToggle={toggleDiscountValidity}
      />
    </div>
  );
}

export default Discounts;
