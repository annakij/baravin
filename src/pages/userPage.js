import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.js";
import Navbar from "../components/Navbar.js";
import Footer from "../components/Footer.js";
import "./UserPage.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.js";

function UserPage() {
    const { logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await api.get("/customer/profile"); 
          setUserData(res.data);
        } catch (err) {
          console.error(err);
          setError("Kunde inte hämta användardata.");
        } finally {
          setLoading(false);
        }
      };
      
      const fetchOrders = async () => {
        try {
          const res = await api.get("/orders");
          setOrders(res.data);
        } catch (err) {
          console.error("Kunde inte hämta ordrar", err);
        }
      };
      
      fetchProfile();
      fetchOrders();
    }, []);
  
    const handleLogout = () => {
      logout();       
      navigate("/privat");
    };
  
    if (loading) return <p>Laddar...</p>;
    if (error) return <p>{error}</p>;

  return (
    <>
    <h1 className="user-header">Hej {userData.firstName} {""} {userData.lastName}!</h1>
      <div className="userpage">

      <div className="orders-section">
            <legend>Dina föregående ordrar:</legend>
            <table className="orders-table">

            <thead>
                <tr>
                <th>Ordernr</th>
                <th>Produkter</th>
                <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? (
                orders.map((order) => (
                    <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                        {order.orderItems.map((item) => (
                        <div key={item.id}>
                            {item.wineBox?.name} x {item.quantity}
                        </div>
                        ))}
                    </td>
                    <td>{order.totalAmount} kr</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="4">Inga ordrar hittades.</td>
                </tr>
                )}
            </tbody>
            </table>
        </div>


        {/* Info-tabell */}
        <div className="profile-section">
        <legend>Dina uppgifter:</legend>
        <table className="user-table">
            <tbody className="user-body">
                <tr className="user-tablerow">
                 <td className="user-tableheader">E-post:</td>
                <td className="user-tablevalue">{userData.email}</td>
            </tr>
            <tr>
              <td className="user-tableheader">Adress:</td>
              <td className="user-tablevalue">{userData.address1}</td>
            </tr>
            <tr>
              <td className="user-tableheader"></td>
              <td className="user-tablevalue">{userData.postalCode} {""} {userData.city}</td>
            </tr>
            <tr>
              <td className="user-tableheader">C/O:</td>
              <td className="user-tablevalue">{userData.address2}</td>
            </tr>
            <tr>
              <td className="user-tableheader">Telefon:</td>
              <td className="user-tablevalue">{userData.mobile}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="user-buttonrow">
          <button
            className="user-button"
            onClick={() => alert("Ändra adress-funktion här")}
          >Ändra adress
          </button>
          <button
            className="user-button"
            onClick={handleLogout}
          >Byt lösenord
          </button>
          <button
            className="user-button"
            onClick={(e) => {
                e.preventDefault();
                logout();
              }}
          > Logga ut
          </button>
      </div>
    </>
  );
}

export default UserPage;
