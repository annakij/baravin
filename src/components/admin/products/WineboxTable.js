import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";
import Loading from "../Loading";
import "./Products.css";
import { Settings } from "lucide-react";
import BoxModal from "./BoxModal";
import BottleModal from "./BottleModal";

function WineboxTable() {
    const [wineries, setWineries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredWineries, setFilteredWineries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedBottle, setSelectedBottle] = useState(null);
    
    useEffect(() => {
        const fetchWineries = async () => {
        try {
            const res = await api.get("/wineries");
            setWineries(res.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchWineries();
    }, []);

    // Search bar
    useEffect(() => {
        if (!searchTerm) {
            setFilteredWineries(wineries);
            return;
          }

        const term = searchTerm.toLowerCase();
      
        const filtered = wineries.filter(winery => {
          
          const matchesWinery = winery.name?.toLowerCase().includes(term);
      
          const matchesBox = winery.wineBoxes?.some(box =>
            box.name?.toLowerCase().includes(term) ||
            box.description?.toLowerCase().includes(term)
          );
      
          const matchesBottle = winery.wineBoxes?.some(box =>
            box.bottles?.some(bottle =>
              bottle.title?.toLowerCase().includes(term) ||
              bottle.grape?.toLowerCase().includes(term) ||
              bottle.area?.toLowerCase().includes(term)
            )
          );
      
          return matchesWinery || matchesBox || matchesBottle;
        });
      
        setFilteredWineries(filtered);
      }, [searchTerm, wineries]);

      function highlightMatch(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, "gi");
        const parts = text.split(regex);
      
        return parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : part
        );
      }
      

    if (loading) return < Loading />;
    if (error) return <p style={{ color: "red" }}>Fel: {error}</p>;

    return (
        <>
        <input
                type="text"
                placeholder="Sök på vinbox, druva, område..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
        <div className="admin-winebox-table">
        {filteredWineries.map((winery) => (
            <div key={winery.name} className="admin-winery-block">
            <p className="admin-winery-name">
                <strong>{highlightMatch(winery.name, searchTerm)}</strong>
            </p>
            <div className="admin-wineboxes-grid">
                {winery.wineBoxes.map((box) => (
                <div key={box.id} className="admin-winebox-card">
                    <div className="winebox-card-header">
                    <p className="admin-winebox-name">
                        {highlightMatch(box.name, searchTerm)}
                    </p>
                    <a className="winery-edit" onClick={() => setSelectedBox(box)}><Settings /></a>
                    </div>
                    <p className="admin-winebox-desc"><strong>Innehåll: </strong>{box.description}</p>
                    <p className="admin-winebox-price"><strong>Pris: </strong>{box.price} kr</p>
                    <p className="admin-winebox-qty"><strong>Lager: </strong> {box.availableQuantity}</p>

                    <div className="admin-bottles-grid">
                    {box.bottles.map((bottle) => (
                        <div key={bottle.id} className="admin-bottle-card">
                        <div className="winebox-card-header">
                        <p>
                            <strong>{highlightMatch(bottle.title, searchTerm)} </strong>
                        </p>
                        <a className="winery-edit" onClick={() => setSelectedBottle(bottle)}><Settings /></a>
                        </div>
                        <p className="sub"><strong>Område: </strong>{highlightMatch(bottle.area, searchTerm)}</p>
                        <p className="sub">
                            <strong>Druva: </strong>
                            {highlightMatch(bottle.grape, searchTerm)} ({bottle.year})
                        </p>
                        <p className="sub"><strong>Innehåll: </strong>{bottle.alcohol}, {bottle.wineMaking}</p>
                        <p className="sub"><strong>Beskrivning: </strong>{bottle.description}</p>
                        <p className="sub"><strong>Antal: </strong> {bottle.count}</p>
                        </div>
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </div>
        ))}

        <BoxModal box={selectedBox} onClose={() => setSelectedBox(null)} />
        <BottleModal bottle={selectedBottle} onClose={() => setSelectedBottle(null)} />

        </div>
        </>
    );
    }

export default WineboxTable;
