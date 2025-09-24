import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../api/axiosInstance";
import { Plus, Minus, CircleX } from "lucide-react";
import "./Cart.css";

function Cart () {

  const { setCartCount } = useOutletContext();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
        setCart(res.data)
        updateCartCount(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

    useEffect(() => {
      fetchCart();
    }, []);

    const updateCartCount = (cartData) => {
      const totalItems = cartData?.cartItems?.reduce(
        (sum, item) => sum + item.quantity,
        0
      ) || 0;
      setCartCount(totalItems);
    };
    
    const removeFromCart = async (boxId) => {
      try {
        await api.delete(`/cart/${boxId}`);
        await fetchCart();
      } catch (err) {
        console.error("Remove from cart failed", err);
      }
    };

    const updateQuantity = async (boxId, newQuantity) => {
      try {
        await api.put(`/cart/${boxId}?quantity=${newQuantity}`);
        await fetchCart();
      } catch (err) {
        console.error("Failed to update quantity", err);
      }
    };

    if (loading) return <p>Laddar kundvagn...</p>;
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
        <h1 className="cart-title">
          Din kundvagn
        </h1>
  
        {/* Produkter */}
        <div className="cart-items">
          {cart.cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-info">

                <div>
                  <h2 className="cart-item-name">{item.wineBox.name}</h2>
                  <p className="cart-item-sub">
                    Antal: {item.quantity} × {item.price / item.quantity} kr
                  </p>
                <div className="quantity-controls">
                  <a
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.wineBox.id, item.quantity - 1)}
                    disabled={item.quantity <= 1} // disable if quantity is 1
                  >
                    <Minus size={16} />
                  </a>
                  <span className="quantity-value">{item.quantity}</span>
                  <a
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.wineBox.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </a>
                </div>
                </div>
              </div>
              <div className="cart-item-actions">

              <span className="cart-item-price">
                {item.price} kr
              </span>
                <a className="remove-btn" onClick={() => removeFromCart(item.wineBox.id)}>
                  <CircleX />
                </a>
              </div>
            </div>
          ))}
        </div>
  
        {/* Sammanställning */}
        <div className="cart-summary">
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
            <span>Inkluderat</span>
          </div>
          {cart.discount && (
            <div className="summary-row discount">
              <span>Rabatt:</span>
              <span>
                -
                {cart.discount.amount} kr
              </span>
            </div>
          )}
          <hr />
          <div className="summary-total">
            <span>Totalt</span>
            <span>{cart.total} kr</span>
          </div>
          <button className="checkout-btn" onClick={() => navigate("/kassa")}>Gå till kassan</button>
        </div>
      </div>
    )
}

export default Cart;