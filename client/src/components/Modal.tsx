import "../css/Modal.css";

export default function Modal({ open, onClose, children }) {
  if (!open) return null; // don't render anything if modal is closed

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {children}
      </div>
    </div>
  );
}
