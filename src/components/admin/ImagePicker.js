import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import "./products/Modals.css"

function ImagePicker({ onSelect, isOpen, onClose }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get("/blob/list").then((res) => setImages(res.data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Välj bild</h3>
        <div className="blob-image-grid">
          {images.map((url) => (
            <img
              key={url}
              src={url}
              alt=""
              onClick={() => {
                onSelect(url);
                onClose();
              }}
              className="blob-thumbnail"
            />
          ))}
        </div>
        <button onClick={onClose}>Stäng</button>
      </div>
    </div>
  );
}
export default ImagePicker;
