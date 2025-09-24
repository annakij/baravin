import DiscountCards from "./DiscountCards";
import "./DiscountCards.css";

function DiscountCardsContainer({ discounts }) {
  if (!discounts || discounts.length === 0) {
    return <p>Inga rabatter finns just nu.</p>;
  }

  return (
    <div className="discount-cards-grid">
      {discounts.map((d) => (
        <DiscountCards key={d.id || d.code} discount={d} />
      ))}
    </div>
  );
}

export default DiscountCardsContainer;
