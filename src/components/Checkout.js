import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import "./Cart.css";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editAddress, setEditAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({});
  const [addressDirty, setAddressDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [processing, setProcessing] = useState(false);
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

  const fetchProfile = async () => {
    try {
      const res = await api.get("/customer/profile");
      setProfile(res.data);
      setAddressForm(res.data);
    } catch (err) {
      console.error("Kunde inte hämta kundprofil:", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchCart(), fetchProfile()]);
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

  const handleSaveAddress = async () => {
    try {
      await api.put("/customer/profile", addressForm);
      setProfile(addressForm);
      setEditAddress(false);
      setAddressDirty(false);
    } catch (err) {
      console.error("Kunde inte spara adress:", err);
      alert("Kunde inte spara adressen.");
    }
  };

  const handleCheckout = async () => {
    if (addressDirty) return; // adress must be saved first
    try {
      setProcessing(true);
      setError("");

      const res = await api.post("/orders");
      const { token } = res.data;
      if (!token) throw new Error("Saknar Swish-token i svaret");

      window.location.href = `swish://paymentrequest?token=${token}`;
    } catch (err) {
      console.error("Checkout failed", err);
      setError("Något gick fel vid betalningen. Försök igen.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !profile) return <p>Laddar kassan...</p>;
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
      {/* 🚚 Leveransadress */}
      <div className="delivery-section">
        <div className="delivery-header">
          <h2>Leveransinformation ({profile.email})</h2>
        </div>

        {!editAddress ? (
          <div className="address-view">
            <p>{profile.firstName} {profile.lastName}</p>
            <p>{profile.address1}</p>
            {profile.address2 && <p>{profile.address2}</p>}
            <p>{profile.postalCode} {profile.city}</p>

          <div className="link-button-wrapper">
            <a
              className="link-button"
              onClick={() => setEditAddress(true)}
            >
              Ändra adress
            </a>
          </div>
          </div>
        ) : (
          <div className="address-form">
            <input
              type="text"
              placeholder="Förnamn"
              value={addressForm.firstName || ""}
              onChange={(e) => {
                setAddressForm((p) => ({ ...p, firstName: e.target.value }));
                setAddressDirty(true);
              }}
            />
            <input
              type="text"
              placeholder="Efternamn"
              value={addressForm.lastName || ""}
              onChange={(e) => {
                setAddressForm((p) => ({ ...p, lastName: e.target.value }));
                setAddressDirty(true);
              }}
            />
            <input
              type="text"
              placeholder="Adress 1"
              value={addressForm.address1 || ""}
              onChange={(e) => {
                setAddressForm((p) => ({ ...p, address1: e.target.value }));
                setAddressDirty(true);
              }}
            />
            <input
              type="text"
              placeholder="Adress 2 (valfritt)"
              value={addressForm.address2 || ""}
              onChange={(e) => {
                setAddressForm((p) => ({ ...p, address2: e.target.value }));
                setAddressDirty(true);
              }}
            />
            <div className="address-row">
              <input
                type="text"
                placeholder="Postnummer"
                value={addressForm.postalCode || ""}
                onChange={(e) => {
                  setAddressForm((p) => ({ ...p, postalCode: e.target.value }));
                  setAddressDirty(true);
                }}
              />
              <input
                type="text"
                placeholder="Stad"
                value={addressForm.city || ""}
                onChange={(e) => {
                  setAddressForm((p) => ({ ...p, city: e.target.value }));
                  setAddressDirty(true);
                }}
              />
            </div>
            <div className="address-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setAddressForm(profile);
                  setEditAddress(false);
                  setAddressDirty(false);
                }}
              >
                Avbryt
              </button>
              <button className="save-btn" onClick={handleSaveAddress}>
                Spara adress
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🧾 Orderöversikt */}
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
            <button className="discount-btn" onClick={handleApplyDiscount}>Lägg till</button>
          </div>
        )}
        {error && <span className="error-text">{error}</span>}

        <hr />
        <div className="summary-total">
          <span>Totalt</span>
          <span>{cart.total} kr</span>
        </div>

        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={processing || addressDirty}
        >
          {processing
            ? "Initierar Swish..."
            : addressDirty
            ? "Spara ändringar först"
            : "Betala (Swish)"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
