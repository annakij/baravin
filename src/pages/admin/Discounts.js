import { useEffect, useState } from "react";
import DiscountCardsContainer from "../../components/admin/DiscountCardsContainer";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockDiscounts = [
    {
      id: 1,
      code: "HÖST2025",
      amount: 100,
      usageCount: 5,
      isValid: true,
      orders: [{ id: 101 }, { id: 102 }]
    },
    {
      id: 2,
      code: "VIN20",
      amount: 20,
      usageCount: 18,
      isValid: false,
      orders: []
    },
    {
      id: 3,
      code: "MASSA200",
      amount: 200,
      usageCount: 5,
      isValid: true,
      orders: [{ id: 109 }]
    },
    {
      id: 4,
      code: "VINVINVIN",
      amount: 500,
      usageCount: 1,
      isValid: true,
      orders: [{ id: 10 }]
    },
    {
      id: 5,
      code: "HEJ100",
      amount: 100,
      usageCount: 1,
      isValid: true,
      orders: [{ id: 103 }]
    },
    {
      id: 3,
      code: "MASSA200",
      amount: 200,
      usageCount: 5,
      isValid: false,
      orders: [{ id: 109 }]
    },
    {
      id: 4,
      code: "VINVINVIN",
      amount: 500,
      usageCount: 1,
      isValid: true,
      orders: [{ id: 10 }]
    },
    {
      id: 5,
      code: "HEJ100",
      amount: 100,
      usageCount: 1,
      isValid: false,
      orders: [{ id: 103 }]
    }
  ];

  useEffect(() => {
    // Simulerar API-anrop
    const fetchMock = () => {
      setTimeout(() => {
        setDiscounts(mockDiscounts);
        setLoading(false);
      }, 500); // 0.5 sek delay
    };

    fetchMock();
  }, []);

//   useEffect(() => {
//     axios.get("/discount")
//       .then((res) => {
//         setDiscounts(res.data);
//       })
//       .catch((err) => {
//         console.error("Fel vid hämtning av rabatter:", err);
//       })
//       .finally(() => setLoading(false));
//   }, []);

  if (loading) return <p>Laddar rabatter...</p>;
  if (discounts.length === 0) return <p>Inga rabatter hittades.</p>;

  return (
    <div className="discount-list">
        <h1>Rabattkoder</h1>
        <DiscountCardsContainer discounts={discounts} />
    </div>
  );
}

export default Discounts;
