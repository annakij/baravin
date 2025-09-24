import { useState, useEffect } from "react";
import api from "../../api/axiosInstance.js";
import CustomerProfileCards from "../../components/admin/CustomerProfileCards.js";
import "./Customers.css";
import Loading from "../../components/admin/Loading.js";

function Customers() {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/customer/profiles");
        setProfiles(res.data);
        setFilteredProfiles(res.data);
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta kundprofiler");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = profiles.filter(p =>
      p.firstName?.toLowerCase().includes(term) ||
      p.lastName?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.mobile?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) 
    );
    setFilteredProfiles(filtered);
  }, [searchTerm, profiles]);

  if (loading) return < Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-customer-container">
      <div className="products-topbar">
        <h1>Kundinformation</h1>
        <input
          type="text"
          placeholder="Sök namn, e-post, mobil, stad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Desktop Table */}
      <div className="customer-table-wrapper desktop-only">
        {filteredProfiles.length === 0 ? (
          <p>Inga kundprofiler matchade din sökning.</p>
        ) : (
          <table className="customer-table">
            <thead>
              <tr>
                <th>Namn</th>
                <th>E-post</th>
                <th>Mobil</th>
                <th>Adress</th>
                <th>Postnummer</th>
                <th>Stad</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((p, index) => (
                <tr key={`${p.id}-${index}`}>
                  <td>{p.firstName} {p.lastName}</td>
                  <td>{p.email}</td>
                  <td>{p.mobile}</td>
                  <td>{p.address1}{p.address2 ? `, ${p.address2}` : ''}</td>
                  <td>{p.postalCode}</td>
                  <td>{p.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="mobile-only">
        <CustomerProfileCards profiles={filteredProfiles} />
      </div>
    </div>
  );
}

export default Customers;
