import "./DiscountCards.css";

function DiscountCards({ discount, onToggle }) {
  const isValid = discount.isValid;

  return (
    <div
      className={`discount-card ${isValid ? "valid" : "invalid"}`}
      onClick={() => onToggle(discount.id)}
      style={{ cursor: "pointer" }}
    >
      <div className="discount-header">
        <span className="discount-code">{discount.code}</span>
      </div>
      <div className="discount-body">
        <div className="discount-info">
          Använd: {discount.usageCount}
        </div>
        <div className="discount-amount">
          {discount.amount} kr
        </div>
      </div>
    </div>
  );
}

export default DiscountCards;
