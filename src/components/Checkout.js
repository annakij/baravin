import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import "./Cart.css";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleApplyDiscount = async () => {
    try {
      setError("");
      await api.post("/cart/apply-discount", discountCode);
      setDiscountCode("");
      await fetchCart();
    } catch (err) {
      console.error(err);
      setError("Rabattkod finns ej");
    }
  };

  const handleRemoveDiscount = async (code) => {
    try {
      await api.delete(`/cart/remove-discount/${code}`);
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    try {
        await api.post("/orders");

    } catch (err) {
        console.error("Checkout failed", err);
    }
  };

  if (loading) return <p>Laddar kassan...</p>;
  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Din kundvagn är tom</h2>
        <p>Lägg till några produkter för att komma igång.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-summary">
        <h2 className="summary-title">Orderöversikt</h2>
        <div className="cart-items">
          {cart.cartItems.map((item, index) => (
            <div key={index} className="summary-row">
              <div className="cart-item-info">
                <h2 className="cart-item-name">
                  {item.wineBox.name} x {item.quantity}
                </h2>
              </div>
              <div className="cart-item-actions">
                <span className="cart-item-price">{item.price} kr</span>
              </div>
            </div>
          ))}
        </div>
        <hr />

        <div className="summary-row">
          <span>Pris:</span>
          <span>{cart.itemsCost} kr</span>
        </div>
        <div className="summary-row">
          <span>Varav moms / skatt:</span>
          <span>{cart.moms} kr</span>
        </div>
        <div className="summary-row">
          <span>Frakt:</span>
          <span>Inkluderad</span>
        </div>

        {/* Discount Row */}
        {cart.discount ? (
          <div>
            <div className="summary-row discount">
              <span>Rabattkod:</span>
              <span>-{cart.discount.amount} kr</span>
            </div>
            <div className="discount-tag">
              <span>{cart.discount.code}</span>
              <a
                className="remove-discount"
                onClick={() => handleRemoveDiscount(cart.discount.code)}
              >
                ✕
              </a>
            </div>
          </div>
        ) : (
          <div className="discount-input-row">
            <input
              type="text"
              placeholder="Rabattkod"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                setError("");
              }}
            />
            <button onClick={handleApplyDiscount}>Lägg till</button>
          </div>
        )}
        {error && <span className="error-text">{error}</span>}

        <hr />
        <div className="summary-total">
          <span>Totalt</span>
          <span>{cart.total} kr</span>
        </div>
        <button className="checkout-btn">Betala (Swish)</button>
      </div>
    </div>
  );
}

export default Checkout;
