import DiscountCards from "./DiscountCards";
import "./DiscountCards.css";

function DiscountCardsContainer({ discounts, onToggle }) {
  if (!discounts || discounts.length === 0) {
    return <p>Inga rabatter finns just nu.</p>;
  }

  return (
    <div className="discount-cards-grid">
      {discounts.map((d) => (
        <DiscountCards
          key={d.id}
          discount={d}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export default DiscountCardsContainer;

