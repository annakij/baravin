import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import { Settings } from "lucide-react";
import "./Products.css"
import Loading from "../Loading";

function WineryTable ({ onEditWinery }) {
    const [regions, setRegions] = useState([]);
    const [filteredRegions, setFilteredRegions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegions = async () => {
        try {
            const res = await api.get("/regions");
            setRegions(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchRegions();
    }, []);

    // Search bar
    useEffect(() => {
      const term = searchTerm.toLowerCase();
  
      const filtered = regions
    .map(region => {
      const filteredWineries = region.wineries.filter(winery => {
        const matchesWinery =
          winery.name?.toLowerCase().includes(term) ||
          winery.address?.toLowerCase().includes(term) ||
          winery.email?.toLowerCase().includes(term) ||
          winery.phone?.toLowerCase().includes(term);

        return matchesWinery;
      });

      return { ...region, wineries: filteredWineries };
    })
    .filter(region => region.wineries.length > 0);
  
      setFilteredRegions(filtered);
    }, [searchTerm, regions]);

    if (loading) return < Loading />;
    if (error) return <p style={{ color: "red" }}>Fel: {error}</p>;

    return (
      <>
      <input
                type="text"
                placeholder="Sök efter vingård..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
        <div className="top-products">
          {filteredRegions.map((region) => (
            <div key={region.name}>
              <h3>{region.name}</h3>
              <ul>
                {region.wineries.map((winery) => (
                  <li key={winery.name}>
                    <div>
                      <p><strong>{winery.name}</strong></p>
                      <p className="sub">{winery.address}</p>
                      <p className="sub">{winery.email}</p>
                      <p className="sub">{winery.phone}</p>
                    </div>
                    <div>
                      <a className="winery-edit"
                        onClick={() => onEditWinery(winery)}
                      >
                        <Settings />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </>
      );
};

export default WineryTable;