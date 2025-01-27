import { useState } from "react";
import BuyButtonComponent from "../../components/BuyButtonComponent/BuyButtonComponent";

export default function Billing() {
  const [showPriceTable, setShowPriceTable] = useState(false);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "2rem auto",
        maxWidth: "600px",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h2
          style={{ fontSize: "1.5rem", color: "#333", marginBottom: "0.5rem" }}
        >
          Pricing
        </h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          <li
            style={{
              fontSize: "1rem",
              marginBottom: "0.5rem",
              //   color: "#555",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Create Draft</span> <span>$0.25</span>
          </li>
          <li
            style={{
              fontSize: "1rem",
              marginBottom: "0.5rem",
              //   color: "#555",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Save Folder</span> <span>$0.75</span>
          </li>
        </ul>
      </div>
      <h2 style={{ fontSize: "1.25rem", color: "#333", marginBottom: "1rem" }}>
        Credit balance: <span style={{ color: "#0070f3" }}>$10.00</span>
      </h2>
      <button
        style={{
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.2s ease",
        }}
        onClick={() => setShowPriceTable(true)}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#005bb5")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#0070f3")}
      >
        Add to credit balance
      </button>
      {showPriceTable && <BuyButtonComponent />}
    </div>
  );
}
