import React from "react";
import "./StyleEmpower.css";

const StyleEmpower = () => {
  return (
    <div className="style-empower-container">
      <div className="style-empower-content" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9f9f9', display: 'none' }}>
        <h2 className="section-title" style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#2d2d2d',
          marginBottom: '15px',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          Luxury Scented Candles & Home Decor Gifts
        </h2>
        <div className="section-divider" style={{
          width: '80px',
          height: '3px',
          backgroundColor: '#333',
          margin: '0 auto'
        }}></div>
      </div>
    </div>
  );
};

export default StyleEmpower;
