import React from "react";
import ButtonDiv from "./components/Button";
import Modal from "./components/Modal";
import FoundContent from "./components/FoundContent";
// import LostContent from "./components/LostContent";


import "./css/App.css";

function App() {
  const [open, setOpen] = React.useState(false);
  const[modalType, setModalType] = React.useState<"lost" | "found" | null>(null); 

  const openModal = () => {
    setOpen(true);
  }

  const closeModal = () => {
    setOpen(false);
  }

  const lostClick = () => {
    setModalType("lost");
    openModal();
    
  };
  const foundClick = () => {
    setModalType("found");
    openModal();
  };

  return (
    <>
      <div id="main-buttons-group">
        <ButtonDiv label="Lost" onClick={lostClick} />
        <ButtonDiv label="Found" onClick={foundClick} />
      </div>

      <Modal open={open} onClose={closeModal}>
        {/* {modalType === "lost" && <LostContent />} */}
        {modalType === "found" && <FoundContent />}
      </Modal>
    </>
  );
}

export default App;
