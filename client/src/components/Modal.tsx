import "../css/Modal.css";

export default function Modal({ open, onClose, children }) {
  if (!open) return null; // don't render anything if modal is closed

  const exitStyle: React.CSSProperties = {
    position: "absolute",
    top: "0px",
    right: "0px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "0px",
    cursor: "pointer",
    padding: "8px 12px",
    outline: "3px solid #23415c",

  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {children}
        <button style={exitStyle}onClick={onClose}></button>
      </div>
    </div>
  );
}
