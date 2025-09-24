import React from "react";
import "./Loading.css";

function Loading() {
  return (
    <div className="loading-container">
      <p>Laddar...</p>
      <div className="spinner"></div>
    </div>
  );
}

export default Loading;
