import React, { useRef, useState } from "react";
import axios from "axios";

export default function UploadImage({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("File", file);

    try {
      setUploading(true);
      const res = await axios.post("/blob/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload?.(res.data.url); // send uploaded file URL back to parent
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Fel vid uppladdning");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => fileInputRef.current.click()}
        className="btn btn-secondary"
        disabled={uploading}
      >
        {uploading ? "Laddar upp..." : "Ladda upp bild"}
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
