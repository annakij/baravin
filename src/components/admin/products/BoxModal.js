import { Minus, Plus } from "lucide-react";
import "./Modals.css";

function BoxModal({ box, onClose }) {
    if (!box) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Redigera vinbox</h2>
  
          <label>Namn</label>
          <input type="text" defaultValue={box.name} />
  
          <label>Beskrivning</label>
          <textarea defaultValue={box.description}></textarea>
  
          <label>Pris (kr)</label>
          <input type="number" defaultValue={box.price} />
  
          <label>Lager</label>
          <input type="number" defaultValue={box.availableQuantity} />
  
          <h3>Flaskor i boxen</h3>
          <div className="modal-bottles-grid">
            {box.bottles.map((bottle) => (
              <div key={bottle.id} className="modal-bottle-card">
                <h4>{bottle.title}</h4>
  
                <label>Titel</label>
                <input type="text" defaultValue={bottle.title} />
  
                <label>År</label>
                <input type="number" defaultValue={bottle.year} />
  
                <label>Område</label>
                <input type="text" defaultValue={bottle.area} />
  
                <label>Druva</label>
                <input type="text" defaultValue={bottle.grape} />
  
                <label>Alkohol</label>
                <input type="text" defaultValue={bottle.alcohol} />
  
                <label>Tillverkning</label>
                <input type="text" defaultValue={bottle.wineMaking} />
  
                <label>Beskrivning</label>
                <textarea defaultValue={bottle.description}></textarea>
  
                <label>Antal</label>
                <input type="number" defaultValue={bottle.count} />
  
                <button className="btn-danger"> Ta bort flaska</button>
              </div>
            ))}
          </div>
  
          <button className="icon-modal-button"><Plus /> Flaska</button>

          <hr/>
  
          <div className="modal-actions">
            <button onClick={onClose}>Avbryt</button>
            <button>Spara ändringar</button>
          </div>
        </div>
      </div>
    );
  }

  export default BoxModal;
  