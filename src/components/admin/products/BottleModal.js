import "./Modals.css";

function BottleModal({ bottle, onClose }) {
    if (!bottle) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Redigera flaska</h2>
  
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
  
          <div className="modal-actions">
            <button className="btn-danger">Ta bort</button>
            <button onClick={onClose}>Avbryt</button>
            <button className="btn-primary">Spara</button>
          </div>
        </div>
      </div>
    );
  }

  export default BottleModal;
  