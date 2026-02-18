import { useState } from "react";

export default function AddressModal({ onClose, onSave }) {
  const [address, setAddress] = useState("");

  const handleSave = () => {
    if (!address.trim()) return;
    onSave(address);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Add Address</h3>

        <textarea
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", height: "80px" }}
        />

        <div style={{ marginTop: "10px" }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
};
