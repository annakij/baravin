import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { ShoppingCart, Trash2 } from "lucide-react";
import ("./Cart.css");

function Cart () {

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get("/cart");
                setCart(res.data)
            }
            catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    if (loading) return <p>Laddar kundvagn...</p>;
    if (!cart || cart.cartItems.length === 0) return <p>Din kundvagn är tom.</p>;

    return (
        <div className="cart-container">
        <h1 className="cart-title">
          <ShoppingCart className="cart-icon" />
          Din kundvagn
        </h1>
  
        {/* Produkter */}
        <div className="cart-items">
          {cart.cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="cart-item-info">
                <img
                  src={`/images/regions/${item.wineBox.regionName}.png`}
                  alt={item.wineBox.name}
                  className="cart-item-image"
                />
                <div>
                  <h2 className="cart-item-name">{item.wineBox.name}</h2>
                  <p className="cart-item-sub">
                    Antal: {item.quantity} × {item.price} kr
                  </p>
                </div>
              </div>
              <div className="cart-item-actions">
                <span className="cart-item-price">
                  {item.quantity * item.price} kr
                </span>
                <button className="remove-btn">
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {/* Sammanställning */}
        <div className="cart-summary">
          <h2 className="summary-title">Orderöversikt</h2>
          <div className="summary-row">
            <span>Varor</span>
            <span>{cart.itemsCost} kr</span>
          </div>
          <div className="summary-row">
            <span>Moms</span>
            <span>{cart.moms} kr</span>
          </div>
          <div className="summary-row">
            <span>Frakt</span>
            <span>{cart.shipping} kr</span>
          </div>
          {cart.discounts?.length > 0 && (
            <div className="summary-row discount">
              <span>Rabatt</span>
              <span>
                -
                {cart.discounts.reduce((sum, d) => sum + d.amount, 0)} kr
              </span>
            </div>
          )}
          <hr />
          <div className="summary-total">
            <span>Totalt</span>
            <span>{cart.total} kr</span>
          </div>
          <button className="checkout-btn">Gå till kassan</button>
        </div>
      </div>
    )
}

export default Cart;